import { useState } from "react";
import { TextInput } from "react-native";
import { colors } from "../../theme/colors";

// Campo de texto con look "inset" y estado de foco con glow esmeralda.
export default function Input({ className = "", style, onFocus, onBlur, ...props }) {
  const [focused, setFocused] = useState(false);

  return (
    <TextInput
      className={`bg-surface-container-lowest rounded-lg px-4 py-3.5 ${className}`}
      placeholderTextColor={colors.onSurfaceVariant}
      style={[
        {
          fontFamily: "Inter_400Regular",
          fontSize: 16,
          color: colors.onSurface,
          borderWidth: 1,
          borderColor: focused ? colors.primary : colors.outlineVariant,
          shadowColor: colors.primary,
          shadowOpacity: focused ? 0.35 : 0,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 0 },
        },
        style,
      ]}
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      {...props}
    />
  );
}
