import { View, TouchableOpacity } from "react-native";

// Indicador de páginas. `active` resalta el índice actual.
// Si se pasa `onPress(index)`, los puntos son tocables (navegan).
export default function PageDots({ count = 3, active = 0, onPress }) {
  return (
    <View className="flex-row justify-center items-center mt-6">
      {Array.from({ length: count }).map((_, i) => {
        const dot = (
          <View
            className={`h-1.5 rounded-full mx-1 ${
              i === active
                ? "w-5 bg-primary"
                : "w-1.5 bg-surface-container-highest"
            }`}
          />
        );
        return onPress ? (
          <TouchableOpacity key={i} hitSlop={8} onPress={() => onPress(i)}>
            {dot}
          </TouchableOpacity>
        ) : (
          <View key={i}>{dot}</View>
        );
      })}
    </View>
  );
}
