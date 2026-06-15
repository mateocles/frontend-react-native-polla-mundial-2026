import { useState } from "react";
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
import Divider from "../components/atoms/Divider";
import GoogleButton from "../components/molecules/GoogleButton";
import SuccessOverlay from "../components/molecules/SuccessOverlay";
import { AuthService } from "../api/services/authService";
import { useAuthStore } from "../store/useAuthStore";
import { useHorizontalSwipe } from "../utils/useHorizontalSwipe";
import { colors } from "../theme/colors";

export default function RegisterScreen({ navigation }) {
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
      Alert.alert("Faltan datos", "Completa todos los campos.");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Contraseña", "Las contraseñas no coinciden.");
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
      Alert.alert("Error", e?.response?.data?.error || "No se pudo crear la cuenta.");
      setLoading(false);
    }
  };

  const enterApp = () => {
    if (session) applySession(session.token, session.user);
  };

  const notImplemented = () =>
    Alert.alert("Próximamente", "El registro con Google estará disponible pronto.");

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
          Polla Mundialista
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
            Crea tu cuenta
          </Typography>
          <Typography variant="body-sm" className="mt-1 mb-6">
            Únete a la emoción del mundial y compite con tus amigos.
          </Typography>

          <IconInput
            icon={User}
            label="Nombre Completo"
            placeholder="Ej. Juan Pérez"
            value={name}
            onChangeText={setName}
          />
          <IconInput
            className="mt-4"
            icon={Mail}
            label="Correo Electrónico"
            placeholder="nombre@ejemplo.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <IconInput
            className="mt-4"
            icon={Lock}
            label="Contraseña"
            secure
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
          />
          <IconInput
            className="mt-4"
            icon={Lock}
            label="Confirmar Contraseña"
            secure
            placeholder="••••••••"
            value={confirm}
            onChangeText={setConfirm}
          />

          <Button
            className="mt-7"
            title="Registrarse"
            icon={UserPlus}
            loading={loading}
            onPress={handleRegister}
          />

          <Divider label="o regístrate con" />

          <GoogleButton onPress={notImplemented} />

          <TouchableOpacity
            className="mt-6 items-center"
            onPress={() => navigation.goBack()}
          >
            <Typography variant="body-sm">
              ¿Ya tienes una cuenta?{" "}
              <Typography variant="body-sm" className="text-primary">
                Inicia Sesión
              </Typography>
            </Typography>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessOverlay visible={success} onDone={enterApp} />
    </Screen>
  );
}
