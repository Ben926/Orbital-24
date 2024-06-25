import styles from "../../../styles/styles.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import ShowTransactions from "@/components/ShowTransactions";
import BottomTabs from "@/components/BottomTabs";
import { Pressable, Text} from "react-native";
import {router} from "expo-router"

const ViewAll = () => {
  const {userID} = useLocalSearchParams();
  return (
    <SafeAreaView style = {styles.indexContainer}>
      <ShowTransactions userID = {userID} startDate = {"2000-01-01T00:00:00Z"} endDate = {"2100-01-01T00:00:00Z"} showChart = {false} showAll = {false} />
      <BottomTabs />
      <Pressable style={styles.transparentButton} onPress={() => router.back()}>
        <Text style={styles.transparentButtonText}>Back</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default ViewAll;
