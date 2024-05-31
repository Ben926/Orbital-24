import { Stack } from "expo-router";

export default function Layout() {
    return <Stack>
        <Stack.Screen name = "[userID]" options = {{title: "View All Records", headerShown: false}}></Stack.Screen>
    </Stack>
}