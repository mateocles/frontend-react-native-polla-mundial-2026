import { useState } from "react";
import { TextInput } from "react-native";
import { colors } from "../../theme/colors";

// Input de marcador con estética de scoreboard (Inter ExtraBold).
export default function ScoreInput({ value, onChangeText, editable = true }) {
  const [focused, setFocused] = useState(false);

  return (
    <TextInput
      className="bg-surface-container-lowest text-center rounded-lg w-14 mx-1"
      keyboardType="number-pad"
      maxLength={2}
      placeholder="–"
      placeholderTextColor={colors.outline}
      value={value}
      editable={editable}
      onChangeText={onChangeText}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        fontFamily: "Inter_800ExtraBold",
        fontSize: 22,
        letterSpacing: 1,
        color: colors.onSurface,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: focused ? colors.primary : colors.outlineVariant,
        opacity: editable ? 1 : 0.6,
      }}
    />
  );
}
