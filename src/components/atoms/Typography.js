import { Text } from "react-native";

// Escala tipográfica del design system "Pitch Dark Kinetic" (fuente Inter).
// IMPORTANTE: el color NO va en el `style` inline, sino como clase por defecto,
// para que cualquier `className` del caller (p. ej. text-primary) lo sobreescriba.
// (En NativeWind el `style` inline gana sobre las clases de color.)
const VARIANTS = {
  "headline-lg": {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  "headline-md": {
    fontFamily: "Inter_600SemiBold",
    fontSize: 20,
    lineHeight: 28,
  },
  "score-display": {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: 1.8,
  },
  body: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    lineHeight: 24,
  },
  "body-sm": {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  "label-caps": {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
};

// Color por defecto de cada rol (como clase, sobreescribible por className).
const DEFAULT_COLOR = {
  "headline-lg": "text-on-surface",
  "headline-md": "text-on-surface",
  "score-display": "text-on-surface",
  body: "text-on-surface",
  "body-sm": "text-on-surface-variant",
  "label-caps": "text-on-surface-variant",
};

export default function Typography({
  variant = "body",
  style,
  className = "",
  children,
  ...props
}) {
  return (
    <Text
      style={[VARIANTS[variant] || VARIANTS.body, style]}
      className={`${DEFAULT_COLOR[variant] || "text-on-surface"} ${className}`}
      {...props}
    >
      {children}
    </Text>
  );
}
