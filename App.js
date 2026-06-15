import './global.css'
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

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  })

  return (
    <SafeAreaProvider>
      <StatusBar style='light' />
      {fontsLoaded ? <RootNavigator /> : <Loader fullscreen />}
      <DialogHost />
    </SafeAreaProvider>
  )
}
