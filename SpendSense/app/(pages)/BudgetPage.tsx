import styles from "@/styles/styles.js";
import { SafeAreaView } from "react-native-safe-area-context";
import Budgets from "@/components/Budgets";
import { DescriptionText } from "@/components/DescriptionText";


const ViewBudgets = () => {
  const header = 'Budgeting'
  const description = "Set a personal budget to control your spending!\n\n Keep your expenses in check and ensure you don't exceed your desired limit within a chosen time period.\n\n The amount in each budget card is calculated by simply adding the total amount of outflows in the date range."
  return (
    <SafeAreaView style = {styles.indexContainer}>
      <Budgets />
      <DescriptionText header={header} description={description}/>
    </SafeAreaView>
  );
};

export default ViewBudgets;