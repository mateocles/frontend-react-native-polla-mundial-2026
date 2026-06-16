import './global.css'
import { useEffect } from 'react'
import { View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter'
import RootNavigator from './src/navigation/RootNavigator'
import Loader from './src/components/atoms/Loader'
import DialogHost from './src/components/organisms/DialogHost'
import { useThemeStore } from './src/store/useThemeStore'
import { themeVars } from './src/theme/themeVars'
import './src/i18n'

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  })

  const initTheme = useThemeStore((s) => s.init)
  const resolved = useThemeStore((s) => s.resolved)

  useEffect(() => {
    initTheme()
  }, [initTheme])

  return (
    <SafeAreaProvider>
      {/* La vista raíz aplica las variables del tema (vars) para que TODAS las
          clases de Tailwind, incluido DialogHost, cambien con el tema. */}
      <View style={[{ flex: 1 }, themeVars[resolved]]}>
        <StatusBar style={resolved === 'light' ? 'dark' : 'light'} />
        {fontsLoaded ? <RootNavigator /> : <Loader fullscreen />}
        <DialogHost />
      </View>
    </SafeAreaProvider>
  )
}
