import { View } from "react-native";
import Typography from "./Typography";

// Separador horizontal con texto centrado: "o continuar con".
export default function Divider({ label }) {
  return (
    <View className="flex-row items-center my-5">
      <View className="flex-1 h-px bg-outline-variant" />
      {label ? (
        <Typography variant="label-caps" className="mx-3">
          {label}
        </Typography>
      ) : null}
      <View className="flex-1 h-px bg-outline-variant" />
    </View>
  );
}
