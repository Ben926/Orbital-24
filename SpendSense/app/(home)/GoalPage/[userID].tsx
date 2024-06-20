import styles from "../../../styles/styles.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import Goals from "@/components/Goals";
import BottomTabs from "@/components/BottomTabs";
import { Pressable, Text} from "react-native";
import {router} from "expo-router"

const ViewGoals = () => {
  const {userID} = useLocalSearchParams();
  return (
    <SafeAreaView style = {styles.indexContainer}>
      <Goals userID = {userID} />
      <BottomTabs />
    </SafeAreaView>
  );
};

export default ViewGoals;