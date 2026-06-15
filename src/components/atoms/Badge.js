import { View } from "react-native";
import Typography from "./Typography";

// Badge de estado de partido. tone: 'live' | 'open' | 'closed'.
const TONE = {
  live: { dot: "bg-error", text: "text-error", bg: "bg-error-container/30" },
  open: { dot: "bg-primary", text: "text-primary", bg: "bg-primary/10" },
  closed: {
    dot: "bg-outline",
    text: "text-on-surface-variant",
    bg: "bg-surface-container-high",
  },
};

export default function Badge({ tone = "closed", label }) {
  const t = TONE[tone] || TONE.closed;
  return (
    <View
      className={`flex-row items-center rounded-full px-2.5 py-1 ${t.bg}`}
    >
      <View className={`w-1.5 h-1.5 rounded-full mr-1.5 ${t.dot}`} />
      <Typography variant="label-caps" className={t.text}>
        {label}
      </Typography>
    </View>
  );
}
