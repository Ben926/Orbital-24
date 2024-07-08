import styles from "@/styles/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import ShowTransactions from "@/components/ShowTransactions";
import { Pressable, Text} from "react-native";
import {router} from "expo-router"
import { useUser } from '@/contexts/UserContext'; 

const ViewAll = () => {
  const { userID } = useUser();
  return (
    <SafeAreaView style = {styles.indexContainer}>
      <ShowTransactions userID = {userID} startDate = {"2000-01-01T00:00:00Z"} endDate = {"2100-01-01T00:00:00Z"} showChart = {false} showAll = {false} />
      <Pressable style={styles.transparentButton} onPress={() => router.back()}>
        <Text style={styles.transparentButtonText}>Back</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default ViewAll;
