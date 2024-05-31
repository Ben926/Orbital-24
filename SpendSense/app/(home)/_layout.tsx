import { Stack } from "expo-router";

export default function Layout() {
    return <Stack>
        <Stack.Screen name = "[userID]" options = {{title: "[userID]", headerShown: false}}></Stack.Screen>
        <Stack.Screen name = "ViewAll" options = {{title: "ViewAll", headerShown: false}}></Stack.Screen>
    </Stack>
}
