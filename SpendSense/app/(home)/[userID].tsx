import { Text, Pressable, View, Button, Modal } from "react-native";
import { useState } from "react"
import styles from "../../styles/styles.js";
import { SafeAreaView } from "react-native-safe-area-context";
import TransactionForm from "@/components/TransactionForm";
import { useLocalSearchParams, router } from "expo-router";
import BottomTabs from "@/components/BottomTabs";

const Home = () => {
  const { userID } = useLocalSearchParams();
  const handleViewAll = () => { router.replace(`ViewAll/${userID}`) }
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <SafeAreaView style={styles.indexContainer}>
      <Pressable style={styles.transparentButton} onPress={handleViewAll}>
        <Text style={styles.transparentButtonText}>View All Records</Text>
      </Pressable>

      <Pressable style={styles.transparentButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.transparentButtonText}>Create New Transaction</Text>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.transactionFormContainer}>
          <TransactionForm userID={userID} />
          <Pressable style={styles.transparentButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.transparentButtonText}>Close</Text>
          </Pressable>
        </View>
      </Modal>

      <BottomTabs />
    </SafeAreaView>
  );
}

export default Home;
