import { useCallback, useMemo, useState } from "react";
import { View, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { compressToBase64 } from "../utils/image";
import { dialog } from "../store/useDialog";
import {
  Bell,
  Camera,
  BarChart3,
  ListChecks,
  Bell as BellMenu,
  HelpCircle,
  LogOut,
  Pencil,
  Check,
  X,
  Monitor,
  Sun,
  Moon,
} from "lucide-react-native";
import Screen from "../components/atoms/Screen";
import Typography from "../components/atoms/Typography";
import Avatar from "../components/atoms/Avatar";
import StatCard from "../components/molecules/StatCard";
import MenuRow from "../components/molecules/MenuRow";
import { useAuthStore } from "../store/useAuthStore";
import { useMatchesStore } from "../store/useMatchesStore";
import { useThemeStore } from "../store/useThemeStore";
import { useThemeColors } from "../theme/colors";
import { setLanguage } from "../i18n";

// Control segmentado simple (tema / idioma).
function Segmented({ value, options, onChange }) {
  const colors = useThemeColors();
  return (
    <View className="flex-row bg-surface-container rounded-xl p-1 mb-2.5">
      {options.map((o) => {
        const active = value === o.value;
        return (
          <TouchableOpacity
            key={o.value}
            onPress={() => onChange(o.value)}
            activeOpacity={0.85}
            className={`flex-1 flex-row items-center justify-center py-2.5 rounded-lg ${active ? "bg-primary" : ""}`}
          >
            {o.Icon ? (
              <o.Icon color={active ? colors.onPrimary : colors.onSurfaceVariant} size={15} strokeWidth={2.2} />
            ) : null}
            <Typography
              variant="label-caps"
              className="ml-1.5"
              style={{ color: active ? colors.onPrimary : colors.onSurfaceVariant }}
            >
              {o.label}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function ProfileScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const colors = useThemeColors();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const { matches, fetchMatches } = useMatchesStore();
  const { mode, setMode } = useThemeStore();
  const [uploading, setUploading] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || "");
  const [savingName, setSavingName] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchMatches().catch(() => {});
    }, [fetchMatches])
  );

  const stats = useMemo(() => {
    const preds = matches.map((m) => m.prediction).filter(Boolean);
    const totalPoints = preds.reduce((sum, p) => sum + (p.points || 0), 0);
    const correctScores = preds.filter((p) => p.points === 6).length;
    return { totalPoints, correctScores };
  }, [matches]);

  const pickAvatar = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      dialog.alert(t("profile.photoPermission"), { title: t("profile.permissionRequired") });
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
      const { uri } = await compressToBase64(result.assets[0].uri, {
        maxWidth: 400,
        maxBytes: 120 * 1024,
      });
      await updateProfile({ avatarUrl: uri });
    } catch (e) {
      dialog.alert(e?.response?.data?.error || t("profile.uploadFailed"), { title: t("common.error"), tone: "danger" });
    } finally {
      setUploading(false);
    }
  };

  const saveName = async () => {
    const next = nameInput.trim();
    if (!next) {
      dialog.alert(t("profile.nameEmpty"), { title: t("common.error"), tone: "danger" });
      return;
    }
    setSavingName(true);
    try {
      await updateProfile({ name: next });
      setEditingName(false);
      dialog.alert(t("profile.nameUpdated"), { title: t("common.appName"), tone: "success" });
    } catch (e) {
      dialog.alert(e?.response?.data?.error || t("profile.nameUpdateFailed"), { title: t("common.error"), tone: "danger" });
    } finally {
      setSavingName(false);
    }
  };

  const soon = () =>
    dialog.alert(t("common.serviceError"), { title: t("common.comingSoon") });

  const confirmLogout = async () => {
    const ok = await dialog.confirm(t("profile.logoutConfirm"), {
      title: t("profile.logoutTitle"),
      confirmText: t("profile.logoutBtn"),
      tone: "danger",
    });
    if (ok) logout();
  };

  return (
    <Screen padded={false} edges={["top", "bottom"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Typography variant="headline-md" className="text-primary">
          {t("common.appName")}
        </Typography>
        <TouchableOpacity hitSlop={8} onPress={soon}>
          <Bell color={colors.onSurface} size={22} strokeWidth={2} />
        </TouchableOpacity>
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

          {editingName ? (
            <View className="flex-row items-center mt-3" style={{ gap: 8 }}>
              <TextInput
                value={nameInput}
                onChangeText={setNameInput}
                placeholder={t("profile.namePlaceholder")}
                placeholderTextColor={colors.onSurfaceVariant}
                autoFocus
                className="bg-surface-container-lowest rounded-lg px-3 text-center"
                style={{ height: 40, minWidth: 160, color: colors.onSurface, borderWidth: 1, borderColor: colors.primary, fontFamily: "Inter_700Bold" }}
              />
              <TouchableOpacity onPress={saveName} disabled={savingName} className="bg-primary rounded-lg items-center justify-center" style={{ width: 40, height: 40 }}>
                <Check color={colors.onPrimary} size={18} strokeWidth={2.5} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setEditingName(false); setNameInput(user?.name || ""); }} className="bg-surface-container-high rounded-lg items-center justify-center" style={{ width: 40, height: 40 }}>
                <X color={colors.onSurfaceVariant} size={18} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => { setNameInput(user?.name || ""); setEditingName(true); }} className="flex-row items-center mt-3" activeOpacity={0.8}>
              <Typography variant="headline-md">{user?.name || t("profile.user")}</Typography>
              <Pencil color={colors.onSurfaceVariant} size={16} strokeWidth={2} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          )}
          <Typography variant="body-sm" className="mt-0.5">
            {user?.email}
          </Typography>
        </View>

        {/* Total points */}
        <StatCard
          label={t("profile.totalPoints")}
          value={stats.totalPoints.toLocaleString()}
          highlight
          icon={BarChart3}
          className="mb-3"
        />

        {/* Rank + correct scores */}
        <View className="flex-row mb-6" style={{ gap: 12 }}>
          <StatCard label={t("profile.globalRank")} value="—" className="flex-1" />
          <StatCard
            label={t("profile.correctScores")}
            value={String(stats.correctScores)}
            className="flex-1"
          />
        </View>

        {/* Menú */}
        <MenuRow
          icon={ListChecks}
          label={t("profile.myPredictions")}
          onPress={() => navigation.navigate("Matches")}
        />
        <MenuRow icon={BellMenu} label={t("profile.notifications")} onPress={soon} />
        <MenuRow icon={HelpCircle} label={t("profile.helpSupport")} onPress={soon} />

        {/* Apariencia (tema) */}
        <Typography variant="label-caps" className="mt-5 mb-2">
          {t("profile.appearance")}
        </Typography>
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: "system", label: t("theme.system"), Icon: Monitor },
            { value: "light", label: t("theme.light"), Icon: Sun },
            { value: "dark", label: t("theme.dark"), Icon: Moon },
          ]}
        />

        {/* Idioma */}
        <Typography variant="label-caps" className="mt-4 mb-2">
          {t("profile.language")}
        </Typography>
        <Segmented
          value={i18n.language?.slice(0, 2)}
          onChange={setLanguage}
          options={[
            { value: "es", label: "Español" },
            { value: "en", label: "English" },
          ]}
        />

        {/* Logout */}
        <TouchableOpacity
          className="flex-row items-center justify-center rounded-xl py-4 mt-5"
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
            {t("profile.logout")}
          </Typography>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}
