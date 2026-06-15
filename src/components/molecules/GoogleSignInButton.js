import GoogleButton from "./GoogleButton";
import { useGoogleAuth, isGoogleConfigured } from "../../utils/useGoogleAuth";
import { dialog } from "../../store/useDialog";

// Botón interno: solo se renderiza cuando Google está configurado para la
// plataforma (así el hook useGoogleAuth, que lanza error si falta el client
// ID, nunca se monta sin configuración).
function GoogleEnabledButton({ onError }) {
  const { promptAsync } = useGoogleAuth({ onError });
  return <GoogleButton onPress={() => promptAsync()} />;
}

// Botón de Google seguro: si no hay client ID para la plataforma, muestra un
// aviso en vez de crashear.
export default function GoogleSignInButton({ onError }) {
  if (!isGoogleConfigured()) {
    return (
      <GoogleButton
        onPress={() =>
          dialog.alert(
            "Falta el client ID de Google para esta plataforma (EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID / ANDROID). Requiere un development build.",
            { title: "Google no configurado" }
          )
        }
      />
    );
  }
  return <GoogleEnabledButton onError={onError} />;
}
