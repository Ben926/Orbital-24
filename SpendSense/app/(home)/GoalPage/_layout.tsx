import { Stack } from "expo-router";

export default function Layout() {
    return <Stack>
        <Stack.Screen name = "[userID]" options = {{title: "Goal Page", headerShown: false}}></Stack.Screen>
    </Stack>
}