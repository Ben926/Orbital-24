import { Text, Pressable } from "react-native";
import styles from "../../styles/styles.js";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import TransactionForm from "@/components/TransactionForm";
import { useLocalSearchParams, router } from "expo-router";

const Home = () => {
const {userID} = useLocalSearchParams();
const handleViewAll = () => {router.push(`ViewAll/${userID}`)}
  return (
    <SafeAreaView style = {styles.indexContainer}>
      <TransactionForm userID = {userID}></TransactionForm>
      <Pressable style={styles.transparentButton} onPress={handleViewAll}>
        <Text style={styles.transparentButtonText}>View All Records</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Home;
