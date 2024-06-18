import { Text, Pressable, View, Modal } from "react-native";
import { useState } from "react";
import styles from "../../styles/styles.js";
import { SafeAreaView } from "react-native-safe-area-context";
import TransactionForm from "@/components/TransactionForm";
import { useLocalSearchParams, router } from "expo-router";
import BottomTabs from "@/components/BottomTabs";
import ShowTransactions from "@/components/ShowTransactions";
import DateTimePicker from '@react-native-community/datetimepicker';


const Home = () => {
  const { userID } = useLocalSearchParams();
  const handleViewAll = () => { router.replace(`ViewAll/${userID}`) }
  const [modalVisible, setModalVisible] = useState(false);
  const [timePeriod, setTimePeriod] = useState('');
  const getSingaporeDate = (date = new Date()) => {
    const offsetDate = new Date(date);
    offsetDate.setHours(offsetDate.getHours() + 8);
    return offsetDate;
  };
  const [manualStartDate, setManualStartDate] = useState<Date>(new Date());
  const [manualEndDate, setManualEndDate] = useState<Date>(new Date());
  const [daily, setDaily] = useState(true);
  const [weekly, setWeekly] = useState(false);
  const [monthly, setMonthly] = useState(false);
  const [manual, setManual] = useState(false);



  const handleTimePeriodChange = (period) => {
    setTimePeriod(period);
  };

  const onManualStartDateChange = (event: any, selectedDate?: Date) => {
    const currentStartDate = selectedDate || manualStartDate;
    setManualStartDate(currentStartDate);
  };

  const onManualEndDateChange = (event: any, selectedDate?: Date) => {
    const currentEndDate = selectedDate || manualEndDate;
    setManualEndDate(currentEndDate);
  };

  const getStartDate = () => {
    const today = new Date();
    let startDate;
    switch (timePeriod) {
      case 'daily':
        startDate = new Date(today.setHours(0, 0, 0, 0));
        startDate = getSingaporeDate(startDate);
        break;
      case 'weekly':
        const firstDayOfWeek = today.getDate() - today.getDay();
        startDate = new Date(today.setDate(firstDayOfWeek));
        startDate.setHours(0, 0, 0, 0);
        startDate = getSingaporeDate(startDate);
        break;
      case 'monthly':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        startDate.setHours(0, 0, 0, 0);
        startDate = getSingaporeDate(startDate);
        break;
      case 'manual':
        startDate = manualStartDate;
        startDate.setHours(0, 0, 0, 0);
        startDate = getSingaporeDate(startDate);
        break;
      default:
        startDate = new Date(today.setHours(0, 0, 0, 0));
        startDate = getSingaporeDate(startDate);
    }
    return startDate.toISOString();
  };

  const getEndDate = () => {
    if (timePeriod == "manual") {
      let endDate = manualEndDate;
      endDate.setHours(23, 59, 59, 999);
      return endDate.toISOString();
    } else {
      let today = new Date();
      today.setHours(23, 59, 59, 999);
      today = getSingaporeDate(today);
      return today.toISOString();
    }
  };

  return (
    <SafeAreaView style={styles.indexContainer}>
      <View style={styles.buttonGroup}>
        <Pressable style={[styles.timeUnselectButton, timePeriod == 'daily' && styles.timeButton]} onPress={() => handleTimePeriodChange('daily')}>
          <Text style={styles.buttonText}>Daily</Text>
        </Pressable>
        <Pressable style={[styles.timeUnselectButton, timePeriod == 'weekly' && styles.timeButton]} onPress={() => handleTimePeriodChange('weekly')}>
          <Text style={styles.buttonText}>Weekly</Text>
        </Pressable>
        <Pressable style={[styles.timeUnselectButton, timePeriod == 'monthly' && styles.timeButton]} onPress={() => handleTimePeriodChange('monthly')}>
          <Text style={styles.buttonText}>Monthly</Text>
        </Pressable>
        <Pressable style={[styles.timeUnselectButton, timePeriod == 'manual' && styles.timeButton]} onPress={() => handleTimePeriodChange('manual')}>
          <Text style={styles.buttonText}>Manual</Text>
        </Pressable>
      </View>
      <View style={styles.datetimepicker}>
        {timePeriod == "manual" && <DateTimePicker
          value={manualStartDate}
          mode="date"
          display="default"
          onChange={onManualStartDateChange} />}
        {timePeriod == "manual" && <DateTimePicker
          value={manualEndDate}
          mode="date"
          display="default"
          onChange={onManualEndDateChange} />}
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
