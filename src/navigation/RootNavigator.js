import { useEffect } from "react";
import { NavigationContainer, DarkTheme, DefaultTheme } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import AppTabs from "./AppTabs";
import Loader from "../components/atoms/Loader";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { useThemeColors } from "../theme/colors";

// Decide qué stack mostrar según haya o no sesión iniciada.
export default function RootNavigator() {
  const token = useAuthStore((s) => s.token);
  const loading = useAuthStore((s) => s.loading);
  const bootstrap = useAuthStore((s) => s.bootstrap);
  const resolved = useThemeStore((s) => s.resolved);
  const colors = useThemeColors();

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  // Tema de navegación alineado a la paleta del tema activo.
  const base = resolved === "light" ? DefaultTheme : DarkTheme;
  const navTheme = {
    ...base,
    colors: {
      ...base.colors,
      background: colors.background,
      card: colors.background,
      primary: colors.primary,
      text: colors.onSurface,
    },
  };

  if (loading) return <Loader fullscreen />;

  return (
    <NavigationContainer theme={navTheme}>
      {token ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
