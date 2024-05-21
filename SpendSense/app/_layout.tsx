import { Redirect, Stack} from "expo-router";

export default function RootLayout() {
  return (<Stack>
    <Stack.Screen name = "index" options = {{title: ""}}></Stack.Screen>
    <Stack.Screen name = "SignUpForm" options = {{title: ""}}></Stack.Screen>
    <Stack.Screen name = "LogInForm" options = {{title: ""}}></Stack.Screen>
    <Stack.Screen name = "(home)" options = {{title: "", headerShown: true}} ></Stack.Screen>
  </Stack>);
}