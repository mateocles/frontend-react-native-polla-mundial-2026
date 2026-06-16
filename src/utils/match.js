// Helpers de dominio para partidos. Reglas de negocio en un solo lugar.
import i18n from "../i18n";

// Un partido está cerrado para predecir si ya empezó o no está "notstarted".
export const isMatchClosed = (match) =>
  match.status !== "notstarted" || new Date() >= new Date(match.matchDate);

export const getTeamName = (id, nameEn) => nameEn || id;

const locale = () => i18n.language || "es";

export const formatMatchDate = (matchDate) =>
  new Date(matchDate).toLocaleString(locale());

// Fecha corta tipo "26 JUN · 18:00" para las tarjetas.
export const formatMatchShort = (matchDate) => {
  const d = new Date(matchDate);
  const day = d.getDate();
  const month = d
    .toLocaleString(locale(), { month: "short" })
    .replace(".", "")
    .toUpperCase();
  const time = d.toLocaleTimeString(locale(), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${day} ${month} · ${time}`;
};

// Resultado de la predicción de un partido finalizado según sus puntos.
// Devuelve la clave de traducción (outcome.*) y el tono; el componente la traduce.
export const predictionOutcome = (prediction) => {
  if (!prediction) return null;
  if (prediction.points === 6) return { key: "outcome.exact", tone: "primary" };
  if (prediction.points === 3) return { key: "outcome.result", tone: "secondary" };
  return { key: "outcome.miss", tone: "muted" };
};

/**
 * Minuto aproximado de un partido en vivo, calculado en el cliente a partir de
 * la hora programada (matchDate) — NO usa la API externa. Devuelve { key, min }
 * para traducir: maneja primera mitad, entretiempo y segunda mitad.
 */
export const liveMinute = (matchDate, now = Date.now()) => {
  const start = new Date(matchDate).getTime();
  const elapsedMin = Math.floor((now - start) / 60000);
  if (elapsedMin < 0) return { key: "matches.minute", min: 1 };
  if (elapsedMin < 45) return { key: "matches.minute", min: elapsedMin + 1 };
  if (elapsedMin < 60) return { key: "matches.halftime" };
  const second = 46 + (elapsedMin - 60);
  return { key: "matches.minute", min: Math.min(second, 90) };
};
