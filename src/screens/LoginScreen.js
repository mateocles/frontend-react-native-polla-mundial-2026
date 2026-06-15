import { useState } from "react";
import { dialog } from "../store/useDialog";
import {
  View,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Mail, Lock } from "lucide-react-native";
import Screen from "../components/atoms/Screen";
import Typography from "../components/atoms/Typography";
import BrandLogo from "../components/atoms/BrandLogo";
import HeroBackground from "../components/atoms/HeroBackground";
import IconInput from "../components/atoms/IconInput";
import Button from "../components/atoms/Button";
import PageDots from "../components/atoms/PageDots";
import { useAuthStore } from "../store/useAuthStore";
import { useHorizontalSwipe } from "../utils/useHorizontalSwipe";

export default function LoginScreen({ navigation }) {
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      dialog.alert("Ingresa tu correo y contraseña.", { title: "Faltan datos" });
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e) {
      dialog.alert(e?.response?.data?.error || "No se pudo iniciar sesión.", { title: "Error", tone: "danger" });
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => navigation.navigate("Register");

  // Deslizar de derecha a izquierda → ir al registro (como un carrusel).
  const swipe = useHorizontalSwipe({ onSwipeLeft: goToRegister });

  return (
    <Screen center edges={["top", "bottom"]}>
      <HeroBackground />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        {...swipe}
      >
        {/* Logo + marca */}
        <View className="items-center mb-8">
          <BrandLogo size={96} />
          <Typography variant="headline-lg" className="text-primary mt-4">
            Polla Mundialista
          </Typography>
          <Typography variant="body" className="mt-1">
            ¡Bienvenido de nuevo!
          </Typography>
        </View>

        {/* Tarjeta glass */}
        <View
          className="rounded-xl p-6"
          style={{
            backgroundColor: "rgba(30,41,59,0.7)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.05)",
          }}
        >
          <IconInput
            variant="inset"
            icon={Mail}
            label="Email"
            placeholder="nombre@ejemplo.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <View className="flex-row items-center justify-between mt-4 mb-1.5 px-1">
            <Typography variant="label-caps">Contraseña</Typography>
            <TouchableOpacity onPress={() => dialog.alert("Recuperación de contraseña próximamente.", { title: "Próximamente" })} hitSlop={8}>
              <Typography variant="label-caps" className="text-primary">
                ¿Olvidaste la clave?
              </Typography>
            </TouchableOpacity>
          </View>
          <IconInput
            variant="inset"
            icon={Lock}
            secure
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
          />

          <Button
            className="mt-5"
            title="Iniciar Sesión"
            loading={loading}
            onPress={handleLogin}
          />

          <TouchableOpacity className="mt-6 items-center" onPress={goToRegister}>
            <Typography variant="body-sm">
              ¿No tienes una cuenta?{" "}
              <Typography variant="body-sm" className="text-primary">
                Regístrate
              </Typography>
            </Typography>
          </TouchableOpacity>
        </View>

        <PageDots
          count={2}
          active={0}
          onPress={(i) => i === 1 && goToRegister()}
        />
      </KeyboardAvoidingView>
    </Screen>
  );
}
