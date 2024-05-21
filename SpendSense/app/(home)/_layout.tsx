import { Tabs } from "expo-router"

const TabsLayout = () => {
    return <Tabs>
        <Tabs.Screen name = "HomePage" options = {{title: "Home", headerShown: false}}></Tabs.Screen>
    </Tabs>
}

export default TabsLayout;