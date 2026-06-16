import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GroupsScreen from "../screens/GroupsScreen";
import LeaderboardScreen from "../screens/LeaderboardScreen";
import { useThemeColors } from "../theme/colors";

const Stack = createNativeStackNavigator();

export default function GroupsStack() {
  const colors = useThemeColors();
  const screenOptions = {
    headerStyle: { backgroundColor: colors.background },
    headerTintColor: colors.onSurface,
    headerTitleStyle: { fontFamily: "Inter_700Bold" },
    contentStyle: { backgroundColor: colors.background },
  };
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="GroupsList"
        component={GroupsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
