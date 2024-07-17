import { Stack } from "expo-router";

export default function Layout() {
    return <Stack>
        <Stack.Screen name = "ViewAllPage" options = {{title: "View All Records", headerShown: false}}></Stack.Screen>
        <Stack.Screen name = "MonthlyTotals" options = {{title: "Montly Totals", headerShown: false}}></Stack.Screen>
    </Stack>
}