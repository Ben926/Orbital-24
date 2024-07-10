import styles from "@/styles/styles.js";
import { SafeAreaView } from "react-native-safe-area-context";
import Budgets from "@/components/Budgets";

const ViewBudgets = () => {
  return (
    <SafeAreaView style = {styles.indexContainer}>
      <Budgets />
    </SafeAreaView>
  );
};

export default ViewBudgets;