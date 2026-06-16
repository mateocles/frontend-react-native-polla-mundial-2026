import { vars } from "nativewind";
import { dark, light } from "./palettes";

// Convierte "#00f2ff" → "0 242 255" (canales RGB) para que Tailwind/NativeWind
// pueda aplicar opacidad: rgb(var(--x) / <alpha-value>) → bg-primary/10, etc.
function channels(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

// Mapea una paleta a las variables CSS que consume tailwind.config.js.
function toVars(p) {
  return vars({
    "--surface": channels(p.surface),
    "--surface-dim": channels(p.surfaceDim),
    "--surface-bright": channels(p.surfaceBright),
    "--surface-container-lowest": channels(p.surfaceContainerLowest),
    "--surface-container-low": channels(p.surfaceContainerLow),
    "--surface-container": channels(p.surfaceContainer),
    "--surface-container-high": channels(p.surfaceContainerHigh),
    "--surface-container-highest": channels(p.surfaceContainerHighest),
    "--surface-variant": channels(p.surfaceVariant),
    "--background": channels(p.background),
    "--on-background": channels(p.onBackground),
    "--on-surface": channels(p.onSurface),
    "--on-surface-variant": channels(p.onSurfaceVariant),
    "--outline": channels(p.outline),
    "--outline-variant": channels(p.outlineVariant),
    "--primary": channels(p.primary),
    "--primary-container": channels(p.primaryContainer),
    "--on-primary": channels(p.onPrimary),
    "--on-primary-container": channels(p.onPrimaryContainer),
    "--secondary": channels(p.secondary),
    "--secondary-container": channels(p.secondaryContainer),
    "--on-secondary": channels(p.onSecondary),
    "--tertiary": channels(p.tertiary),
    "--on-tertiary": channels(p.onTertiary),
    "--error": channels(p.error),
    "--error-container": channels(p.errorContainer),
    "--on-error": channels(p.onError),
  });
}

export const themeVars = {
  dark: toVars(dark),
  light: toVars(light),
};
