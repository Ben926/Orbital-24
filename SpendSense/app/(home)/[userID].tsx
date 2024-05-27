import { Text, View } from "react-native";
import styles from "../../styles/styles.js";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import TransactionForm from "@/components/TransactionForm";
import { useLocalSearchParams } from "expo-router";

const Home = () => {
const {userID} = useLocalSearchParams();
  return (
    <SafeAreaView style = {styles.indexContainer}>
      <TransactionForm userID = {userID}></TransactionForm>
    </SafeAreaView>
  );
};

export default Home;
