import { View, Text, Image } from "react-native";
import { colors } from "../../theme/colors";

// Avatar circular. Si recibe `uri` muestra la imagen; si no, la inicial.
export default function Avatar({ name, uri, size = 80 }) {
  if (uri) {
    return (
      <View
        className="rounded-full overflow-hidden bg-surface-container-high"
        style={{ width: size, height: size }}
      >
        <Image source={{ uri }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
      </View>
    );
  }

  const initial = name?.charAt(0)?.toUpperCase() || "?";
  return (
    <View
      className="rounded-full bg-primary items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Text
        style={{
          fontFamily: "Inter_800ExtraBold",
          fontSize: size / 2.5,
          color: colors.onPrimary,
        }}
      >
        {initial}
      </Text>
    </View>
  );
}
