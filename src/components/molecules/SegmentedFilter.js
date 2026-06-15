import { View, TouchableOpacity } from "react-native";
import Typography from "../atoms/Typography";

// Control segmentado de pestañas (chips). `options`: [{key,label}].
export default function SegmentedFilter({ options, value, onChange }) {
  return (
    <View className="flex-row bg-surface-container-lowest rounded-full p-1">
      {options.map((opt) => {
        const active = opt.key === value;
        return (
          <TouchableOpacity
            key={opt.key}
            className={`flex-1 items-center py-2 rounded-full ${
              active ? "bg-primary" : ""
            }`}
            activeOpacity={0.85}
            onPress={() => onChange(opt.key)}
          >
            <Typography
              variant="label-caps"
              className={active ? "text-on-primary" : "text-on-surface-variant"}
            >
              {opt.label}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
