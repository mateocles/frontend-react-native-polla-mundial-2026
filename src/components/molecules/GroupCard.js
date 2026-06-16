import { useTranslation } from "react-i18next";
import { View, TouchableOpacity, Alert } from "react-native";
import { dialog } from "../../store/useDialog";
import * as Clipboard from "expo-clipboard";
import { Users, Copy, BarChart3 } from "lucide-react-native";
import Typography from "../atoms/Typography";
import Button from "../atoms/Button";
import { useThemeColors } from "../../theme/colors";

// Tarjeta de grupo (glass): nombre, participantes, rank, código (copiar) y
// botón "Ver Ranking".
export default function GroupCard({ group, onOpenRanking }) {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const copyCode = async () => {
    await Clipboard.setStringAsync(group.inviteCode);
    dialog.alert(t("groups.codeCopied", { code: group.inviteCode }), { title: t("groups.copied"), tone: "success" });
  };

  return (
    <View
      className="rounded-xl p-5 mb-4"
      style={{
        backgroundColor: "rgba(30,41,59,0.7)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
      }}
    >
      {/* Header: nombre + rank */}
      <View className="flex-row justify-between items-start">
        <View className="flex-1 pr-2">
          <Typography variant="headline-md" className="mb-1" numberOfLines={1}>
            {group.name}
          </Typography>
          <View className="flex-row items-center">
            <Users color={colors.onSurfaceVariant} size={16} strokeWidth={2} />
            <Typography variant="body-sm" className="ml-1.5">
              {t("groups.participants", { count: group.memberCount ?? 0 })}
            </Typography>
          </View>
        </View>
        {group.myRank ? (
          <View className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            <Typography variant="label-caps" className="text-primary">
              {t("groups.rank", { rank: group.myRank })}
            </Typography>
          </View>
        ) : null}
      </View>

      {/* Código de invitación */}
      <View
        className="bg-surface-container-low rounded-lg p-4 mt-4 flex-row justify-between items-center"
        style={{ borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" }}
      >
        <View>
          <Typography variant="label-caps">{t("groups.inviteCode")}</Typography>
          <Typography
            className="text-primary mt-1"
            style={{ fontFamily: "Inter_700Bold", fontSize: 16, letterSpacing: 2 }}
          >
            {group.inviteCode}
          </Typography>
        </View>
        <TouchableOpacity onPress={copyCode} hitSlop={8}>
          <Copy color={colors.onSurfaceVariant} size={20} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Ver Ranking */}
      <Button
        className="mt-4"
        title={t("groups.viewRanking")}
        icon={BarChart3}
        iconPosition="left"
        onPress={onOpenRanking}
      />
    </View>
  );
}
