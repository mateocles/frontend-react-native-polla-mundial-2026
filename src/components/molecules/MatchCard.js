import { useState } from "react";
import { View, Alert } from "react-native";
import { CalendarDays } from "lucide-react-native";
import Card from "../atoms/Card";
import Typography from "../atoms/Typography";
import Badge from "../atoms/Badge";
import TeamBadge from "../atoms/TeamBadge";
import ScoreInput from "../atoms/ScoreInput";
import Button from "../atoms/Button";
import {
  isMatchClosed,
  getTeamName,
  formatMatchShort,
  predictionOutcome,
} from "../../utils/match";
import { colors } from "../../theme/colors";

// Tarjeta de partido de la cartelera. Layout: header (fecha + estado),
// equipos con bandera y marcador (inputs si está abierto, resultado si cerró)
// y footer con la predicción del usuario.
const OUTCOME_CLASS = {
  primary: "text-primary",
  secondary: "text-secondary",
  muted: "text-on-surface-variant",
};

export default function MatchCard({ match, onSubmit }) {
  const closed = isMatchClosed(match);
  const finished = match.status === "finished";
  const [home, setHome] = useState(
    match.prediction ? String(match.prediction.homeScore) : ""
  );
  const [away, setAway] = useState(
    match.prediction ? String(match.prediction.awayScore) : ""
  );
  const [saving, setSaving] = useState(false);

  const homeName = getTeamName(match.homeTeamId, match.homeTeamNameEn);
  const awayName = getTeamName(match.awayTeamId, match.awayTeamNameEn);

  const badge = finished
    ? { tone: "closed", label: "Finalizado" }
    : closed
    ? { tone: "closed", label: "Cerrado" }
    : { tone: "open", label: "Abierto" };

  const outcome = finished ? predictionOutcome(match.prediction) : null;

  const handleSave = async () => {
    if (home === "" || away === "") {
      Alert.alert("Faltan datos", "Ingresa ambos marcadores.");
      return;
    }
    setSaving(true);
    try {
      await onSubmit(match.id, parseInt(home, 10), parseInt(away, 10));
      Alert.alert("Guardado", "Tu predicción fue registrada.");
    } catch (e) {
      Alert.alert("Error", e?.response?.data?.error || "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="mb-3">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <CalendarDays color={colors.onSurfaceVariant} size={14} strokeWidth={2} />
          <Typography variant="label-caps" className="ml-1.5">
            {formatMatchShort(match.matchDate)}
          </Typography>
        </View>
        <Badge tone={badge.tone} label={badge.label} />
      </View>

      {/* Equipos + marcador */}
      <View className="flex-row items-center">
        <View className="flex-1 items-center">
          <TeamBadge name={homeName} />
          <Typography variant="label-caps" className="text-on-surface mt-2 text-center" numberOfLines={1}>
            {homeName}
          </Typography>
        </View>

        <View className="px-2 items-center">
          {finished ? (
            <View className="flex-row items-center">
              <Typography variant="score-display">{match.homeScore}</Typography>
              <Typography variant="headline-md" className="text-on-surface-variant mx-2">
                -
              </Typography>
              <Typography variant="score-display">{match.awayScore}</Typography>
            </View>
          ) : closed ? (
            <Typography variant="headline-md" className="text-on-surface-variant">
              VS
            </Typography>
          ) : (
            <View className="flex-row items-center">
              <ScoreInput value={home} onChangeText={setHome} editable />
              <Typography variant="label-caps" className="mx-1">
                vs
              </Typography>
              <ScoreInput value={away} onChangeText={setAway} editable />
            </View>
          )}
        </View>

        <View className="flex-1 items-center">
          <TeamBadge name={awayName} />
          <Typography variant="label-caps" className="text-on-surface mt-2 text-center" numberOfLines={1}>
            {awayName}
          </Typography>
        </View>
      </View>

      {/* Footer: predicción / resultado */}
      {match.prediction && (
        <View className="bg-surface-container-lowest rounded-lg mt-4 px-3 py-2 flex-row items-center justify-between">
          <Typography variant="body-sm">
            {`Tu predicción: ${match.prediction.homeScore} - ${match.prediction.awayScore}`}
          </Typography>
          {finished && outcome ? (
            <Typography variant="label-caps" className={OUTCOME_CLASS[outcome.tone]}>
              {match.prediction?.points > 0
                ? `+${match.prediction.points} pts · ${outcome.label}`
                : outcome.label}
            </Typography>
          ) : null}
        </View>
      )}

      {!closed && (
        <Button
          className="mt-3"
          size="sm"
          loading={saving}
          onPress={handleSave}
          title={`${match.prediction ? "Actualizar" : "Enviar"} predicción`}
        />
      )}
    </Card>
  );
}
