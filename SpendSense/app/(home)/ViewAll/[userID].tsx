import styles from "../../../styles/styles.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import ShowAllTransactions from "@/components/ShowAllTransactions";
import BottomTabs from "@/components/BottomTabs";

const ViewAll = () => {
  const {userID} = useLocalSearchParams();
  return (
    <SafeAreaView style = {styles.indexContainer}>
      <ShowAllTransactions userID = {userID} />
      <BottomTabs />
    </SafeAreaView>
  );
};

export default ViewAll;
