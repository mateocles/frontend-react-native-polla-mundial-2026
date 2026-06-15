import { useState } from "react";
import { dialog } from "../../store/useDialog";
import { View, Alert } from "react-native";
import { CalendarDays } from "lucide-react-native";
import Typography from "../atoms/Typography";
import TeamBadge from "../atoms/TeamBadge";
import ScoreInput from "../atoms/ScoreInput";
import Button from "../atoms/Button";
import {
  getTeamName,
  formatMatchShort,
  predictionOutcome,
  isMatchClosed,
} from "../../utils/match";
import { colors } from "../../theme/colors";

const OUTCOME_CLASS = {
  primary: "text-primary",
  secondary: "text-secondary",
  muted: "text-on-surface-variant",
};

// Tarjeta para predecir dentro de un grupo: editable si el partido está
// abierto; muestra resultado y acierto si ya finalizó.
export default function PredictionMatchCard({ match, onSubmit }) {
  const finished = match.status === "finished";
  // Cerrado = ya empezó o terminó. No se puede predecir ni modificar.
  const closed = isMatchClosed(match);
  const [home, setHome] = useState(
    match.prediction ? String(match.prediction.homeScore) : ""
  );
  const [away, setAway] = useState(
    match.prediction ? String(match.prediction.awayScore) : ""
  );
  const [saving, setSaving] = useState(false);

  const homeName = getTeamName(match.homeTeamId, match.homeTeamNameEn);
  const awayName = getTeamName(match.awayTeamId, match.awayTeamNameEn);
  const outcome = finished ? predictionOutcome(match.prediction) : null;

  const handleSave = async () => {
    if (home === "" || away === "") {
      dialog.alert("Ingresa ambos marcadores.", { title: "Faltan datos" });
      return;
    }
    setSaving(true);
    try {
      await onSubmit(match.id, parseInt(home, 10), parseInt(away, 10));
      dialog.alert("Tu pronóstico fue registrado.", { title: "¡Predicción guardada!", tone: "success" });
    } catch (e) {
      dialog.alert(e?.response?.data?.error || "No se pudo guardar.", { title: "Error", tone: "danger" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <View
      className="rounded-xl p-4 mb-3"
      style={{
        backgroundColor: "rgba(30,41,59,0.7)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
      }}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <CalendarDays color={colors.onSurfaceVariant} size={14} strokeWidth={2} />
          <Typography variant="label-caps" className="ml-1.5">
            {formatMatchShort(match.matchDate)}
          </Typography>
        </View>
        {finished && match.prediction ? (
          <Typography variant="label-caps" className="text-primary">
            +{match.prediction.points} pts
          </Typography>
        ) : finished ? (
          <Typography variant="label-caps">Final</Typography>
        ) : closed ? (
          <Typography variant="label-caps">Cerrado</Typography>
        ) : null}
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-1 items-center">
          <TeamBadge name={homeName} size={40} />
          <Typography variant="label-caps" className="mt-1.5 text-center" numberOfLines={1}>
            {homeName}
          </Typography>
        </View>

        <View className="px-2 items-center">
          {finished ? (
            <View className="flex-row items-center">
              <Typography variant="score-display">{match.homeScore}</Typography>
              <Typography variant="headline-md" className="text-on-surface-variant mx-2">-</Typography>
              <Typography variant="score-display">{match.awayScore}</Typography>
            </View>
          ) : closed ? (
            // Empezó pero sin resultado aún: bloqueado, sin inputs.
            <Typography variant="headline-md" className="text-on-surface-variant">VS</Typography>
          ) : (
            <View className="flex-row items-center">
              <ScoreInput value={home} onChangeText={setHome} editable />
              <Typography variant="label-caps" className="mx-1">vs</Typography>
              <ScoreInput value={away} onChangeText={setAway} editable />
            </View>
          )}
        </View>

        <View className="flex-1 items-center">
          <TeamBadge name={awayName} size={40} />
          <Typography variant="label-caps" className="mt-1.5 text-center" numberOfLines={1}>
            {awayName}
          </Typography>
        </View>
      </View>

      {finished ? (
        match.prediction ? (
          <View className="mt-3 pt-2 border-t border-white/5 flex-row justify-between">
            <Typography variant="body-sm" className="italic">
              Tu predicción: {match.prediction.homeScore} - {match.prediction.awayScore}
            </Typography>
            {outcome ? (
              <Typography variant="label-caps" className={OUTCOME_CLASS[outcome.tone]}>
                +{match.prediction.points} pts · {outcome.label}
              </Typography>
            ) : null}
          </View>
        ) : null
      ) : closed ? (
        // El partido ya comenzó: pronósticos cerrados.
        <View className="mt-3 pt-2 border-t border-white/5 flex-row justify-between">
          <Typography variant="body-sm" className="italic">
            {match.prediction
              ? `Tu predicción: ${match.prediction.homeScore} - ${match.prediction.awayScore}`
              : "Sin predicción"}
          </Typography>
          <Typography variant="label-caps" className="text-on-surface-variant">
            Pronósticos cerrados
          </Typography>
        </View>
      ) : (
        <Button
          className="mt-3 bg-primary/10"
          variant="secondary"
          size="sm"
          loading={saving}
          onPress={handleSave}
          title="Guardar Pronóstico"
        />
      )}
    </View>
  );
}
