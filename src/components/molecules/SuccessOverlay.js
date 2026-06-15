import { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";
import { Check } from "lucide-react-native";
import Typography from "../atoms/Typography";
import { colors } from "../../theme/colors";

// Overlay de feedback de éxito con barra de progreso. Llama a `onDone`
// cuando termina la animación (duración configurable).
export default function SuccessOverlay({
  visible,
  title = "¡Cuenta Creada!",
  message = "Bienvenido al estadio digital más grande del mundo.",
  duration = 1800,
  onDone,
}) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start(({ finished }) => finished && onDone?.());
  }, [visible]);

  if (!visible) return null;

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View className="absolute inset-0 z-50 items-center justify-center px-8 bg-background/80">
      <View
        className="bg-surface-container rounded-2xl p-8 w-full max-w-xs items-center"
        style={{ borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" }}
      >
        <View
          className="w-16 h-16 rounded-full bg-primary items-center justify-center mb-5"
          style={{
            shadowColor: colors.primary,
            shadowOpacity: 0.5,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 0 },
            elevation: 8,
          }}
        >
          <Check color={colors.onPrimary} size={32} strokeWidth={3} />
        </View>
        <Typography variant="headline-md" className="mb-1">
          {title}
        </Typography>
        <Typography variant="body-sm" className="text-center mb-5">
          {message}
        </Typography>
        <View className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
          <Animated.View className="h-full bg-primary" style={{ width }} />
        </View>
      </View>
    </View>
  );
}
