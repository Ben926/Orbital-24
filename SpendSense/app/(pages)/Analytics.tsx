import { Text, Pressable, View, Modal } from "react-native";
import { DescriptionText } from "@/components/DescriptionText";
import styles from "@/styles/styles";
import ShowAnalytics from "@/components/ShowAnalytics";

const Analytics = () => {
  const header = 'Spending Analytics';
  const description = 'Analyze your spending habits by category and date to gain insights into your financial behavior!'
    return (
        <View style={styles.indexContainer}>
            <ShowAnalytics/>
            <DescriptionText header={header} description={description}/>
        </View>
    )

}

export default Analytics;