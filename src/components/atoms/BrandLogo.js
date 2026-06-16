import { View } from "react-native";
import Svg, { Circle, Polygon, Line } from "react-native-svg";
import { useThemeColors } from "../../theme/colors";

// Logo de marca: balón de fútbol en line-art esmeralda dentro de un círculo.
export default function BrandLogo({ size = 72 }) {
  const colors = useThemeColors();
  const s = size * 0.55;
  return (
    <View
      className="rounded-full bg-surface-container-high items-center justify-center"
      style={{
        width: size,
        height: size,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
        shadowColor: colors.primary,
        shadowOpacity: 0.4,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 0 },
        elevation: 8,
      }}
    >
      <Svg width={s} height={s} viewBox="0 0 48 48">
        <Circle
          cx="24"
          cy="24"
          r="20"
          stroke={colors.primary}
          strokeWidth="2.5"
          fill="none"
        />
        <Polygon
          points="24,14 31,19 28,28 20,28 17,19"
          fill={colors.primary}
        />
        <Line x1="24" y1="4" x2="24" y2="14" stroke={colors.primary} strokeWidth="2" />
        <Line x1="31" y1="19" x2="42" y2="16" stroke={colors.primary} strokeWidth="2" />
        <Line x1="28" y1="28" x2="36" y2="38" stroke={colors.primary} strokeWidth="2" />
        <Line x1="20" y1="28" x2="12" y2="38" stroke={colors.primary} strokeWidth="2" />
        <Line x1="17" y1="19" x2="6" y2="16" stroke={colors.primary} strokeWidth="2" />
      </Svg>
    </View>
  );
}
