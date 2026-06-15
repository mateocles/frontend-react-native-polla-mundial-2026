import { View } from "react-native";
import Avatar from "../atoms/Avatar";
import Typography from "../atoms/Typography";

// Fila de la tabla de posiciones: rank + avatar + nombre + puntos.
// Resalta al usuario actual.
export default function LeaderboardRow({ rank, name, points, isCurrentUser, isAdmin }) {
  return (
    <View
      className={`flex-row items-center p-4 rounded-xl mb-2 ${
        isCurrentUser ? "bg-primary/10 border border-primary/30" : ""
      }`}
      style={
        isCurrentUser
          ? null
          : { backgroundColor: "rgba(30,41,59,0.7)", borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" }
      }
    >
      <Typography
        variant="label-caps"
        className={`w-6 text-center ${isCurrentUser ? "text-primary" : "text-on-surface-variant"}`}
      >
        {rank}
      </Typography>
      <View className="mx-3">
        <Avatar name={name} size={40} />
      </View>
      <View className="flex-1 flex-row items-center">
        <Typography variant="body" className={isCurrentUser ? "text-primary font-bold" : ""} numberOfLines={1}>
          {name}
          {isCurrentUser ? " (Tú)" : ""}
        </Typography>
        {isAdmin ? (
          <View className="ml-2 px-2 py-0.5 rounded-full bg-secondary/20">
            <Typography variant="label-caps" className="text-secondary">Admin</Typography>
          </View>
        ) : null}
      </View>
      <Typography variant="body" className={isCurrentUser ? "text-primary font-bold" : "font-bold"}>
        {points} pts
      </Typography>
    </View>
  );
}
