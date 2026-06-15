import { Platform } from "react-native";
import { BlurView } from "expo-blur";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Trophy, Users, User } from "lucide-react-native";
import GroupsStack from "./GroupsStack";
import MatchesScreen from "../screens/MatchesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { colors } from "../theme/colors";

const Tab = createBottomTabNavigator();

// Lucide con stroke 2px; primary cuando está activo, atenuado si no.
const icon = (Icon) => ({ color, focused }) =>
  <Icon color={color} size={22} strokeWidth={focused ? 2.4 : 2} />;

// Glassmorphism en la barra inferior (backdrop blur 12px / 80% opacidad).
const GlassTabBar = (props) => (
  <BlurView
    intensity={Platform.OS === "ios" ? 40 : 80}
    tint="dark"
    style={[props.style, { backgroundColor: "rgba(11,19,38,0.8)" }]}
  >
    {props.children}
  </BlurView>
);

const screenOptions = {
  headerStyle: { backgroundColor: colors.background },
  headerTintColor: colors.onSurface,
  headerTitleStyle: { fontFamily: "Inter_700Bold" },
  tabBarStyle: {
    position: "absolute",
    borderTopColor: "rgba(255,255,255,0.05)",
    borderTopWidth: 1,
    elevation: 0,
  },
  tabBarBackground: () => null,
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.onSurfaceVariant,
  tabBarLabelStyle: { fontFamily: "Inter_600SemiBold", fontSize: 11 },
};

export default function AppTabs() {
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
        options={{ headerShown: false, title: "Partidos", tabBarIcon: icon(Trophy) }}
      />
      <Tab.Screen
        name="Groups"
        component={GroupsStack}
        options={{ headerShown: false, title: "Grupos", tabBarIcon: icon(Users) }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false, title: "Perfil", tabBarIcon: icon(User) }}
      />
    </Tab.Navigator>
  );
}
