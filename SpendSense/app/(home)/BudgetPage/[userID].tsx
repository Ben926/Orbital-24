import styles from "../../../styles/styles.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import Budgets from "@/components/Budgets";
import BottomTabs from "@/components/BottomTabs";
import { Pressable, Text} from "react-native";
import {router} from "expo-router"

const ViewBudgets = () => {
  const {userID} = useLocalSearchParams();
  return (
    <SafeAreaView style = {styles.indexContainer}>
      <Budgets userID = {userID} />
      <BottomTabs />
    </SafeAreaView>
  );
};

export default ViewBudgets;