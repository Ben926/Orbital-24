import styles from "@/styles/styles.js";
import { SafeAreaView } from "react-native-safe-area-context";
import AutomatedTransactions from "@/components/AutomatedTransactions";

const ViewBudgets = () => {
  return (
    <SafeAreaView style = {styles.indexContainer}>
      <AutomatedTransactions />
    </SafeAreaView>
  );
};

export default ViewBudgets;