import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, TouchableOpacity } from "react-native";
import { CalendarDays, ChevronDown, ChevronUp, Goal } from "lucide-react-native";
import Typography from "../atoms/Typography";
import TeamBadge from "../atoms/TeamBadge";
import {
  getTeamName,
  formatMatchShort,
  formatMatchDate,
  predictionOutcome,
} from "../../utils/match";
import { useThemeColors } from "../../theme/colors";

// Tarjeta de partido cerrado/finalizado con "drawer" (acordeón): al tocarla
// se despliega el detalle completo (marcador, tu predicción, puntos y acierto).
const OUTCOME_CLASS = {
  primary: "text-primary",
  secondary: "text-secondary",
  muted: "text-on-surface-variant",
};

// Fila de detalle (etiqueta + valor).
function DetailRow({ label, value, valueClass = "text-on-surface" }) {
  return (
    <View className="flex-row items-center justify-between py-1.5">
      <Typography variant="body-sm" className="text-on-surface-variant">
        {label}
      </Typography>
      <Typography variant="label-caps" className={valueClass}>
        {value}
      </Typography>
    </View>
  );
}

export default function ClosedMatchCard({ match }) {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const finished = match.status === "finished";
  const homeName = getTeamName(match.homeTeamId, match.homeTeamNameEn);
  const awayName = getTeamName(match.awayTeamId, match.awayTeamNameEn);
  const outcome = finished ? predictionOutcome(match.prediction) : null;
  const homeScorers = match.homeScorers || [];
  const awayScorers = match.awayScorers || [];

  return (
    <View
      className="rounded-xl p-4 mb-3"
      style={{
        backgroundColor: "rgba(19,27,46,0.4)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
      }}
    >
      <TouchableOpacity activeOpacity={0.85} onPress={() => setOpen((v) => !v)}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <CalendarDays color={colors.onSurfaceVariant} size={14} strokeWidth={2} />
            <Typography variant="label-caps" className="ml-1.5">
              {formatMatchShort(match.matchDate)}
            </Typography>
          </View>
          <View className="px-2 py-0.5 rounded-full bg-surface-variant">
            <Typography variant="label-caps">
              {finished ? t("matches.finished") : t("groupDetail.closed")}
            </Typography>
          </View>
        </View>

        {/* Equipos + resultado */}
        <View className="flex-row items-center justify-between">
          <View className="flex-1 items-center">
            <TeamBadge name={homeName} size={32} />
            <Typography variant="label-caps" className="mt-1 text-center" numberOfLines={1}>
              {homeName}
            </Typography>
          </View>

          <View className="items-center px-2">
            <View className="flex-row items-center">
              <Typography variant="score-display" className="text-on-surface-variant">
                {finished ? match.homeScore : "-"}
              </Typography>
              <Typography variant="label-caps" className="mx-3">
                {t("common.vs")}
              </Typography>
              <Typography variant="score-display" className="text-on-surface-variant">
                {finished ? match.awayScore : "-"}
              </Typography>
            </View>
            {finished && match.prediction ? (
              <Typography variant="label-caps" className="text-primary mt-1">
                +{match.prediction.points} pts
              </Typography>
            ) : null}
          </View>

          <View className="flex-1 items-center">
            <TeamBadge name={awayName} size={32} />
            <Typography variant="label-caps" className="mt-1 text-center" numberOfLines={1}>
              {awayName}
            </Typography>
          </View>
        </View>

        {/* Indicador del drawer */}
        <View className="flex-row items-center justify-center mt-3">
          <Typography variant="label-caps" className="mr-1">
            {open ? t("matches.hideDetail") : t("matches.showDetail")}
          </Typography>
          {open ? (
            <ChevronUp color={colors.onSurfaceVariant} size={16} />
          ) : (
            <ChevronDown color={colors.onSurfaceVariant} size={16} />
          )}
        </View>
      </TouchableOpacity>

      {/* Drawer expandible */}
      {open ? (
        <View className="mt-3 pt-3 border-t border-white/5">
          {/* Goleadores */}
          {finished && (homeScorers.length > 0 || awayScorers.length > 0) ? (
            <View className="mb-3">
              <View className="flex-row items-center mb-2">
                <Goal color={colors.primary} size={14} strokeWidth={2} />
                <Typography variant="label-caps" className="ml-1.5 text-primary">
                  {t("matches.scorers")}
                </Typography>
              </View>
              <View className="flex-row">
                <View className="flex-1 pr-2">
                  {homeScorers.length ? (
                    homeScorers.map((s, i) => (
                      <Typography key={`h${i}`} variant="body-sm" className="mb-0.5">
                        {s}
                      </Typography>
                    ))
                  ) : (
                    <Typography variant="body-sm" className="text-on-surface-variant">
                      —
                    </Typography>
                  )}
                </View>
                <View className="flex-1 pl-2 items-end">
                  {awayScorers.length ? (
                    awayScorers.map((s, i) => (
                      <Typography key={`a${i}`} variant="body-sm" className="mb-0.5 text-right">
                        {s}
                      </Typography>
                    ))
                  ) : (
                    <Typography variant="body-sm" className="text-on-surface-variant">
                      —
                    </Typography>
                  )}
                </View>
              </View>
              <View className="h-px bg-white/5 my-2" />
            </View>
          ) : null}

          <DetailRow label={t("matches.dateTime")} value={formatMatchDate(match.matchDate)} />
          <DetailRow
            label={t("matches.finalScore")}
            value={
              finished ? `${homeName} ${match.homeScore} - ${match.awayScore} ${awayName}` : "—"
            }
          />
          <DetailRow
            label={t("matches.predictionLabel")}
            value={
              match.prediction
                ? `${match.prediction.homeScore} - ${match.prediction.awayScore}`
                : t("matches.noPrediction")
            }
          />
          <DetailRow
            label={t("matches.pointsObtained")}
            value={match.prediction ? `+${match.prediction.points} ${t("common.points")}` : t("matches.zeroPts")}
            valueClass="text-primary"
          />
          {outcome ? (
            <DetailRow
              label={t("matches.resultLabel")}
              value={t(outcome.key)}
              valueClass={OUTCOME_CLASS[outcome.tone]}
            />
          ) : null}
        </View>
      ) : (
        // Vista compacta de la predicción cuando está colapsado.
        match.prediction ? (
          <View className="mt-4 pt-2 border-t border-white/5 flex-row justify-between">
            <Typography variant="body-sm" className="italic">
              {t("matches.yourPrediction", { home: match.prediction.homeScore, away: match.prediction.awayScore })}
            </Typography>
            {outcome ? (
              <Typography variant="label-caps" className={OUTCOME_CLASS[outcome.tone]}>
                {t(outcome.key)}
              </Typography>
            ) : null}
          </View>
        ) : null
      )}
    </View>
  );
}
