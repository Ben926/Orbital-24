import styles from "@/styles/styles.js";
import { SafeAreaView } from "react-native-safe-area-context";
import AutomatedTransactions from "@/components/AutomatedTransactions";

const AutomatePage= () => {
  return (
    <SafeAreaView style = {styles.indexContainer}>
      <AutomatedTransactions />
    </SafeAreaView>
  );
};

export default AutomatePage;