import styles from "@/styles/styles.js";
import { SafeAreaView } from "react-native-safe-area-context";
import Budgets from "@/components/Budgets";
import { useUser } from '@/contexts/UserContext'; 

const ViewBudgets = () => {
  const { userID } = useUser();
  return (
    <SafeAreaView style = {styles.indexContainer}>
      <Budgets userID = {userID} />
    </SafeAreaView>
  );
};

export default ViewBudgets;