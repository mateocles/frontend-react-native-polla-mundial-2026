import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Contenedor base de cada pantalla: fondo "stadium-at-night" + safe area.
// `edges` controla qué bordes respetan el área segura (notch / Isla Dinámica /
// home indicator). Por defecto solo el inferior, porque las pantallas dentro de
// un navigator ya reciben el inset superior del header. Las pantallas SIN header
// (Login/Registro) deben pasar edges={["top", "bottom"]}.
export default function Screen({
  children,
  padded = true,
  center = false,
  edges = ["bottom"],
}) {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={edges}>
      <View
        className={`flex-1 ${padded ? "px-4 pt-4" : ""} ${
          center ? "justify-center" : ""
        }`}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}
