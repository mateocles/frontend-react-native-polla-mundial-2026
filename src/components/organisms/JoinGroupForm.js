import { useState } from "react";
import { useTranslation } from "react-i18next";
import { dialog } from "../../store/useDialog";
import { View, Alert } from "react-native";
import Card from "../atoms/Card";
import Typography from "../atoms/Typography";
import Input from "../atoms/Input";
import Button from "../atoms/Button";

// Formulario para unirse a un grupo con código de invitación.
export default function JoinGroupForm({ onJoin }) {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  const handleJoin = async () => {
    if (!code.trim()) return;
    setBusy(true);
    try {
      await onJoin(code.trim());
      setCode("");
      dialog.alert(t("groups.joined"), { title: t("groups.joinedTitle"), tone: "success" });
    } catch (e) {
      dialog.alert(e?.response?.data?.error || t("groups.invalidCode"), { title: t("common.error"), tone: "danger" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="mb-4">
      <Typography variant="label-caps" className="mb-2">
        {t("groups.joinByCodeShort")}
      </Typography>
      <View className="flex-row">
        <Input
          className="flex-1 mr-2"
          placeholder={t("groups.codePlaceholder")}
          autoCapitalize="none"
          value={code}
          onChangeText={setCode}
        />
        <Button
          title={t("groups.joinBtn")}
          variant="secondary"
          size="sm"
          loading={busy}
          onPress={handleJoin}
        />
      </View>
    </Card>
  );
}
