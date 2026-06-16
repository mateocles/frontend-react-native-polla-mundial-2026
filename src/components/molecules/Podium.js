import { View, TouchableOpacity } from "react-native";
import { Crown, Medal } from "lucide-react-native";
import Avatar from "../atoms/Avatar";
import Typography from "../atoms/Typography";
import { colors } from "../../theme/colors";

const MEDAL = {
  1: { ring: "#facc15", barH: 128, bar: "bg-primary/20", label: "text-primary", rankClass: "text-primary" },
  2: { ring: "#94a3b8", barH: 96, bar: "bg-surface-container-high", label: "text-on-surface", rankClass: "text-on-surface-variant" },
  3: { ring: "#b45309", barH: 80, bar: "bg-surface-container-high", label: "text-on-surface", rankClass: "text-tertiary" },
};

function PodiumPlace({ place, row, onSelect }) {
  const cfg = MEDAL[place];
  if (!row) return <View className="flex-1 max-w-[110px]" />;
  return (
    <TouchableOpacity
      className="flex-1 items-center"
      style={{ maxWidth: place === 1 ? 120 : 100 }}
      activeOpacity={0.85}
      onPress={() => onSelect?.(row)}
    >
      <View className="mb-2 items-center">
        {place === 1 ? (
          <Crown color="#facc15" size={26} fill="#facc15" style={{ marginBottom: 2 }} />
        ) : (
          <Medal color={cfg.ring} size={18} style={{ marginBottom: 2 }} />
        )}
        <View style={{ borderWidth: place === 1 ? 3 : 2, borderColor: cfg.ring, borderRadius: 999 }}>
          <Avatar name={row.name} uri={row.avatarUrl} size={place === 1 ? 72 : 56} />
        </View>
      </View>
      <Typography
        variant="label-caps"
        className={`text-center ${place === 1 ? "text-primary" : "text-on-surface"}`}
        numberOfLines={1}
      >
        {row.name}
      </Typography>
      <Typography variant="label-caps" className="text-primary mt-0.5">
        {row.totalPoints} pts
      </Typography>
      <View
        className={`w-full ${cfg.bar} rounded-t-lg mt-2 items-center justify-end pb-2`}
        style={{ height: cfg.barH }}
      >
        <Typography variant="headline-md" className={cfg.rankClass}>
          #{place}
        </Typography>
      </View>
    </TouchableOpacity>
  );
}

// Podio del ranking (top 3). `rows` ordenado por puntos desc.
// `onSelect(row)` se dispara al tocar un puesto.
export default function Podium({ rows, onSelect }) {
  const [first, second, third] = rows;
  return (
    <View className="flex-row items-end justify-center gap-2 pt-6">
      <PodiumPlace place={2} row={second} onSelect={onSelect} />
      <PodiumPlace place={1} row={first} onSelect={onSelect} />
      <PodiumPlace place={3} row={third} onSelect={onSelect} />
    </View>
  );
}
