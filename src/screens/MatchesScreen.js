import { useCallback, useMemo, useState } from "react";
import { dialog } from "../store/useDialog";
import { View, FlatList, RefreshControl, TouchableOpacity, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Bell } from "lucide-react-native";
import Screen from "../components/atoms/Screen";
import Typography from "../components/atoms/Typography";
import Avatar from "../components/atoms/Avatar";
import Loader from "../components/atoms/Loader";
import EmptyState from "../components/atoms/EmptyState";
import SegmentedFilter from "../components/molecules/SegmentedFilter";
import OpenMatchCard from "../components/molecules/OpenMatchCard";
import ClosedMatchCard from "../components/molecules/ClosedMatchCard";
import { useMatchesStore } from "../store/useMatchesStore";
import { useAuthStore } from "../store/useAuthStore";
import { isMatchClosed, formatMatchShort } from "../utils/match";
import { colors } from "../theme/colors";

const TABS = [
  { key: "open", label: "Próximos" },
  { key: "closed", label: "Finalizados" },
];

export default function MatchesScreen() {
  const { matches, loading, fetchMatches } = useMatchesStore();
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState("open");

  useFocusEffect(
    useCallback(() => {
      fetchMatches().catch(() =>
        dialog.alert("No se pudieron cargar los partidos.", { title: "Error", tone: "danger" })
      );
    }, [fetchMatches])
  );

  const { open, closed } = useMemo(() => {
    const openList = matches.filter((m) => !isMatchClosed(m));
    const closedList = matches
      .filter((m) => isMatchClosed(m))
      .sort((a, b) => new Date(b.matchDate) - new Date(a.matchDate));
    return { open: openList, closed: closedList };
  }, [matches]);

  const list = tab === "open" ? open : closed;
  const nextDate = open[0]?.matchDate;

  if (loading && matches.length === 0) {
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
        <View className="flex-row items-center">
          <Avatar name={user?.name} uri={user?.avatarUrl} size={32} />
          <Typography variant="headline-md" className="text-primary ml-3">
            Partidos del Mundial
          </Typography>
        </View>
        <TouchableOpacity hitSlop={8}>
          <Bell color={colors.primary} size={22} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        className="px-4"
        contentContainerStyle={{ paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={fetchMatches}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <View>
            {/* Banner Próxima Jornada */}
            <View
              className="h-28 rounded-xl overflow-hidden my-2 justify-end"
              style={{ borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" }}
            >
              <LinearGradient
                colors={["rgba(0,242,255,0.12)", "rgba(11,19,38,0)", colors.surface]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
              />
              <View className="p-4">
                <Typography variant="label-caps" className="text-primary">
                  Próxima Jornada
                </Typography>
                <Typography variant="headline-lg" className="mt-0.5">
                  {nextDate ? formatMatchShort(nextDate) : "Sin partidos"}
                </Typography>
              </View>
            </View>

            {/* Tabs */}
            <View className="mt-1 mb-4">
              <SegmentedFilter options={TABS} value={tab} onChange={setTab} />
            </View>

            {/* Conteo */}
            <View className="flex-row items-center justify-between mb-3">
              <Typography variant="label-caps">
                {tab === "open" ? "Partidos próximos" : "Partidos finalizados"}
              </Typography>
              <View className="px-2 py-1 rounded-full bg-surface-container-highest">
                <Typography variant="label-caps" className="text-primary">
                  {list.length} {tab === "open" ? "Disponibles" : "Jugados"}
                </Typography>
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) =>
          tab === "open" ? (
            <OpenMatchCard match={item} />
          ) : (
            <ClosedMatchCard match={item} />
          )
        }
        ListEmptyComponent={
          <EmptyState
            message={
              tab === "open"
                ? "No hay partidos próximos."
                : "Aún no hay partidos finalizados."
            }
          />
        }
      />
    </Screen>
  );
}
