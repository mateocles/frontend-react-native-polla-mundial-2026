import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, View, FlatList, TouchableOpacity } from "react-native";
import { X } from "lucide-react-native";
import Avatar from "../atoms/Avatar";
import Typography from "../atoms/Typography";
import EmptyState from "../atoms/EmptyState";
import { PredictionService } from "../../api/services/predictionService";
import { getTeamName, formatMatchShort, predictionOutcome } from "../../utils/match";
import { useThemeColors } from "../../theme/colors";

const OUTCOME_CLASS = {
  primary: "text-primary",
  secondary: "text-secondary",
  muted: "text-on-surface-variant",
};

// Modal con los pronósticos de otro usuario (solo partidos ya iniciados).
export default function UserPredictionsModal({ user, groupId, onClose }) {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!user) return;
    setData(null);
    PredictionService.getUserPredictions(user.userId, groupId)
      .then(setData)
      .catch(() => setData({ matches: [] }));
  }, [user, groupId]);

  const items = (data?.matches || []).filter((m) => m.prediction);

  return (
    <Modal visible={!!user} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(6,13,32,0.7)" }}>
        <View
          className="bg-surface-container rounded-t-2xl p-5"
          style={{ maxHeight: "80%", borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" }}
        >
          <View className="flex-row items-center mb-4">
            <Avatar name={user?.name} uri={user?.avatarUrl} size={40} />
            <View className="ml-3 flex-1">
              <Typography variant="headline-md" numberOfLines={1}>
                {user?.name}
              </Typography>
              <Typography variant="label-caps">{t("groupDetail.predictions")}</Typography>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={8} className="ml-2">
              <X color={colors.onSurfaceVariant} size={22} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={items}
            keyExtractor={(m) => m.id}
            showsVerticalScrollIndicator
            style={{ maxHeight: 360 }}
            ListEmptyComponent={
              <EmptyState message={data ? t("groupDetail.noClosedPredictions") : t("common.loading")} />
            }
            renderItem={({ item: m }) => {
              const outcome = m.status === "finished" ? predictionOutcome(m.prediction) : null;
              return (
                <View
                  className="rounded-xl p-3 mb-2"
                  style={{ backgroundColor: "rgba(30,41,59,0.7)", borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" }}
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <Typography variant="label-caps">{formatMatchShort(m.matchDate)}</Typography>
                    {m.status === "finished" && (
                      <Typography variant="label-caps" className="text-primary">
                        +{m.prediction.points} pts
                      </Typography>
                    )}
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Typography variant="body-sm" className="flex-1 font-bold" numberOfLines={1}>
                      {getTeamName(m.homeTeamId, m.homeTeamNameEn)}
                    </Typography>
                    <Typography variant="headline-md" className="px-3">
                      {m.prediction.homeScore} - {m.prediction.awayScore}
                    </Typography>
                    <Typography variant="body-sm" className="flex-1 font-bold text-right" numberOfLines={1}>
                      {getTeamName(m.awayTeamId, m.awayTeamNameEn)}
                    </Typography>
                  </View>
                  {m.status === "finished" && (
                    <View className="flex-row items-center justify-between mt-2">
                      <Typography variant="body-sm">
                        {t("groupDetail.real", { home: m.homeScore, away: m.awayScore })}
                      </Typography>
                      {outcome && (
                        <Typography variant="label-caps" className={OUTCOME_CLASS[outcome.tone]}>
                          {t(outcome.key)}
                        </Typography>
                      )}
                    </View>
                  )}
                </View>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
}
