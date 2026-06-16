import { Platform } from "react-native";
import { BlurView } from "expo-blur";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Trophy, Users, User } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import GroupsStack from "./GroupsStack";
import MatchesScreen from "../screens/MatchesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { useThemeColors } from "../theme/colors";
import { useThemeStore } from "../store/useThemeStore";

const Tab = createBottomTabNavigator();

// Lucide con stroke 2px; primary cuando está activo, atenuado si no.
const icon = (Icon) => ({ color, focused }) =>
  <Icon color={color} size={22} strokeWidth={focused ? 2.4 : 2} />;

// Glassmorphism en la barra inferior (backdrop blur / opacidad), según tema.
const makeGlassTabBar = (tint, bg) => (props) => (
  <BlurView
    intensity={Platform.OS === "ios" ? 40 : 80}
    tint={tint}
    style={[props.style, { backgroundColor: bg }]}
  >
    {props.children}
  </BlurView>
);

export default function AppTabs() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const resolved = useThemeStore((s) => s.resolved);
  const isLight = resolved === "light";

  const GlassTabBar = makeGlassTabBar(
    isLight ? "light" : "dark",
    isLight ? "rgba(245,247,252,0.8)" : "rgba(11,19,38,0.8)"
  );

  const screenOptions = {
    headerStyle: { backgroundColor: colors.background },
    headerTintColor: colors.onSurface,
    headerTitleStyle: { fontFamily: "Inter_700Bold" },
    tabBarStyle: {
      position: "absolute",
      borderTopColor: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)",
      borderTopWidth: 1,
      elevation: 0,
    },
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.onSurfaceVariant,
    tabBarLabelStyle: { fontFamily: "Inter_600SemiBold", fontSize: 11 },
  };

  return (
    <Tab.Navigator
      screenOptions={{
        ...screenOptions,
        tabBarBackground: () => <GlassTabBar style={{ flex: 1 }} />,
      }}
    >
      <Tab.Screen
        name="Matches"
        component={MatchesScreen}
        options={{ headerShown: false, title: t("nav.matches"), tabBarIcon: icon(Trophy) }}
      />
      <Tab.Screen
        name="Groups"
        component={GroupsStack}
        options={{ headerShown: false, title: t("nav.groups"), tabBarIcon: icon(Users) }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false, title: t("nav.profile"), tabBarIcon: icon(User) }}
      />
    </Tab.Navigator>
  );
}
