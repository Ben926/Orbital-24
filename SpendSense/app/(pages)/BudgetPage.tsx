import styles from "@/styles/styles.js";
import { SafeAreaView } from "react-native-safe-area-context";
import Budgets from "@/components/Budgets";
import { DescriptionText } from "@/components/DescriptionText";


const ViewBudgets = () => {
  const header = 'Budgeting'
  const description = "Set a personal budget to control your spending! Keep your expenses in check and ensure you don't exceed your desired limit within a chosen time period."
  return (
    <SafeAreaView style = {styles.indexContainer}>
      <Budgets />
      <DescriptionText header={header} description={description}/>
    </SafeAreaView>
  );
};

export default ViewBudgets;