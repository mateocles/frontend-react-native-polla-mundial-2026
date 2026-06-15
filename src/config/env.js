// Configuración central. Por defecto apunta al backend en Vercel; se puede
// sobreescribir con la variable EXPO_PUBLIC_API_BASE_URL (p. ej. para local).
export const ENV = {
  API_BASE_URL:
    process.env.EXPO_PUBLIC_API_BASE_URL ||
    "https://backend-polla-v2.vercel.app/api",
  // 30s: el primer request puede tardar por el cold start de Vercel + Neon.
  REQUEST_TIMEOUT: 30000,
};
