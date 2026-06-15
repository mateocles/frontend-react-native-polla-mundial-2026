import { useState } from "react";
import { dialog } from "../../store/useDialog";
import { Modal, View, Image, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ImagePlus, X } from "lucide-react-native";
import { compressToBase64 } from "../../utils/image";
import Typography from "../atoms/Typography";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { colors } from "../../theme/colors";

// Modal para que el admin edite el nombre y la imagen del grupo.
// La imagen se sube como data URI base64 para guardarla en la base de datos.
export default function EditGroupModal({ visible, group, onClose, onSave }) {
  const [name, setName] = useState(group?.name || "");
  const [image, setImage] = useState(group?.imageUrl || null);
  const [saving, setSaving] = useState(false);

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      dialog.alert("Necesitamos acceso a tus fotos.", { title: "Permiso requerido" });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });
    if (result.canceled || !result.assets?.[0]?.uri) return;

    // Compresión adaptativa: banner ancho, objetivo ~250 KB.
    const { uri } = await compressToBase64(result.assets[0].uri, {
      maxWidth: 1000,
      maxBytes: 250 * 1024,
    });
    setImage(uri);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      dialog.alert("El nombre no puede estar vacío.", { title: "Nombre" });
      return;
    }
    setSaving(true);
    try {
      await onSave({ name: name.trim(), imageUrl: image });
      onClose();
    } catch (e) {
      dialog.alert(e?.response?.data?.error || "No se pudo guardar.", { title: "Error", tone: "danger" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-background/70">
        <View
          className="bg-surface-container rounded-t-2xl p-5"
          style={{ borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" }}
        >
          <View className="flex-row items-center justify-between mb-5">
            <Typography variant="headline-md">Editar grupo</Typography>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <X color={colors.onSurfaceVariant} size={22} />
            </TouchableOpacity>
          </View>

          {/* Imagen */}
          <TouchableOpacity
            onPress={pickImage}
            activeOpacity={0.85}
            className="h-36 rounded-xl overflow-hidden mb-4 items-center justify-center bg-surface-container-high"
            style={{ borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" }}
          >
            {image ? (
              <Image source={{ uri: image }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
            ) : (
              <View className="items-center">
                <ImagePlus color={colors.primary} size={28} strokeWidth={2} />
                <Typography variant="body-sm" className="mt-2">
                  Agregar imagen del grupo
                </Typography>
              </View>
            )}
          </TouchableOpacity>
          {image ? (
            <TouchableOpacity onPress={pickImage} className="mb-4">
              <Typography variant="label-caps" className="text-primary">
                Cambiar imagen
              </Typography>
            </TouchableOpacity>
          ) : null}

          {/* Nombre */}
          <Typography variant="label-caps" className="mb-1.5">
            Nombre del grupo
          </Typography>
          <Input value={name} onChangeText={setName} placeholder="Nombre del grupo" />

          <Button className="mt-5" title="Guardar cambios" loading={saving} onPress={handleSave} />
        </View>
      </View>
    </Modal>
  );
}
