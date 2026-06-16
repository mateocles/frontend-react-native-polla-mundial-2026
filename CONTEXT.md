# 🧠 Contexto — `frontend_polla` (App móvil)

> Documento para que otra IA/dev continúe. Refleja el estado actual.

## ¿Qué es?
App móvil (**Expo SDK 54 / React Native**) de la Polla Mundialista. El usuario se registra, crea/se une a grupos (públicos o privados), predice marcadores **dentro de un grupo** y compite en el ranking. Consume el [`backend_polla`](../backend_polla) (por defecto el de producción en Vercel).

## Stack
- **Expo SDK 54 + React Native**, **NativeWind v4 + Tailwind v3**.
- **Zustand** (estado global), **React Navigation** (Auth stack + Bottom tabs).
- **Axios** + **AsyncStorage**. **Inter** (fuente), **Lucide** (iconos).
- expo-blur, expo-image-picker, expo-image-manipulator, expo-clipboard, expo-linear-gradient, expo-auth-session (Google).

## Design System "Pitch Kinetic Dark"
Fondo azul medianoche `#0b1326`, acento **cian eléctrico `#00f2ff`**, Inter, glassmorphism. Tokens en [`src/theme/colors.js`](src/theme/colors.js) + [`tailwind.config.js`](tailwind.config.js).

## Arquitectura (Clean Code + Atomic Design)
```
src/
├── api/            # axiosConfig (interceptor token) + services (auth, group, prediction)
├── store/          # useAuthStore, useGroupsStore, useMatchesStore, useDialog
├── components/
│   ├── atoms/      # Button, IconInput, Avatar(uri), TeamBadge, Badge, Typography...
│   ├── molecules/  # OpenMatchCard, ClosedMatchCard, PredictionMatchCard, Podium,
│   │               # LeaderboardRow, GroupCard, SegmentedFilter, GoogleButton...
│   └── organisms/  # AuthForm, CreateGroupForm, EditGroupModal, DialogHost,
│                   # UserPredictionsModal, GoogleSignInButton...
├── screens/        # Login, Register, Matches, Groups, Leaderboard(detalle grupo), Profile
├── navigation/     # RootNavigator, AuthStack, AppTabs, GroupsStack
├── config/ theme/ utils/
```
Regla: las pantallas usan `store`/`services`, nunca axios directo.

## Funcionalidades actuales
- **Auth**: login/registro por correo. El endpoint Google existe pero **los botones de Google están ocultos** en Login/Register (se pueden reactivar con `GoogleSignInButton`; requiere client IDs nativos + dev build).
- **Partidos** (solo lectura): tabs Próximos/Finalizados; finalizados con **drawer de goleadores**.
- **Grupos**: tabs Mis Grupos / Acciones. Crear (**switch Público/Privado**), unirse por código, **explorar y unirse a grupos públicos**.
- **Detalle de grupo** (`LeaderboardScreen`):
  - Banner **editable solo admin** (imagen base64 comprimida).
  - **Ranking**: podio + lista con **fotos** (avatar) y badge **Admin**; tocar un usuario abre **UserPredictionsModal** (sus pronósticos de partidos cerrados).
  - **Mis Pronósticos**: predecir (bloqueado al iniciar el partido).
- **Perfil**: avatar editable (subida + compresión base64), stats, logout.
- **Diálogos bonitos**: `useDialog` + `DialogHost` (alert/confirm) — reemplazan los `Alert.alert` nativos.

## Config / env
- API y Google en [`.env`](.env): `EXPO_PUBLIC_API_BASE_URL`, `EXPO_PUBLIC_GOOGLE_WEB/IOS/ANDROID_CLIENT_ID`.
- [`src/config/env.js`](src/config/env.js): default al backend de Vercel; timeout 30s (cold start). Para local: `EXPO_PUBLIC_API_BASE_URL=http://TU_IP:3000/api`.
- Imágenes: base64 con compresión adaptativa ([`utils/image.js`](src/utils/image.js)).
- Banderas: API gratis flagcdn.com con fallback a iniciales.

## Correr
```bash
npm install
npx expo start -c    # Expo Go (SDK 54); -c limpia caché (necesario tras cambiar .env)
```

## Pendientes / ideas
- Reactivar Google con dev build + iOS/Android client IDs.
- Mostrar foto en más lugares; notificaciones (campana es decorativa).

## Relación
Cliente móvil del `backend_polla`. Hermano de la web [`frontend_polla_web`](../frontend_polla_web) (misma lógica y diseño).
