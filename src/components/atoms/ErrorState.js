import { View, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { CloudOff, RotateCw } from "lucide-react-native";
import Typography from "./Typography";
import { useThemeColors } from "../../theme/colors";

// Estado de error de carga de un servicio: mensaje amigable + botón reintentar.
export default function ErrorState({ onRetry, message }) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  return (
    <View className="items-center justify-center mt-16 px-8">
      <View className="w-16 h-16 rounded-full items-center justify-center mb-4" style={{ backgroundColor: "rgba(255,180,162,0.12)" }}>
        <CloudOff color={colors.error} size={28} strokeWidth={2} />
      </View>
      <Typography variant="body-sm" className="text-center mb-5">
        {message || t("common.serviceError")}
      </Typography>
      {onRetry ? (
        <TouchableOpacity
          className="flex-row items-center rounded-xl px-5 py-3 bg-primary"
          onPress={onRetry}
          activeOpacity={0.85}
        >
          <RotateCw color={colors.onPrimary} size={18} strokeWidth={2.2} />
          <Typography variant="body" className="ml-2" style={{ color: colors.onPrimary, fontFamily: "Inter_700Bold" }}>
            {t("common.retry")}
          </Typography>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
