import { View, TouchableOpacity } from "react-native";
import Typography from "../atoms/Typography";
import { useThemeColors } from "../../theme/colors";

// Tabs con subrayado (estilo del diseño de Grupos). options: [{key,label}].
export default function UnderlineTabs({ options, value, onChange }) {
  const colors = useThemeColors();
  return (
    <View className="flex-row border-b border-outline-variant">
      {options.map((opt) => {
        const active = opt.key === value;
        return (
          <TouchableOpacity
            key={opt.key}
            className="flex-1 items-center py-4"
            activeOpacity={0.8}
            onPress={() => onChange(opt.key)}
            style={
              active
                ? { borderBottomWidth: 2, borderBottomColor: colors.primary }
                : null
            }
          >
            <Typography
              variant="label-caps"
              className={active ? "text-primary" : "text-on-surface-variant"}
            >
              {opt.label}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
