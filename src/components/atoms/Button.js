import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { colors } from "../../theme/colors";

// Botón del design system "Pitch Dark Kinetic".
// - primary: fondo emerald, texto oscuro bold (CTA: "Submit Prediction").
// - secondary: contorno emerald, texto emerald, fondo transparente.
// - ghost: sin fondo/borde, texto atenuado (Cancel / View Rules).
// - danger: fondo de error.
const VARIANT_CLASSES = {
  primary: "bg-primary",
  secondary: "bg-transparent border border-primary",
  ghost: "bg-transparent",
  danger: "bg-error-container",
};

const TEXT_COLOR = {
  primary: colors.onPrimary,
  secondary: colors.primary,
  ghost: colors.onSurfaceVariant,
  danger: colors.onErrorContainer,
};

const SIZE_CLASSES = {
  md: "py-4 px-6",
  sm: "py-2.5 px-4",
};

export default function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "right",
  className = "",
}) {
  const textColor = TEXT_COLOR[variant];
  // Glow esmeralda en el CTA primario (como el shadow del diseño).
  const glow =
    variant === "primary"
      ? {
          shadowColor: colors.primary,
          shadowOpacity: 0.35,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 4 },
          elevation: 6,
        }
      : null;
  return (
    <TouchableOpacity
      className={`flex-row rounded-xl items-center justify-center ${VARIANT_CLASSES[variant]} ${
        SIZE_CLASSES[size]
      } ${disabled || loading ? "opacity-50" : ""} ${className}`}
      style={glow}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {Icon && iconPosition === "left" ? (
            <Icon color={textColor} size={18} strokeWidth={2.2} style={{ marginRight: 8 }} />
          ) : null}
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 15,
              letterSpacing: 0.3,
              color: textColor,
            }}
          >
            {title}
          </Text>
          {Icon && iconPosition === "right" ? (
            <Icon color={textColor} size={18} strokeWidth={2.2} style={{ marginLeft: 8 }} />
          ) : null}
        </>
      )}
    </TouchableOpacity>
  );
}
