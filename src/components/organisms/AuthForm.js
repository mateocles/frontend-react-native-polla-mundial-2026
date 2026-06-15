import { useState } from "react";
import { dialog } from "../../store/useDialog";
import { View, Alert } from "react-native";
import Input from "../atoms/Input";
import Button from "../atoms/Button";

// Formulario de autenticación reutilizable (login y registro).
// `fields` describe los inputs; `onSubmit` recibe los valores por key.
export default function AuthForm({ fields, submitLabel, onSubmit }) {
  const initial = fields.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {});
  const [values, setValues] = useState(initial);
  const [loading, setLoading] = useState(false);

  const setValue = (key, value) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    const missing = fields.some((f) => !values[f.key]);
    if (missing) {
      dialog.alert("Completa todos los campos.", { title: "Faltan datos" });
      return;
    }
    setLoading(true);
    try {
      await onSubmit(values);
    } catch (e) {
      dialog.alert(e?.response?.data?.error || "Ocurrió un error.", { title: "Error", tone: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      {fields.map((f) => (
        <Input
          key={f.key}
          className="mb-4"
          placeholder={f.placeholder}
          secureTextEntry={f.secure}
          autoCapitalize={f.key === "email" ? "none" : "sentences"}
          keyboardType={f.key === "email" ? "email-address" : "default"}
          value={values[f.key]}
          onChangeText={(t) => setValue(f.key, t)}
        />
      ))}
      <Button
        className="mt-2"
        title={submitLabel}
        loading={loading}
        onPress={handleSubmit}
      />
    </View>
  );
}
