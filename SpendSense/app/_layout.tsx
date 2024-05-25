import { Redirect, Stack} from "expo-router";
import { useFonts } from 'expo-font';
import { ActivityIndicator } from "react-native";



export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    'Figtree': require('../assets/fonts/Figtree-VariableFont_wght.ttf'),
    'Figtree-Bold': require('../assets/fonts/Figtree-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  return (<Stack>
    <Stack.Screen name = "SplashScreen" options = {{title: "", headerShown: false}}></Stack.Screen>
    <Stack.Screen name = "index" options = {{title: "", headerShown: false}}></Stack.Screen>
    <Stack.Screen name = "SignUpForm" options = {{title: "", headerShown: false}}></Stack.Screen>
    <Stack.Screen name = "LogInForm" options = {{title: "", headerShown: false}}></Stack.Screen>
    <Stack.Screen name = "(home)" options = {{title: "", headerShown: true}} ></Stack.Screen>
  </Stack>);
}