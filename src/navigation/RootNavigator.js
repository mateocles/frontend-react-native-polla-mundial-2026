import { useEffect } from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import AppTabs from "./AppTabs";
import Loader from "../components/atoms/Loader";
import { useAuthStore } from "../store/useAuthStore";
import { colors } from "../theme/colors";

// Tema oscuro de navegación alineado a nuestra paleta.
const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.background,
    primary: colors.primary,
    text: colors.onSurface,
  },
};

// Decide qué stack mostrar según haya o no sesión iniciada.
export default function RootNavigator() {
  const token = useAuthStore((s) => s.token);
  const loading = useAuthStore((s) => s.loading);
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  if (loading) return <Loader fullscreen />;

  return (
    <NavigationContainer theme={navTheme}>
      {token ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
