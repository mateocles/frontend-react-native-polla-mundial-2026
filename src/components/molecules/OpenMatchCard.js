import { View } from "react-native";
import { CalendarDays } from "lucide-react-native";
import Typography from "../atoms/Typography";
import TeamBadge from "../atoms/TeamBadge";
import { getTeamName, formatMatchShort } from "../../utils/match";
import { colors } from "../../theme/colors";

// Tarjeta de partido abierto (glass) — SOLO LECTURA. Las predicciones se
// realizan desde la sección de Grupos, no desde aquí.
export default function OpenMatchCard({ match }) {
  const homeName = getTeamName(match.homeTeamId, match.homeTeamNameEn);
  const awayName = getTeamName(match.awayTeamId, match.awayTeamNameEn);

  return (
    <View
      className="rounded-xl p-4 mb-3"
      style={{
        backgroundColor: "rgba(30,41,59,0.7)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
      }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <CalendarDays color={colors.onSurfaceVariant} size={14} strokeWidth={2} />
          <Typography variant="label-caps" className="ml-1.5">
            {formatMatchShort(match.matchDate)}
          </Typography>
        </View>
        <View className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
          <Typography variant="label-caps" className="text-primary">
            Abierto
          </Typography>
        </View>
      </View>

      {/* Equipos */}
      <View className="flex-row items-center justify-between py-3">
        <View className="flex-1 items-center">
          <TeamBadge name={homeName} size={48} />
          <Typography variant="label-caps" className="text-on-surface mt-2 text-center" numberOfLines={1}>
            {homeName}
          </Typography>
        </View>
        <Typography variant="headline-md" className="text-on-surface-variant px-2">
          VS
        </Typography>
        <View className="flex-1 items-center">
          <TeamBadge name={awayName} size={48} />
          <Typography variant="label-caps" className="text-on-surface mt-2 text-center" numberOfLines={1}>
            {awayName}
          </Typography>
        </View>
      </View>

      {/* Predicción existente (solo lectura) */}
      {match.prediction ? (
        <View className="bg-surface-container-lowest rounded-lg px-3 py-2 flex-row items-center justify-center">
          <Typography variant="body-sm" className="text-on-surface-variant">
            Tu predicción: {match.prediction.homeScore} - {match.prediction.awayScore}
          </Typography>
        </View>
      ) : null}
    </View>
  );
}
