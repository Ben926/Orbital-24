import { Tabs } from "expo-router";

export default function Layout() {
    return <Tabs>
        <Tabs.Screen name = "Home" options = {{title: "Home", headerShown: false}}></Tabs.Screen>
        <Tabs.Screen name = "BudgetPage" options = {{title: "Budgets", headerShown: false}}></Tabs.Screen>
        <Tabs.Screen name = "GoalPage" options = {{title: "Goals", headerShown: false}}></Tabs.Screen>
    </Tabs>
}
