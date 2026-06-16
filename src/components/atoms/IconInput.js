import { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import Typography from "./Typography";
import { colors, useThemeColors } from "../../theme/colors";

// Input con icono líder del design system "Pitch Dark Kinetic".
// variant:
//  - "filled" (registro): bg surface-container, h-56, rounded-xl,
//    icono/label se vuelven primary al enfocar.
//  - "inset" (login): bg surface-container-lowest, h-48, rounded-lg,
//    icono/label en tono atenuado.
// `label` (opcional) se renderiza arriba. `secure` activa el toggle de ojo.
const VARIANTS = {
  filled: {
    bg: "bg-surface-container",
    rounded: "rounded-xl",
    height: 56,
    labelMuted: colors.onSurfaceVariant,
    iconIdle: colors.outline,
    accentOnFocus: true,
  },
  inset: {
    bg: "bg-surface-container-lowest",
    rounded: "rounded-lg",
    height: 48,
    labelMuted: colors.onSurfaceVariant,
    iconIdle: colors.onSurfaceVariant,
    accentOnFocus: false,
  },
};

export default function IconInput({
  icon: Icon,
  label,
  secure = false,
  variant = "filled",
  className = "",
  ...props
}) {
  const colors = useThemeColors();
  const v = VARIANTS[variant] || VARIANTS.filled;
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secure);

  const iconColor = focused ? colors.primary : v.iconIdle;
  const labelColor = focused && v.accentOnFocus ? colors.primary : v.labelMuted;

  return (
    <View className={className}>
      {label ? (
        <Typography variant="label-caps" className="px-1 mb-1.5" style={{ color: labelColor }}>
          {label}
        </Typography>
      ) : null}
      <View
        className={`flex-row items-center px-4 ${v.bg} ${v.rounded}`}
        style={{
          height: v.height,
          borderWidth: 1,
          borderColor: focused ? colors.primary : colors.outlineVariant,
          shadowColor: colors.primary,
          shadowOpacity: focused ? 0.25 : 0,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 0 },
        }}
      >
        {Icon ? <Icon color={iconColor} size={20} strokeWidth={2} /> : null}
        <TextInput
          className="flex-1 h-full px-3"
          placeholderTextColor={colors.outlineVariant}
          secureTextEntry={hidden}
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 16,
            color: colors.onSurface,
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {secure ? (
          <TouchableOpacity onPress={() => setHidden((h) => !h)} hitSlop={8}>
            {hidden ? (
              <EyeOff color={colors.outlineVariant} size={20} strokeWidth={2} />
            ) : (
              <Eye color={colors.primary} size={20} strokeWidth={2} />
            )}
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}
