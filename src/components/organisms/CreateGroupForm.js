import { useState } from "react";
import { View, Alert } from "react-native";
import Card from "../atoms/Card";
import Typography from "../atoms/Typography";
import Input from "../atoms/Input";
import Button from "../atoms/Button";

// Formulario para crear un grupo. Delega la creación en `onCreate`.
export default function CreateGroupForm({ onCreate }) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setBusy(true);
    try {
      await onCreate(name.trim());
      setName("");
    } catch (e) {
      Alert.alert("Error", e?.response?.data?.error || "No se pudo crear.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="mb-3">
      <Typography variant="label-caps" className="mb-2">
        Crear grupo
      </Typography>
      <View className="flex-row">
        <Input
          className="flex-1 mr-2"
          placeholder="Nombre del grupo"
          value={name}
          onChangeText={setName}
        />
        <Button title="Crear" size="sm" loading={busy} onPress={handleCreate} />
      </View>
    </Card>
  );
}
