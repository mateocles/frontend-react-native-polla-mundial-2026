import { useState } from "react";
import { View, Text, Image } from "react-native";
import { teamFlagUrl } from "../../utils/flags";
import { useThemeColors } from "../../theme/colors";

// Insignia de selección: bandera real desde flagcdn.com (imagen). Si no hay
// código o falla la carga, muestra las iniciales del nombre.
export default function TeamBadge({ name, size = 48 }) {
  const colors = useThemeColors();
  const [failed, setFailed] = useState(false);
  // Pedimos ~2x para nitidez en retina.
  const width = size <= 32 ? 80 : 160;
  const url = teamFlagUrl(name, width);

  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  const ringStyle = {
    width: size,
    height: size,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  };

  if (url && !failed) {
    return (
      <View className="rounded-full bg-surface-container-high" style={ringStyle}>
        <Image
          source={{ uri: url }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
          onError={() => setFailed(true)}
        />
      </View>
    );
  }

  return (
    <View
      className="rounded-full bg-surface-container-high items-center justify-center"
      style={ringStyle}
    >
      <Text
        style={{
          fontFamily: "Inter_700Bold",
          fontSize: size * 0.3,
          color: colors.onSurfaceVariant,
        }}
      >
        {initials}
      </Text>
    </View>
  );
}
