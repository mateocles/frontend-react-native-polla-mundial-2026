import { useCallback, useMemo, useState } from "react";
import { View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "lucide-react-native";
import { compressToBase64 } from "../utils/image";
import {
  Bell,
  Settings,
  BadgeCheck,
  BarChart3,
  ListChecks,
  Bell as BellMenu,
  HelpCircle,
  LogOut,
} from "lucide-react-native";
import Screen from "../components/atoms/Screen";
import Typography from "../components/atoms/Typography";
import Avatar from "../components/atoms/Avatar";
import StatCard from "../components/molecules/StatCard";
import MenuRow from "../components/molecules/MenuRow";
import { useAuthStore } from "../store/useAuthStore";
import { useMatchesStore } from "../store/useMatchesStore";
import { colors } from "../theme/colors";

export default function ProfileScreen({ navigation }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const { matches, fetchMatches } = useMatchesStore();
  const [uploading, setUploading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchMatches().catch(() => {});
    }, [fetchMatches])
  );

  // Stats derivadas de las predicciones del usuario.
  const stats = useMemo(() => {
    const preds = matches.map((m) => m.prediction).filter(Boolean);
    const totalPoints = preds.reduce((sum, p) => sum + (p.points || 0), 0);
    const correctScores = preds.filter((p) => p.points === 6).length;
    return { totalPoints, correctScores };
  }, [matches]);

  const pickAvatar = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permiso requerido", "Necesitamos acceso a tus fotos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (result.canceled || !result.assets?.[0]?.uri) return;

    setUploading(true);
    try {
      // Compresión adaptativa: avatar pequeño, objetivo ~120 KB.
      const { uri } = await compressToBase64(result.assets[0].uri, {
        maxWidth: 400,
        maxBytes: 120 * 1024,
      });
      await updateProfile({ avatarUrl: uri });
    } catch (e) {
      Alert.alert("Error", e?.response?.data?.error || "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
    }
  };

  const soon = () =>
    Alert.alert("Próximamente", "Esta sección estará disponible pronto.");

  const confirmLogout = () =>
    Alert.alert("Cerrar sesión", "¿Seguro que quieres salir?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Salir", style: "destructive", onPress: logout },
    ]);

  return (
    <Screen padded={false} edges={["top", "bottom"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Typography variant="headline-md" className="text-primary">
          Polla Mundialista
        </Typography>
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-4" hitSlop={8} onPress={soon}>
            <Bell color={colors.onSurface} size={22} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity hitSlop={8} onPress={soon}>
            <Settings color={colors.onSurface} size={22} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + identidad */}
        <View className="items-center mt-2 mb-6">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={pickAvatar}
            disabled={uploading}
            className="rounded-full p-1"
            style={{ borderWidth: 2, borderColor: colors.primary, opacity: uploading ? 0.6 : 1 }}
          >
            <Avatar name={user?.name} uri={user?.avatarUrl} size={88} />
            <View className="absolute bottom-0 right-0 bg-primary rounded-full p-1.5">
              <Camera color={colors.onPrimary} size={16} strokeWidth={2.5} />
            </View>
          </TouchableOpacity>
          <Typography variant="headline-md" className="mt-3">
            {user?.name || "Usuario"}
          </Typography>
          <Typography variant="body-sm" className="mt-0.5">
            {user?.email}
          </Typography>
        </View>

        {/* Total points */}
        <StatCard
          label="Total Points"
          value={stats.totalPoints.toLocaleString()}
          highlight
          icon={BarChart3}
          className="mb-3"
        />

        {/* Rank + correct scores */}
        <View className="flex-row mb-6" style={{ gap: 12 }}>
          <StatCard label="Global Rank" value="—" className="flex-1" />
          <StatCard
            label="Correct Scores"
            value={String(stats.correctScores)}
            className="flex-1"
          />
        </View>

        {/* Menú */}
        <MenuRow
          icon={Camera}
          label={uploading ? "Subiendo foto..." : "Cambiar foto de perfil"}
          onPress={pickAvatar}
        />
        <MenuRow
          icon={ListChecks}
          label="My Predictions"
          onPress={() => navigation.navigate("Matches")}
        />
        <MenuRow icon={Settings} label="Account Settings" onPress={soon} />
        <MenuRow icon={BellMenu} label="Notification Preferences" onPress={soon} />
        <MenuRow icon={HelpCircle} label="Help & Support" onPress={soon} />

        {/* Logout */}
        <TouchableOpacity
          className="flex-row items-center justify-center rounded-xl py-4 mt-4"
          style={{ backgroundColor: "#c62035" }}
          onPress={confirmLogout}
          activeOpacity={0.85}
        >
          <LogOut color="#ffffff" size={18} strokeWidth={2.2} />
          <Typography
            variant="body"
            className="ml-2"
            style={{ color: "#ffffff", fontFamily: "Inter_700Bold" }}
          >
            Logout
          </Typography>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}
