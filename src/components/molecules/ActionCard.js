import { TouchableOpacity, View } from "react-native";
import Typography from "../atoms/Typography";

// Tarjeta de acción (glass): caja de icono + título + subtítulo.
// `tone`: 'primary' | 'secondary' (color de la caja del icono).
export default function ActionCard({ icon: Icon, title, subtitle, tone = "primary", onPress, iconColor }) {
  const boxBg = tone === "secondary" ? "bg-secondary/20" : "bg-primary/20";
  return (
    <TouchableOpacity
      className="rounded-xl p-5 flex-row items-center mb-4"
      style={{
        backgroundColor: "rgba(30,41,59,0.7)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
      }}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View className={`w-12 h-12 rounded-lg items-center justify-center mr-4 ${boxBg}`}>
        <Icon color={iconColor} size={22} strokeWidth={2} />
      </View>
      <View className="flex-1">
        <Typography variant="body" className="font-bold" style={{ fontFamily: "Inter_700Bold" }}>
          {title}
        </Typography>
        <Typography variant="body-sm" className="mt-0.5">
          {subtitle}
        </Typography>
      </View>
    </TouchableOpacity>
  );
}
