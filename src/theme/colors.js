// Design System: "Pitch Kinetic Dark"
// Paleta semántica central. Úsala para props no expresables como clase de
// Tailwind (React Navigation, iconos, estilos inline). Las clases Tailwind
// equivalentes (bg-surface, text-on-surface, etc.) viven en tailwind.config.js.
// Acento principal: cian eléctrico (#00f2ff) sobre azul medianoche profundo.
export const colors = {
  // Superficies (tonal layering)
  surface: "#0b1326",
  surfaceDim: "#0b1326",
  surfaceBright: "#31394e",
  surfaceContainerLowest: "#060d20",
  surfaceContainerLow: "#131b2e",
  surfaceContainer: "#171f33",
  surfaceContainerHigh: "#222a3e",
  surfaceContainerHighest: "#2d3449",
  surfaceVariant: "#2d3449",

  background: "#0b1326",
  onBackground: "#dbe2fd",

  // Texto
  onSurface: "#dbe2fd",
  onSurfaceVariant: "#b9cacb",

  // Bordes
  outline: "#849495",
  outlineVariant: "#3a494b",

  // Primary (cian eléctrico) — acción principal y datos críticos
  primary: "#00f2ff",
  onPrimary: "#00363a",
  primaryContainer: "#00f2ff",
  onPrimaryContainer: "#006a71",

  // Secondary (púrpura real) — prestigio / componentes intermedios
  secondary: "#d1bcff",
  onSecondary: "#3c0090",
  secondaryContainer: "#7000ff",

  // Tertiary (rojo/naranja) — goles, "Live", urgencia
  tertiary: "#ffb4a2",
  onTertiary: "#621100",
  tertiaryContainer: "#ffd1c6",

  // Error / danger
  error: "#ffb4ab",
  onError: "#690005",
  errorContainer: "#93000a",
  onErrorContainer: "#ffdad6",

  // Inverse
  inverseSurface: "#dbe2fd",
  inverseOnSurface: "#283044",
};
