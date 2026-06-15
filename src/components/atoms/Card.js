import { View } from "react-native";

// Tarjeta base (Level 1). Tonal layering + outline de bajo contraste,
// esquinas rounded-2xl según el design system.
export default function Card({ children, className = "", style }) {
  return (
    <View
      className={`bg-surface-container rounded-2xl p-4 ${className}`}
      style={[{ borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" }, style]}
    >
      {children}
    </View>
  );
}
