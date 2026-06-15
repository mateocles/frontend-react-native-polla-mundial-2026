import { View } from "react-native";
import Typography from "./Typography";

// Chip pill para metadatos: "Grupo A", "Octavos", "Mis ligas".
export default function Chip({ label, className = "" }) {
  return (
    <View
      className={`bg-surface-container-high rounded-full px-3 py-1 self-start ${className}`}
    >
      <Typography variant="label-caps" className="text-on-surface-variant">
        {label}
      </Typography>
    </View>
  );
}
