import { Tabs } from "expo-router";
import { Feather, Entypo } from '@expo/vector-icons';

export default function Layout() {
    return <Tabs>
        <Tabs.Screen name = "Home" options = {{title: "Home", headerShown: false, tabBarIcon: ({ color, size }) => (
            <Entypo name="home" size={24} color="black" />
          )}}></Tabs.Screen>
        <Tabs.Screen name = "BudgetPage" options = {{title: "Budgets", headerShown: false, tabBarIcon: ({ color, size }) => (
            <Feather name="dollar-sign" size={24} color="black" />
          )} }></Tabs.Screen>
        <Tabs.Screen name = "GoalPage" options = {{title: "Goals", headerShown: false, tabBarIcon: ({ color, size }) => (
            <Feather name="target" size={24} color="black" />
          )}}></Tabs.Screen>
        <Tabs.Screen name = "Stocks" options = {{title: "Stocks", headerShown: false, tabBarIcon: ({ color, size }) => (
          <Feather name="trending-up" size={24} color="black" />
        )}}></Tabs.Screen>
    </Tabs>
}
