import { DescriptionText } from "@/components/DescriptionText";
import styles from "@/styles/styles";
import ShowAnalytics from "@/components/ShowAnalytics";
import { SafeAreaView } from "react-native-safe-area-context";

const Analytics = () => {
  const header = 'Spending Analytics';
  const description = 'Analyze your spending habits by category and date to gain insights into your financial behavior!'
    return (
        <SafeAreaView style={styles.indexContainer}>
            <ShowAnalytics/>
            <DescriptionText header={header} description={description}/>
        </SafeAreaView>
    )

}

export default Analytics;