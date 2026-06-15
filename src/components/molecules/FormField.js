import { View } from "react-native";
import Typography from "../atoms/Typography";
import Input from "../atoms/Input";

// Etiqueta (label-caps) + Input. Unidad mínima de un formulario.
export default function FormField({ label, className = "", ...inputProps }) {
  return (
    <View className={className}>
      {label ? (
        <Typography variant="label-caps" className="mb-1.5">
          {label}
        </Typography>
      ) : null}
      <Input {...inputProps} />
    </View>
  );
}
