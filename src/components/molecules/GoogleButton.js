import { TouchableOpacity } from "react-native";
import GoogleIcon from "../atoms/GoogleIcon";
import Typography from "../atoms/Typography";

// Botón de "continuar con Google" (estilo superficie con logo oficial).
export default function GoogleButton({ onPress }) {
  return (
    <TouchableOpacity
      className="flex-row items-center justify-center bg-surface-container-high rounded-xl py-3.5"
      style={{ borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" }}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <GoogleIcon size={18} />
      <Typography variant="body" className="ml-3 font-semibold">
        Google
      </Typography>
    </TouchableOpacity>
  );
}
