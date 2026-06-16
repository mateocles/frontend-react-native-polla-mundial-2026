import { TouchableOpacity, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import Typography from "../atoms/Typography";
import { useThemeColors } from "../../theme/colors";

// Fila de menú: icono + etiqueta + chevron. Para listas de ajustes.
export default function MenuRow({ icon: Icon, label, onPress }) {
  const colors = useThemeColors();
  return (
    <TouchableOpacity
      className="flex-row items-center bg-surface-container rounded-xl px-4 py-4 mb-2.5"
      style={{ borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" }}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {Icon ? (
        <View className="w-8">
          <Icon color={colors.primary} size={20} strokeWidth={2} />
        </View>
      ) : null}
      <Typography variant="body" className="flex-1">
        {label}
      </Typography>
      <ChevronRight color={colors.onSurfaceVariant} size={20} />
    </TouchableOpacity>
  );
}
