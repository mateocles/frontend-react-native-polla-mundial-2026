/** @type {import('tailwindcss').Config} */
// Design System: "Pitch Kinetic" — tema dual (claro/oscuro).
// Los colores leen variables CSS (canales RGB) aplicadas en runtime con
// vars() según el tema activo — ver src/theme/themeVars.js y RootNavigator.
const withVar = (name) => `rgb(var(${name}) / <alpha-value>)`;
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: withVar("--surface"),
          dim: withVar("--surface-dim"),
          bright: withVar("--surface-bright"),
          "container-lowest": withVar("--surface-container-lowest"),
          "container-low": withVar("--surface-container-low"),
          container: withVar("--surface-container"),
          "container-high": withVar("--surface-container-high"),
          "container-highest": withVar("--surface-container-highest"),
          variant: withVar("--surface-variant"),
        },
        background: withVar("--background"),
        "on-background": withVar("--on-background"),
        "on-surface": withVar("--on-surface"),
        "on-surface-variant": withVar("--on-surface-variant"),
        outline: withVar("--outline"),
        "outline-variant": withVar("--outline-variant"),
        primary: {
          DEFAULT: withVar("--primary"),
          container: withVar("--primary-container"),
        },
        "on-primary": withVar("--on-primary"),
        "on-primary-container": withVar("--on-primary-container"),
        secondary: {
          DEFAULT: withVar("--secondary"),
          container: withVar("--secondary-container"),
        },
        "on-secondary": withVar("--on-secondary"),
        tertiary: withVar("--tertiary"),
        "on-tertiary": withVar("--on-tertiary"),
        error: {
          DEFAULT: withVar("--error"),
          container: withVar("--error-container"),
        },
        "on-error": withVar("--on-error"),
      },
      fontFamily: {
        sans: ["Inter_400Regular"],
        medium: ["Inter_500Medium"],
        semibold: ["Inter_600SemiBold"],
        bold: ["Inter_700Bold"],
        extrabold: ["Inter_800ExtraBold"],
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "1.5rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};
