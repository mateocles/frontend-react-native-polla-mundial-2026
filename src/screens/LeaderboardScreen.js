import { useCallback, useMemo, useState } from "react";
import { View, FlatList, Image, TouchableOpacity, RefreshControl, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as Clipboard from "expo-clipboard";
import { ArrowLeft, Bell, Copy, Pencil } from "lucide-react-native";
import Screen from "../components/atoms/Screen";
import Typography from "../components/atoms/Typography";
import Loader from "../components/atoms/Loader";
import EmptyState from "../components/atoms/EmptyState";
import UnderlineTabs from "../components/molecules/UnderlineTabs";
import Podium from "../components/molecules/Podium";
import LeaderboardRow from "../components/molecules/LeaderboardRow";
import PredictionMatchCard from "../components/molecules/PredictionMatchCard";
import EditGroupModal from "../components/organisms/EditGroupModal";
import { PredictionService } from "../api/services/predictionService";
import { useAuthStore } from "../store/useAuthStore";
import { useMatchesStore } from "../store/useMatchesStore";
import { useGroupsStore } from "../store/useGroupsStore";
import { isMatchClosed } from "../utils/match";
import { colors } from "../theme/colors";

const TABS = [
  { key: "ranking", label: "Ranking" },
  { key: "predictions", label: "Mis Pronósticos" },
];

export default function LeaderboardScreen({ route, navigation }) {
  const currentUser = useAuthStore((s) => s.user);
  const { matches, fetchMatches, submitPrediction } = useMatchesStore();
  const updateGroupStore = useGroupsStore((s) => s.updateGroup);

  const [group, setGroup] = useState(
    route.params?.group || { id: route.params?.groupId, name: route.params?.groupName }
  );
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("ranking");
  const [predFilter, setPredFilter] = useState("upcoming");
  const [editVisible, setEditVisible] = useState(false);

  const isAdmin = currentUser?.id === group.ownerId;

  const loadBoard = useCallback(async () => {
    try {
      const data = await PredictionService.getLeaderboard(group.id);
      setRows(data);
    } catch (e) {
      Alert.alert("Error", "No se pudo cargar la tabla.");
    } finally {
      setLoading(false);
    }
  }, [group.id]);

  useFocusEffect(
    useCallback(() => {
      loadBoard();
      fetchMatches().catch(() => {});
    }, [loadBoard, fetchMatches])
  );

  const { data, podium } = useMemo(() => {
    if (tab === "ranking") {
      const top3 = rows.slice(0, 3);
      const meIdx = rows.findIndex((r) => r.userId === currentUser?.id);
      const rank = meIdx >= 0 ? meIdx + 1 : null;
      const rest = rows.slice(3).map((r, i) => ({ ...r, rank: i + 4 }));
      const list =
        meIdx > 2
          ? [{ ...rows[meIdx], rank }, ...rest.filter((r) => r.userId !== currentUser?.id)]
          : rest;
      return { data: list, podium: top3 };
    }
    const list =
      predFilter === "upcoming"
        ? matches.filter((m) => !isMatchClosed(m))
        : matches
            .filter((m) => isMatchClosed(m))
            .sort((a, b) => new Date(b.matchDate) - new Date(a.matchDate));
    return { data: list, podium: [] };
  }, [tab, rows, matches, currentUser, predFilter]);

  const copyCode = async () => {
    if (!group.inviteCode) return;
    await Clipboard.setStringAsync(group.inviteCode);
    Alert.alert("Copiado", `Código ${group.inviteCode} copiado.`);
  };

  const handleSaveGroup = async (payload) => {
    await updateGroupStore(group.id, payload);
    setGroup((g) => ({ ...g, ...payload }));
  };

  const Header = (
    <View>
      {/* Banner editable */}
      <View className="h-44 rounded-xl overflow-hidden mt-2 mb-5 justify-end">
        {group.imageUrl ? (
          <Image source={{ uri: group.imageUrl }} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} resizeMode="cover" />
        ) : (
          <LinearGradient
            colors={["rgba(0,242,255,0.25)", "rgba(11,19,38,0.3)", "rgba(6,13,32,0.95)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          />
        )}
        <LinearGradient
          colors={["transparent", "rgba(11,19,38,0.85)"]}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <View className="p-4 flex-row items-end justify-between">
          <Typography variant="headline-lg" className="text-on-surface flex-1" numberOfLines={2}>
            {group.name}
          </Typography>
          {isAdmin ? (
            <TouchableOpacity
              onPress={() => setEditVisible(true)}
              className="w-10 h-10 rounded-full items-center justify-center bg-surface/80 border border-white/10"
            >
              <Pencil color={colors.primary} size={18} strokeWidth={2} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Código de invitación prominente */}
      {group.inviteCode ? (
        <View
          className="rounded-xl p-4 mb-6 flex-row justify-between items-center"
          style={{ backgroundColor: "rgba(30,41,59,0.7)", borderWidth: 1, borderColor: "rgba(0,242,255,0.2)" }}
        >
          <View>
            <Typography variant="label-caps">Invite Code</Typography>
            <Typography className="text-primary mt-0.5" style={{ fontFamily: "Inter_700Bold", fontSize: 20, letterSpacing: 2 }}>
              {group.inviteCode}
            </Typography>
          </View>
          <TouchableOpacity
            onPress={copyCode}
            className="w-12 h-12 rounded-lg items-center justify-center bg-primary/10"
          >
            <Copy color={colors.primary} size={22} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Tabs */}
      <UnderlineTabs options={TABS} value={tab} onChange={setTab} />

      {tab === "ranking" ? (
        <View className="mt-6">
          <Typography variant="headline-lg">Ranking de Jugadores</Typography>
          {rows.length ? <Podium rows={podium} /> : null}
          <View className="h-4" />
        </View>
      ) : (
        <View className="mt-6">
          <Typography variant="headline-lg">Mis Pronósticos</Typography>
          <View className="flex-row mt-4 mb-2">
            {[
              { key: "upcoming", label: "Próximos" },
              { key: "finished", label: "Finalizados" },
            ].map((p) => {
              const active = predFilter === p.key;
              return (
                <TouchableOpacity
                  key={p.key}
                  className={`px-4 py-1.5 rounded-full mr-3 ${active ? "bg-primary" : "bg-surface-container-highest"}`}
                  activeOpacity={0.85}
                  onPress={() => setPredFilter(p.key)}
                >
                  <Typography variant="label-caps" className={active ? "text-on-primary" : "text-on-surface-variant"}>
                    {p.label}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );

  if (loading && rows.length === 0) {
    return (
      <Screen padded={false} edges={["top"]}>
        <Loader fullscreen />
      </Screen>
    );
  }

  return (
    <Screen padded={false} edges={["top"]}>
      {/* AppBar */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8} className="mr-3">
            <ArrowLeft color={colors.primary} size={22} strokeWidth={2.2} />
          </TouchableOpacity>
          <Typography variant="headline-md" className="text-primary flex-1" numberOfLines={1}>
            {group.name}
          </Typography>
        </View>
        <TouchableOpacity hitSlop={8}>
          <Bell color={colors.primary} size={22} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item, i) => (tab === "ranking" ? item.userId : item.id) + "-" + i}
        className="px-4"
        contentContainerStyle={{ paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={Header}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={loadBoard} tintColor={colors.primary} />
        }
        renderItem={({ item }) =>
          tab === "ranking" ? (
            <LeaderboardRow
              rank={item.rank}
              name={item.name}
              points={item.totalPoints}
              isCurrentUser={item.userId === currentUser?.id}
              isAdmin={item.userId === group.ownerId}
            />
          ) : (
            <PredictionMatchCard match={item} onSubmit={submitPrediction} />
          )
        }
        ListEmptyComponent={
          <EmptyState
            message={tab === "ranking" ? "Aún no hay posiciones." : "No hay partidos para pronosticar."}
          />
        }
      />

      <EditGroupModal
        visible={editVisible}
        group={group}
        onClose={() => setEditVisible(false)}
        onSave={handleSaveGroup}
      />
    </Screen>
  );
}
