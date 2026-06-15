import { useRef } from "react";
import { PanResponder } from "react-native";

// Devuelve panHandlers para detectar swipes horizontales sin interferir con
// taps ni scroll. Solo captura el gesto si es claramente horizontal.
export function useHorizontalSwipe({ onSwipeLeft, onSwipeRight, threshold = 60 }) {
  const responder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, g) =>
        Math.abs(g.dx) > 20 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
      onPanResponderRelease: (_evt, g) => {
        if (g.dx <= -threshold) onSwipeLeft?.();
        else if (g.dx >= threshold) onSwipeRight?.();
      },
    })
  ).current;

  return responder.panHandlers;
}
