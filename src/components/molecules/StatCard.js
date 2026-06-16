import { View } from "react-native";
import Card from "../atoms/Card";
import Typography from "../atoms/Typography";
import { useThemeColors } from "../../theme/colors";

// Tarjeta de estadística: etiqueta + valor. `highlight` usa el score-display
// esmeralda (para el dato principal); `icon` opcional a la derecha.
export default function StatCard({
  label,
  value,
  highlight = false,
  icon: Icon,
  className = "",
}) {
  const colors = useThemeColors();
  return (
    <Card className={`flex-row items-center justify-between ${className}`}>
      <View className="flex-1">
        <Typography variant="label-caps">{label}</Typography>
        <Typography
          variant={highlight ? "score-display" : "headline-md"}
          className={highlight ? "text-primary mt-1" : "mt-1"}
        >
          {value}
        </Typography>
      </View>
      {Icon ? <Icon color={colors.primary} size={highlight ? 28 : 20} strokeWidth={2} /> : null}
    </Card>
  );
}
