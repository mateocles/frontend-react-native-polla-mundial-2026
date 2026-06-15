import { Modal, View, TouchableOpacity } from "react-native";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react-native";
import Typography from "../atoms/Typography";
import { colors } from "../../theme/colors";

const TONES = {
  default: { icon: Info, color: colors.primary, btn: colors.primary, btnText: colors.onPrimary },
  danger: { icon: AlertTriangle, color: colors.error, btn: colors.error, btnText: "#690005" },
  success: { icon: CheckCircle2, color: colors.primary, btn: colors.primary, btnText: colors.onPrimary },
};

// Host global de diálogos. Montar una sola vez en App.
import { useDialog } from "../../store/useDialog";

export default function DialogHost() {
  const state = useDialog((s) => s.state);
  const close = useDialog((s) => s.close);

  const tone = TONES[state?.tone] || TONES.default;
  const Icon = tone.icon;
  const isConfirm = state?.type === "confirm";

  return (
    <Modal visible={!!state} transparent animationType="fade" onRequestClose={() => close(false)}>
      <View className="flex-1 items-center justify-center px-8" style={{ backgroundColor: "rgba(6,13,32,0.7)" }}>
        <View
          className="bg-surface-container rounded-2xl p-6 w-full max-w-xs items-center"
          style={{ borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" }}
        >
          <View className="w-14 h-14 rounded-full bg-surface-container-high items-center justify-center mb-4">
            <Icon color={tone.color} size={28} strokeWidth={2} />
          </View>
          {state?.title ? (
            <Typography variant="headline-md" className="mb-1 text-center">
              {state.title}
            </Typography>
          ) : null}
          <Typography variant="body-sm" className="text-center mb-6">
            {state?.message}
          </Typography>

          <View className="flex-row" style={{ gap: 12 }}>
            {isConfirm ? (
              <TouchableOpacity
                className="flex-1 h-11 rounded-xl items-center justify-center bg-surface-container-highest"
                onPress={() => close(false)}
              >
                <Typography variant="body" className="font-bold">
                  {state?.cancelText || "Cancelar"}
                </Typography>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              className="flex-1 h-11 rounded-xl items-center justify-center"
              style={{ backgroundColor: tone.btn }}
              onPress={() => close(true)}
            >
              <Typography variant="body" style={{ color: tone.btnText, fontFamily: "Inter_700Bold" }}>
                {state?.confirmText || (isConfirm ? "Confirmar" : "Aceptar")}
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
