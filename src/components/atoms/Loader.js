import { View, ActivityIndicator } from "react-native";
import { colors } from "../../theme/colors";

// Spinner para estados de carga.
export default function Loader({ fullscreen = false }) {
  if (fullscreen) {
    return (
      <View className="flex-1 bg-background justify-center">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }
  return <ActivityIndicator color={colors.primary} className="mt-8" />;
}
