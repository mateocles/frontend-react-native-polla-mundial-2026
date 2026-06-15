# 🧠 Contexto — `frontend_polla` (App móvil)

## ¿Qué es?
La **aplicación móvil** (iOS/Android) de la Polla Mundialista, hecha con **Expo / React Native**. Es el cliente principal: el usuario se registra, crea/se une a grupos, predice marcadores **dentro de un grupo** y compite en la tabla de posiciones. Consume el [`backend_polla`](../backend_polla).

## Stack
- **Expo SDK 54 + React Native** (se bajó de SDK 56 porque Expo Go aún no lo soportaba).
- **NativeWind v4 + Tailwind v3** — estilos.
- **Zustand** — estado global (sesión, grupos, partidos).
- **React Navigation** — Stack (Auth) + Bottom Tabs (App).
- **Axios** + **AsyncStorage** (token/sesión).
- **Inter** (`@expo-google-fonts`), **Lucide** (iconos), **expo-blur**, **expo-image-picker/manipulator**, **expo-clipboard**.

## Design System: "Pitch Kinetic Dark"
Estética stadium-at-night: fondo azul medianoche `#0b1326`, acento **cian eléctrico `#00f2ff`**, glassmorphism y tipografía Inter. Tokens centralizados en [`src/theme/colors.js`](src/theme/colors.js) + [`tailwind.config.js`](tailwind.config.js).

## Arquitectura (Clean Code + Atomic Design)
```
src/
├── api/            # axiosConfig (interceptor token) + services por dominio
├── store/          # useAuthStore, useGroupsStore, useMatchesStore
├── components/
│   ├── atoms/      # Button, Input, IconInput, Avatar, TeamBadge, Badge...
│   ├── molecules/  # MatchCard(s), GroupCard, LeaderboardRow, Podium...
│   └── organisms/  # AuthForm, CreateGroupForm, EditGroupModal...
├── screens/        # Login, Register, Matches, Groups, Leaderboard(detalle), Profile
├── navigation/     # RootNavigator, AuthStack, AppTabs, GroupsStack
├── config/ theme/ utils/
```
**Regla de oro**: las pantallas no llaman a axios directo → usan `store` o `services`.

## Flujos clave
- **Predicción**: solo desde el **detalle de grupo → Mis Pronósticos** (debes ser miembro). Se bloquea cuando el partido inicia (frontend + backend).
- **Partidos** (tab): solo lectura — fixtures y resultados; finalizados con **drawer de goleadores**.
- **Grupos**: tabs Mis Grupos / Acciones; el **admin (creador)** puede editar nombre e **imagen** (base64 comprimido).
- **Perfil**: avatar editable (subida + compresión), stats derivadas de predicciones, logout.

## Detalles importantes
- Imágenes (grupo/avatar) → **base64** comprimido (`utils/image.js`, objetivo ~120–250 KB).
- Banderas → API gratis **flagcdn.com** con fallback a iniciales.
- Safe area para notch / Isla Dinámica (`Screen` con `edges`).
- IP del backend configurable en [`src/config/env.js`](src/config/env.js) (en dispositivo usar IP de la máquina, no `localhost`).

## Correr
```bash
npm install
npx expo start -c   # escanear QR con Expo Go (SDK 54)
```

## Relación
Cliente móvil del `backend_polla`. Comparte backend, lógica y diseño con la versión web [`frontend_polla_web`](../frontend_polla_web).
