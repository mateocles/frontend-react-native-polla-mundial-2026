// Design System: "Pitch Kinetic" — paleta para props no expresables como
// clase de Tailwind (React Navigation, iconos, estilos inline).
//
// `colors` (export estático) = paleta OSCURA, para usos a nivel de módulo y
// retrocompatibilidad. En componentes, usa el hook `useThemeColors()` para
// obtener la paleta del tema activo (claro/oscuro).
import { useThemeStore } from "../store/useThemeStore";
import { dark, light, palettes } from "./palettes";

export const colors = dark;

export { dark, light, palettes };

// Hook reactivo: devuelve la paleta del tema resuelto actual.
export function useThemeColors() {
  const resolved = useThemeStore((s) => s.resolved);
  return palettes[resolved] || dark;
}
