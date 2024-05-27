import { Tabs } from "expo-router"

const TabsLayout = () => {
    return <Tabs>
        <Tabs.Screen name = "[userID]" options = {{title: "[id]", headerShown: false}}></Tabs.Screen>
    </Tabs>
}

export default TabsLayout;