import { create } from "zustand";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../config/storageKeys";

// Modos: "system" sigue el ajuste del dispositivo; "light"/"dark" lo fuerzan.
const VALID = ["system", "light", "dark"];

const systemScheme = () => Appearance.getColorScheme() || "dark";

function resolve(mode) {
  return mode === "system" ? systemScheme() : mode;
}

export const useThemeStore = create((set, get) => ({
  mode: "system",
  resolved: systemScheme(), // "light" | "dark"

  setMode: async (mode) => {
    if (!VALID.includes(mode)) return;
    set({ mode, resolved: resolve(mode) });
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, mode);
    } catch {}
  },

  // Carga la preferencia guardada y escucha cambios del sistema.
  init: async () => {
    let saved = "system";
    try {
      const v = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      if (VALID.includes(v)) saved = v;
    } catch {}
    set({ mode: saved, resolved: resolve(saved) });

    Appearance.addChangeListener(() => {
      if (get().mode === "system") set({ resolved: systemScheme() });
    });
  },
}));
