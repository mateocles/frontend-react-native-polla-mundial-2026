import { useState } from "react";
import { useTranslation } from "react-i18next";
import { dialog } from "../store/useDialog";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ArrowLeft, User, Mail, Lock, UserPlus } from "lucide-react-native";
import Screen from "../components/atoms/Screen";
import Typography from "../components/atoms/Typography";
import IconInput from "../components/atoms/IconInput";
import Button from "../components/atoms/Button";
import SuccessOverlay from "../components/molecules/SuccessOverlay";
import { AuthService } from "../api/services/authService";
import { useAuthStore } from "../store/useAuthStore";
import { useHorizontalSwipe } from "../utils/useHorizontalSwipe";
import { useThemeColors } from "../theme/colors";

export default function RegisterScreen({ navigation }) {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const applySession = useAuthStore((s) => s.applySession);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [session, setSession] = useState(null);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirm) {
      dialog.alert(t("auth.fillAll"), { title: t("auth.missingDataTitle") });
      return;
    }
    if (password !== confirm) {
      dialog.alert(t("auth.passwordMismatch"), { title: t("auth.passwordTitle") });
      return;
    }
    setLoading(true);
    try {
      await AuthService.register(name.trim(), email.trim(), password);
      const data = await AuthService.login(email.trim(), password);
      // Guardamos la sesión y mostramos el overlay; entramos al terminar.
      setSession(data);
      setSuccess(true);
    } catch (e) {
      dialog.alert(e?.response?.data?.error || t("auth.registerFailed"), { title: t("common.error"), tone: "danger" });
      setLoading(false);
    }
  };

  const enterApp = () => {
    if (session) applySession(session.token, session.user);
  };

  // Deslizar de izquierda a derecha → volver al login.
  const swipe = useHorizontalSwipe({ onSwipeRight: () => navigation.goBack() });

  return (
    <Screen padded={false} edges={["top", "bottom"]}>
      {/* Header: volver + título de marca */}
      <View className="flex-row items-center px-4 pt-2 pb-1">
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center"
          style={{ borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" }}
          onPress={() => navigation.goBack()}
          hitSlop={8}
        >
          <ArrowLeft color={colors.primary} size={20} strokeWidth={2.2} />
        </TouchableOpacity>
        <Typography variant="headline-md" className="text-primary flex-1 text-center mr-10">
          {t("common.appName")}
        </Typography>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          {...swipe}
        >
          <Typography variant="headline-lg" className="mt-3">
            {t("auth.createAccount")}
          </Typography>
          <Typography variant="body-sm" className="mt-1 mb-6">
            {t("auth.registerSubtitle")}
          </Typography>

          <IconInput
            icon={User}
            label={t("auth.fullName")}
            placeholder={t("auth.fullNamePlaceholder")}
            value={name}
            onChangeText={setName}
          />
          <IconInput
            className="mt-4"
            icon={Mail}
            label={t("auth.emailLabel")}
            placeholder={t("auth.emailPlaceholder")}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <IconInput
            className="mt-4"
            icon={Lock}
            label={t("auth.password")}
            secure
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
          />
          <IconInput
            className="mt-4"
            icon={Lock}
            label={t("auth.confirmPassword")}
            secure
            placeholder="••••••••"
            value={confirm}
            onChangeText={setConfirm}
          />

          <Button
            className="mt-7"
            title={t("auth.signUp")}
            icon={UserPlus}
            loading={loading}
            onPress={handleRegister}
          />

          <TouchableOpacity
            className="mt-6 items-center"
            onPress={() => navigation.goBack()}
          >
            <Typography variant="body-sm">
              {t("auth.haveAccount")}{" "}
              <Typography variant="body-sm" className="text-primary">
                {t("auth.doSignIn")}
              </Typography>
            </Typography>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessOverlay visible={success} onDone={enterApp} />
    </Screen>
  );
}
