import { useEffect } from "react";
import { Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useAuthStore } from "../store/useAuthStore";

WebBrowser.maybeCompleteAuthSession();

// ¿Hay client ID de Google para la plataforma actual?
// useIdTokenAuthRequest lanza error si falta el de la plataforma, así que
// solo montamos el hook cuando está configurado.
export function isGoogleConfigured() {
  if (Platform.OS === "ios") return !!process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  if (Platform.OS === "android")
    return !!process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
  return !!process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
}

// Hook de login con Google (móvil): obtiene un ID token y lo intercambia en el
// backend. Requiere los client IDs en variables EXPO_PUBLIC_GOOGLE_*.
export function useGoogleAuth({ onError } = {}) {
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const idToken =
        response.params?.id_token || response.authentication?.idToken;
      if (idToken) {
        loginWithGoogle(idToken).catch((e) => onError?.(e));
      }
    } else if (response?.type === "error") {
      onError?.(response.error);
    }
  }, [response]);

  return { promptAsync, ready: !!request };
}
