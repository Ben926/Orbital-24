import styles from "@/styles/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import Goals from "@/components/Goals";
import { useUser } from '@/contexts/UserContext'; 

const ViewGoals = () => {
  const { userID } = useUser();
  return (
    <SafeAreaView style = {styles.indexContainer}>
      <Goals userID = {userID} />
    </SafeAreaView>
  );
};

export default ViewGoals;