import { useState } from "react";
import { useTranslation } from "react-i18next";
import { dialog } from "../../store/useDialog";
import { View, Switch } from "react-native";
import Card from "../atoms/Card";
import Typography from "../atoms/Typography";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { useThemeColors } from "../../theme/colors";

// Formulario para crear un grupo. Delega la creación en `onCreate(name, isPublic)`.
export default function CreateGroupForm({ onCreate }) {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setBusy(true);
    try {
      await onCreate(name.trim(), isPublic);
      setName("");
      setIsPublic(false);
    } catch (e) {
      dialog.alert(e?.response?.data?.error || t("groups.createFailed"), { title: t("common.error"), tone: "danger" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="mb-3">
      <Typography variant="label-caps" className="mb-2">
        {t("groups.createGroup")}
      </Typography>
      <View className="flex-row">
        <Input
          className="flex-1 mr-2"
          placeholder={t("groups.groupNamePlaceholder")}
          value={name}
          onChangeText={setName}
        />
        <Button title={t("groups.createBtn")} size="sm" loading={busy} onPress={handleCreate} />
      </View>
      <View className="flex-row items-center justify-between mt-3">
        <Typography variant="body-sm">
          {t("groups.publicShort")}
        </Typography>
        <Switch
          value={isPublic}
          onValueChange={setIsPublic}
          trackColor={{ true: colors.primary, false: colors.surfaceContainerHighest }}
          thumbColor="#ffffff"
        />
      </View>
    </Card>
  );
}
