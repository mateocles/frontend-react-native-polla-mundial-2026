import { View } from "react-native";
import Typography from "../atoms/Typography";
import TeamBadge from "../atoms/TeamBadge";
import { getTeamName } from "../../utils/match";
import { colors } from "../../theme/colors";

// Tarjeta de partido EN VIVO: marcador actual + badge rojo.
export default function LiveMatchCard({ match }) {
  const home = getTeamName(match.homeTeamId, match.homeTeamNameEn);
  const away = getTeamName(match.awayTeamId, match.awayTeamNameEn);

  return (
    <View
      className="rounded-xl p-4 mb-3"
      style={{
        backgroundColor: "rgba(30,41,59,0.7)",
        borderWidth: 1,
        borderColor: "rgba(255,180,162,0.4)",
        borderLeftWidth: 3,
        borderLeftColor: colors.tertiary,
      }}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(255,180,162,0.15)" }}>
          <View className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: colors.tertiary }} />
          <Typography variant="label-caps" style={{ color: colors.tertiary }}>
            En vivo
          </Typography>
        </View>
        {match.prediction ? (
          <Typography variant="label-caps">
            Tu predicción: {match.prediction.homeScore} - {match.prediction.awayScore}
          </Typography>
        ) : null}
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-1 items-center">
          <TeamBadge name={home} size={40} />
          <Typography variant="label-caps" className="mt-1.5 text-center" numberOfLines={1}>
            {home}
          </Typography>
        </View>
        <View className="px-2 flex-row items-center">
          <Typography variant="score-display">{match.homeScore ?? 0}</Typography>
          <Typography variant="headline-md" className="text-on-surface-variant mx-2">-</Typography>
          <Typography variant="score-display">{match.awayScore ?? 0}</Typography>
        </View>
        <View className="flex-1 items-center">
          <TeamBadge name={away} size={40} />
          <Typography variant="label-caps" className="mt-1.5 text-center" numberOfLines={1}>
            {away}
          </Typography>
        </View>
      </View>
    </View>
  );
}
