import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeColors } from "../../theme/colors";

// Fondo "Pitch Dark Kinetic" para pantallas de bienvenida:
// gradiente diagonal + orbe de luz esmeralda difusa.
export default function HeroBackground() {
  const colors = useThemeColors();
  return (
    <View className="absolute inset-0" pointerEvents="none">
      <LinearGradient
        colors={[
          colors.surfaceContainerLowest,
          colors.surface,
          colors.surfaceContainerLow,
        ]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={{ flex: 1 }}
      />
      {/* Orbe de luz (glow) */}
      <View
        className="absolute rounded-full"
        style={{
          width: 460,
          height: 460,
          top: -200,
          left: -160,
          backgroundColor: colors.primary,
          opacity: 0.08,
        }}
      />
    </View>
  );
}
