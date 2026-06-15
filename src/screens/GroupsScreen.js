import { useCallback, useState } from "react";
import { View, ScrollView, TouchableOpacity, RefreshControl, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Bell, PlusCircle, UserPlus, KeyRound } from "lucide-react-native";
import Screen from "../components/atoms/Screen";
import Typography from "../components/atoms/Typography";
import Avatar from "../components/atoms/Avatar";
import Loader from "../components/atoms/Loader";
import EmptyState from "../components/atoms/EmptyState";
import UnderlineTabs from "../components/molecules/UnderlineTabs";
import GroupCard from "../components/molecules/GroupCard";
import ActionCard from "../components/molecules/ActionCard";
import CreateGroupForm from "../components/organisms/CreateGroupForm";
import JoinGroupForm from "../components/organisms/JoinGroupForm";
import { useGroupsStore } from "../store/useGroupsStore";
import { useAuthStore } from "../store/useAuthStore";
import { colors } from "../theme/colors";

const TABS = [
  { key: "groups", label: "Mis Grupos" },
  { key: "actions", label: "Acciones" },
];

export default function GroupsScreen({ navigation }) {
  const { groups, loading, fetchGroups, createGroup, joinGroup } = useGroupsStore();
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState("groups");
  const [activeForm, setActiveForm] = useState(null); // 'create' | 'join' | null

  useFocusEffect(
    useCallback(() => {
      fetchGroups().catch(() =>
        Alert.alert("Error", "No se pudieron cargar los grupos.")
      );
    }, [fetchGroups])
  );

  const goToRanking = (group) =>
    navigation.navigate("Leaderboard", { group });

  const handleCreate = async (name) => {
    await createGroup(name);
    setActiveForm(null);
    setTab("groups");
  };

  const handleJoin = async (code) => {
    await joinGroup(code);
    setActiveForm(null);
    setTab("groups");
  };

  return (
    <Screen padded={false} edges={["top"]}>
      {/* AppBar */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center">
          <Avatar name={user?.name} uri={user?.avatarUrl} size={32} />
          <Typography variant="headline-md" className="text-primary ml-3">
            Polla Mundialista
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
          ) : groups.length === 0 ? (
            <EmptyState message="Aún no perteneces a ningún grupo. Ve a Acciones para crear o unirte." />
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
                Gestionar Grupos
              </Typography>
              <Typography variant="body-sm" className="text-center px-8">
                Crea tu propia liga privada o únete a la de tus amigos para competir.
              </Typography>
            </View>

            {/* Acciones */}
            <ActionCard
              icon={UserPlus}
              iconColor={colors.primary}
              tone="primary"
              title="Crear Grupo"
              subtitle="Define reglas y premios personalizados."
              onPress={() => setActiveForm(activeForm === "create" ? null : "create")}
            />
            {activeForm === "create" ? <CreateGroupForm onCreate={handleCreate} /> : null}

            <ActionCard
              icon={KeyRound}
              iconColor={colors.secondary}
              tone="secondary"
              title="Unirse con Código"
              subtitle="Ingresa el token de invitación de tu liga."
              onPress={() => setActiveForm(activeForm === "join" ? null : "join")}
            />
            {activeForm === "join" ? <JoinGroupForm onJoin={handleJoin} /> : null}

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
                  Próxima Copa
                </Typography>
                <Typography variant="headline-md">¡Vive la emoción grupal!</Typography>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
