import BottomTabs from '@/components/BottomTabs'
import {Text, View} from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import styles from '@/styles/styles';

const BudgetPage = () => {
    return (
    <SafeAreaView style = {styles.indexContainer}>
        <Text>GoalPage</Text>
        <BottomTabs />
    </SafeAreaView>
    )
}

export default BudgetPage;