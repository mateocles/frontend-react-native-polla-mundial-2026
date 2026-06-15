import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthService } from "../api/services/authService";
import { STORAGE_KEYS } from "../config/storageKeys";

// Persiste la sesión en AsyncStorage y refleja el estado en memoria.
const persistSession = async (token, user) => {
  await AsyncStorage.multiSet([
    [STORAGE_KEYS.TOKEN, token],
    [STORAGE_KEYS.USER, JSON.stringify(user)],
  ]);
};

export const useAuthStore = create((set) => ({
  token: null,
  user: null,
  loading: true, // true mientras restauramos la sesión al arrancar

  // Restaura la sesión desde AsyncStorage al iniciar la app.
  bootstrap: async () => {
    try {
      const [[, token], [, userJson]] = await AsyncStorage.multiGet([
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.USER,
      ]);
      set({
        token: token || null,
        user: userJson ? JSON.parse(userJson) : null,
        loading: false,
      });
    } catch (e) {
      set({ loading: false });
    }
  },

  // Persiste y activa una sesión ya obtenida (token + user).
  // Útil para diferir la navegación tras un overlay de éxito.
  applySession: async (token, user) => {
    await persistSession(token, user);
    set({ token, user });
  },

  login: async (email, password) => {
    const data = await AuthService.login(email, password);
    await persistSession(data.token, data.user);
    set({ token: data.token, user: data.user });
    return data;
  },

  register: async (name, email, password) => {
    // El backend solo registra; iniciamos sesión automáticamente después.
    await AuthService.register(name, email, password);
    const data = await AuthService.login(email, password);
    await persistSession(data.token, data.user);
    set({ token: data.token, user: data.user });
    return data;
  },

  updateProfile: async (data) => {
    const user = await AuthService.updateProfile(data);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    set({ user });
    return user;
  },

  logout: async () => {
    await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
    set({ token: null, user: null });
  },
}));
