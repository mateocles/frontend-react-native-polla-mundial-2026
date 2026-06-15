# ⚽ Polla Mundialista — App Móvil

App móvil (Expo / React Native) para jugar una **polla / quiniela / prode** del Mundial de Fútbol con tus amigos: predices los marcadores de los partidos, ganas puntos según tu acierto y compites en una tabla de posiciones dentro de grupos privados.

> Esta app es el **cliente** que consume la [API de Polla Mundialista](../backend_polla/README.md) (Node + Express + Prisma + PostgreSQL).

---

## 🎯 ¿De qué se trata? (resumen para diseño)

La idea es simple y social:

1. **Te registras** o inicias sesión.
2. **Creas un grupo** (o te unes a uno con un código de invitación).
3. **Predices el marcador** de cada partido del Mundial **antes** de que empiece.
4. Cuando el partido termina, el sistema **reparte puntos automáticamente**.
5. **Compites** con tu grupo en la **tabla de posiciones**.

### Reglas de puntuación
| Resultado de tu predicción | Puntos |
|---|---|
| Marcador exacto (ej: predices 2-1 y queda 2-1) | **6 pts** |
| Aciertas quién gana / empate, pero no el marcador | **3 pts** |
| Resultado equivocado | **0 pts** |

### Reglas de negocio clave
- Solo puedes predecir partidos **no iniciados**: al empezar, la predicción se **bloquea**.
- Puedes **editar** tu predicción cuantas veces quieras mientras el partido siga abierto.
- Los partidos y resultados se sincronizan solos en el backend cada 30 min (datos reales del Mundial 2026).

---

## 🗺️ Mapa de pantallas (para el diseño)

```
┌─ No autenticado (AuthStack) ─────────────┐
│  • Login        → correo + contraseña    │
│  • Register     → nombre + correo + clave│
└──────────────────────────────────────────┘
                    │ (al iniciar sesión)
                    ▼
┌─ Autenticado (Bottom Tabs) ──────────────┐
│  ⚽ Partidos    → lista + inputs marcador │
│  👥 Grupos      → crear / unirse / lista  │
│        └─ Tabla de posiciones (por grupo) │
│  👤 Perfil      → datos + cerrar sesión   │
└──────────────────────────────────────────┘
```

### Detalle por pantalla
- **Login / Register**: formularios simples. Tras registrarse, inicia sesión automáticamente.
- **Partidos**: tarjeta por partido con nombres de equipos, fecha/hora, estado (abierto/cerrado/finalizado), dos inputs de marcador y botón de guardar. Si ya terminó, muestra el resultado real y los puntos obtenidos.
- **Grupos**: formulario para crear grupo, formulario para unirse por código, y lista de tus grupos (cada uno muestra su código de invitación).
- **Tabla de posiciones**: ranking de miembros por puntos totales, resaltando al usuario actual.
- **Perfil**: avatar con inicial, nombre, correo y botón de cerrar sesión.

---

## 🎨 Sistema visual — "Pitch Dark Kinetic"

Estética **stadium-at-night**: slates oceánicos profundos + acento esmeralda kinético, glassmorphism en barras y tipografía **Inter**. Tokens en [`src/theme/colors.js`](src/theme/colors.js) y como clases de Tailwind en [`tailwind.config.js`](tailwind.config.js).

| Token | Color | Uso |
|---|---|---|
| `background` / `surface` | `#0b1326` | Fondo "stadium-at-night" (Level 0) |
| `surface-container` | `#171f33` | Tarjetas (Level 1) |
| `surface-container-lowest` | `#060e20` | Inputs inset / sub-superficies |
| `primary` | `#4edea3` (emerald) | CTA, acentos, "pitch" |
| `on-primary` | `#003824` | Texto sobre botón primario |
| `secondary` | `#89ceff` (sky) | Info / acciones secundarias |
| `error` | `#ffb4ab` | "Live", predicciones falladas, alertas |
| `on-surface` | `#dae2fd` | Texto principal |
| `on-surface-variant` | `#bbcabf` | Texto secundario / metadatos |
| `outline-variant` | `#3c4a42` | Bordes de bajo contraste |

**Tipografía (Inter):** roles `headline-lg`, `headline-md`, `score-display` (scoreboard, extra-bold + tracking), `body`, `body-sm`, `label-caps`. Definidos en [`src/components/atoms/Typography.js`](src/components/atoms/Typography.js).

**Formas:** tarjetas `rounded-2xl` (24px), botones `rounded-xl` / pill, inputs `rounded-lg`.

**Profundidad:** tonal layering + outline `rgba(255,255,255,0.05)` (sin sombras pesadas); glassmorphism (blur) en la tab bar.

**Iconos:** [Lucide](https://lucide.dev) con stroke 2px (emerald activo, atenuado inactivo).

> Para rediseñar la identidad, toca `theme/colors.js` + `tailwind.config.js` y los átomos en `src/components/atoms/`.

---

## 🏗️ Arquitectura (Clean Code + Atomic Design)

```
src/
├── api/
│   ├── axiosConfig.js        # Instancia axios + interceptor de token JWT
│   └── services/             # 1 servicio por dominio (auth, group, prediction)
├── store/                    # Estado global con Zustand
│   ├── useAuthStore.js       # Sesión + persistencia en AsyncStorage
│   ├── useGroupsStore.js
│   └── useMatchesStore.js
├── components/               # Atomic Design
│   ├── atoms/                # Button, Input, Card, Avatar, Typography...
│   ├── molecules/            # GroupCard, MatchCard, LeaderboardRow...
│   └── organisms/            # AuthForm, CreateGroupForm, JoinGroupForm
├── screens/                  # Páginas (componen organismos)
├── navigation/               # RootNavigator, AuthStack, AppTabs, GroupsStack
├── config/                   # env.js (URL API), storageKeys.js
├── theme/                    # colors.js
└── utils/                    # Helpers de dominio (reglas de partidos)
```

**Principios:**
- Las pantallas **no llaman a axios directo**: usan `store` (estado global) o `services` (datos).
- Los componentes son **tontos y reutilizables** (atoms → molecules → organisms).
- **Zustand** es la única fuente de estado global (sesión, grupos, partidos).
- La **URL del backend** y las claves de storage están centralizadas en `config/`.

---

## 🔌 Cómo saca los datos del backend

Todas las llamadas pasan por [`src/api/axiosConfig.js`](src/api/axiosConfig.js), que:
1. Apunta a `ENV.API_BASE_URL` (configurable en [`src/config/env.js`](src/config/env.js)).
2. Inyecta automáticamente el token JWT guardado en cada petición.

Endpoints consumidos:

| Acción en la app | Endpoint backend |
|---|---|
| Login / Register | `POST /api/auth/login`, `POST /api/auth/register` |
| Listar / crear / unirse a grupos | `GET·POST /api/groups`, `POST /api/groups/join` |
| Ver partidos + tus predicciones | `GET /api/predictions/matches` |
| Guardar predicción | `POST /api/predictions` |
| Tabla de posiciones | `GET /api/predictions/leaderboard/:groupId` |

> ✅ Verificado: el backend devuelve **104 partidos reales** del Mundial 2026 y la app los consume correctamente.

---

## 🚀 Cómo correr la app

1. **Configura la IP del backend** en [`src/config/env.js`](src/config/env.js).
   En dispositivo/emulador físico **no uses `localhost`**: usa la IP de tu máquina (ej: `http://192.168.1.8:3000/api`).

2. **Levanta el backend** (en `../backend_polla`):
   ```bash
   cd ../backend_polla && node src/app.js
   ```

3. **Inicia la app**:
   ```bash
   npm install
   npx expo start
   ```
   Escanea el QR con Expo Go, o presiona `i` (iOS) / `a` (Android).

---

## 🧰 Stack técnico

- **Expo / React Native** (RN 0.85, Expo SDK 56)
- **NativeWind v4 + Tailwind v3** — estilos (design system "Pitch Dark Kinetic")
- **Inter** (`@expo-google-fonts/inter`) — tipografía
- **Lucide** (`lucide-react-native` + `react-native-svg`) — iconos
- **expo-blur** — glassmorphism en la tab bar
- **React Navigation** — Stack + Bottom Tabs
- **Zustand** — estado global
- **Axios** — cliente HTTP
- **AsyncStorage** — persistencia de sesión

---

## 🔭 Pendientes / ideas de diseño futuras

- Invitar amigos por correo desde la app (el backend ya expone `/groups/invite`).
- Login con **Google** (el backend ya soporta OAuth).
- Auto-logout cuando el token expira (interceptor 401).
- Filtros en Partidos (por fecha / fase / solo pendientes de predecir).
- Detalle de grupo (miembros, compartir código nativo).
- Modo claro / personalización de tema.
