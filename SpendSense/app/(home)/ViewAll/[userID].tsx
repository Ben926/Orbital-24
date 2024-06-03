import styles from "../../../styles/styles.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import ShowTransactions from "@/components/ShowTransactions";
import BottomTabs from "@/components/BottomTabs";

const ViewAll = () => {
  const {userID} = useLocalSearchParams();
  return (
    <SafeAreaView style = {styles.indexContainer}>
      <ShowTransactions userID = {userID} startDate = {"2000-01-01T00:00:00Z"} endDate = {"2100-01-01T00:00:00Z"} />
      <BottomTabs />
    </SafeAreaView>
  );
};

export default ViewAll;
