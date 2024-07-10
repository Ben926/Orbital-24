import styles from "@/styles/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import Goals from "@/components/Goals";

const ViewGoals = () => {
  return (
    <SafeAreaView style = {styles.indexContainer}>
      <Goals />
    </SafeAreaView>
  );
};

export default ViewGoals;