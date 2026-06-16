import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { dialog } from "../store/useDialog";
import { View, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Bell, PlusCircle, UserPlus, KeyRound } from "lucide-react-native";
import Screen from "../components/atoms/Screen";
import Typography from "../components/atoms/Typography";
import Avatar from "../components/atoms/Avatar";
import Loader from "../components/atoms/Loader";
import EmptyState from "../components/atoms/EmptyState";
import ErrorState from "../components/atoms/ErrorState";
import UnderlineTabs from "../components/molecules/UnderlineTabs";
import GroupCard from "../components/molecules/GroupCard";
import ActionCard from "../components/molecules/ActionCard";
import CreateGroupForm from "../components/organisms/CreateGroupForm";
import JoinGroupForm from "../components/organisms/JoinGroupForm";
import { useGroupsStore } from "../store/useGroupsStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeColors } from "../theme/colors";

export default function GroupsScreen({ navigation }) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const {
    groups, publicGroups, loading, error, fetchGroups, fetchPublicGroups,
    createGroup, joinGroup, joinPublicGroup,
  } = useGroupsStore();
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState("groups");
  const [activeForm, setActiveForm] = useState(null); // 'create' | 'join' | null

  const TABS = [
    { key: "groups", label: t("groups.tabMine") },
    { key: "actions", label: t("groups.tabActions") },
  ];

  const loadGroups = () => fetchGroups().catch(() => {});

  useFocusEffect(
    useCallback(() => {
      fetchGroups().catch(() => {});
      fetchPublicGroups().catch(() => {});
    }, [fetchGroups, fetchPublicGroups])
  );

  const goToRanking = (group) =>
    navigation.navigate("Leaderboard", { group });

  const handleCreate = async (name, isPublic) => {
    await createGroup(name, isPublic);
    setActiveForm(null);
    setTab("groups");
  };

  const handleJoin = async (code) => {
    await joinGroup(code);
    setActiveForm(null);
    setTab("groups");
  };

  const handleJoinPublic = async (g) => {
    try {
      await joinPublicGroup(g.id);
      setTab("groups");
    } catch (e) {
      dialog.alert(e?.response?.data?.error || t("groups.joinFailed"), { title: t("common.error"), tone: "danger" });
    }
  };

  return (
    <Screen padded={false} edges={["top"]}>
      {/* AppBar */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center">
          <Avatar name={user?.name} uri={user?.avatarUrl} size={32} />
          <Typography variant="headline-md" className="text-primary ml-3">
            {t("common.appName")}
          </Typography>
        </View>
        <TouchableOpacity hitSlop={8}>
          <Bell color={colors.primary} size={22} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <View className="px-4">
        <UnderlineTabs options={TABS} value={tab} onChange={setTab} />
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={fetchGroups} tintColor={colors.primary} />
        }
      >
        {tab === "groups" ? (
          loading && groups.length === 0 ? (
            <Loader />
          ) : error && groups.length === 0 ? (
            <ErrorState onRetry={loadGroups} />
          ) : groups.length === 0 ? (
            <EmptyState message={t("groups.noGroups")} />
          ) : (
            groups.map((g) => (
              <GroupCard key={g.id} group={g} onOpenRanking={() => goToRanking(g)} />
            ))
          )
        ) : (
          <View>
            {/* Hero */}
            <View className="items-center py-4 mb-2">
              <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center mb-4 border border-primary/20">
                <PlusCircle color={colors.primary} size={36} strokeWidth={2} />
              </View>
              <Typography variant="headline-lg" className="mb-2">
                {t("groups.manage")}
              </Typography>
              <Typography variant="body-sm" className="text-center px-8">
                {t("groups.manageSubtitle")}
              </Typography>
            </View>

            {/* Acciones */}
            <ActionCard
              icon={UserPlus}
              iconColor={colors.primary}
              tone="primary"
              title={t("groups.create")}
              subtitle={t("groups.createSubtitle")}
              onPress={() => setActiveForm(activeForm === "create" ? null : "create")}
            />
            {activeForm === "create" ? <CreateGroupForm onCreate={handleCreate} /> : null}

            <ActionCard
              icon={KeyRound}
              iconColor={colors.secondary}
              tone="secondary"
              title={t("groups.joinByCode")}
              subtitle={t("groups.joinByCodeSubtitle")}
              onPress={() => setActiveForm(activeForm === "join" ? null : "join")}
            />
            {activeForm === "join" ? <JoinGroupForm onJoin={handleJoin} /> : null}

            {/* Grupos públicos */}
            <Typography variant="label-caps" className="mt-6 mb-3">
              {t("groups.publicGroups")}
            </Typography>
            {publicGroups.length === 0 ? (
              <Typography variant="body-sm" className="mb-2">
                {t("groups.noPublicGroups")}
              </Typography>
            ) : (
              publicGroups.map((g) => (
                <View
                  key={g.id}
                  className="flex-row items-center rounded-xl p-4 mb-3"
                  style={{ backgroundColor: "rgba(30,41,59,0.7)", borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" }}
                >
                  <Avatar name={g.name} uri={g.imageUrl} size={40} />
                  <View className="flex-1 ml-3">
                    <Typography variant="body" className="font-bold" numberOfLines={1}>
                      {g.name}
                    </Typography>
                    <Typography variant="body-sm">{t("groups.participants", { count: g.memberCount })}</Typography>
                  </View>
                  <TouchableOpacity
                    className="px-4 py-2 rounded-lg bg-primary"
                    onPress={() => handleJoinPublic(g)}
                  >
                    <Typography variant="label-caps" className="text-on-primary">
                      {t("groups.joinBtn")}
                    </Typography>
                  </TouchableOpacity>
                </View>
              ))
            )}

            {/* Promo */}
            <View className="rounded-2xl overflow-hidden mt-4 h-40 justify-end">
              <LinearGradient
                colors={["rgba(0,242,255,0.25)", "rgba(11,19,38,0.2)", "rgba(6,14,32,0.95)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
              />
              <View className="p-5">
                <Typography variant="label-caps" className="text-primary mb-1">
                  {t("groups.promoTitle")}
                </Typography>
                <Typography variant="headline-md">{t("groups.promoSubtitle")}</Typography>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
