import { Text, Pressable, View, Modal } from "react-native";
import { useState } from "react";
import styles from "../../styles/styles.js";
import { SafeAreaView } from "react-native-safe-area-context";
import TransactionForm from "@/components/TransactionForm";
import { useLocalSearchParams, router } from "expo-router";
import BottomTabs from "@/components/BottomTabs";
import ShowTransactions from "@/components/ShowTransactions";

const Home = () => {
  const { userID } = useLocalSearchParams();
  const handleViewAll = () => { router.replace(`ViewAll/${userID}`) }
  const [modalVisible, setModalVisible] = useState(false);
  const [timePeriod, setTimePeriod] = useState('daily'); // default to daily

  const handleTimePeriodChange = (period) => {
    setTimePeriod(period);
  };

  const getStartDate = () => {
    const today = new Date();
    let startDate;
    switch (timePeriod) {
      case 'daily':
        startDate = new Date(today.setHours(0, 0, 0, 0));
        break;
      case 'weekly':
        const firstDayOfWeek = today.getDate() - today.getDay();
        startDate = new Date(today.setDate(firstDayOfWeek));
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'monthly':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      default:
        startDate = new Date(today.setHours(0, 0, 0, 0));
    }
    return startDate.toISOString();
  };

  const getEndDate = () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return today.toISOString();
  };

  return (
    <SafeAreaView style={styles.indexContainer}>
      <View style={styles.buttonGroup}>
        <Pressable style={styles.transparentButton} onPress={() => handleTimePeriodChange('daily')}>
          <Text style={styles.transparentButtonText}>Daily</Text>
        </Pressable>
        <Pressable style={styles.transparentButton} onPress={() => handleTimePeriodChange('weekly')}>
          <Text style={styles.transparentButtonText}>Weekly</Text>
        </Pressable>
        <Pressable style={styles.transparentButton} onPress={() => handleTimePeriodChange('monthly')}>
          <Text style={styles.transparentButtonText}>Monthly</Text>
        </Pressable>
      </View>

      <ShowTransactions userID={userID} startDate={getStartDate()} endDate={getEndDate()} />

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
