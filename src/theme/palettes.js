// Design System: "Pitch Kinetic" — paletas oscura y clara.
// `dark` conserva los valores originales; `light` es la variante equivalente.
// Estas paletas alimentan tanto el hook useThemeColors (estilos inline) como
// las variables NativeWind (clases Tailwind) — ver theme/themeVars.js.

export const dark = {
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

  onSurface: "#dbe2fd",
  onSurfaceVariant: "#b9cacb",

  outline: "#849495",
  outlineVariant: "#3a494b",

  primary: "#00f2ff",
  onPrimary: "#00363a",
  primaryContainer: "#00f2ff",
  onPrimaryContainer: "#006a71",

  secondary: "#d1bcff",
  onSecondary: "#3c0090",
  secondaryContainer: "#7000ff",

  tertiary: "#ffb4a2",
  onTertiary: "#621100",
  tertiaryContainer: "#ffd1c6",

  error: "#ffb4ab",
  onError: "#690005",
  errorContainer: "#93000a",
  onErrorContainer: "#ffdad6",

  inverseSurface: "#dbe2fd",
  inverseOnSurface: "#283044",
};

export const light = {
  surface: "#f5f7fc",
  surfaceDim: "#e3e7f0",
  surfaceBright: "#ffffff",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#eef1f8",
  surfaceContainer: "#e8ecf4",
  surfaceContainerHigh: "#e2e6f0",
  surfaceContainerHighest: "#dce1ec",
  surfaceVariant: "#dce1ec",

  background: "#f5f7fc",
  onBackground: "#1a2138",

  onSurface: "#1a2138",
  onSurfaceVariant: "#45505f",

  outline: "#6f7c8b",
  outlineVariant: "#c2ccd8",

  primary: "#00829a",
  onPrimary: "#ffffff",
  primaryContainer: "#9eeefb",
  onPrimaryContainer: "#00363f",

  secondary: "#5b39c4",
  onSecondary: "#ffffff",
  secondaryContainer: "#e7ddff",

  tertiary: "#b3402a",
  onTertiary: "#ffffff",
  tertiaryContainer: "#ffdad2",

  error: "#ba1a1a",
  onError: "#ffffff",
  errorContainer: "#ffdad6",
  onErrorContainer: "#410002",

  inverseSurface: "#1a2138",
  inverseOnSurface: "#f5f7fc",
};

export const palettes = { dark, light };
