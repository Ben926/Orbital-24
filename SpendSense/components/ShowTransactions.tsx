import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import supabase from "../supabase/supabase";
import { router } from "expo-router";
import styles from '@/styles/styles';
import PieChartComponent from '@/components/PieChart';

type Goal = {
  id: string;
  goal_name: string;
  target_amount: number;
  current_amount: number;
  start_date: string;
  description: string;
};

type Transaction = {
  id: string;
  date: string;
  category: string;
  amount: number;
  timestamp: string;
  description: string;
  color: string;
};

interface ShowTransactionsProps {
  userID: string;
  startDate: string;
  endDate: string;
  showChart: boolean;
  showAll: boolean;
}

type PieChartData = {
  name: string;
  amount: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
};

const ShowTransactions: React.FC<ShowTransactionsProps> = ({ userID, startDate, endDate, showChart = true, showAll = true }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [outflowPieChartData, setOutflowPieChartData] = useState<PieChartData[]>([]);
  const [inflowPieChartData, setInflowPieChartData] = useState<PieChartData[]>([]);
  const [showInflowPieChart, setShowInflowPieChart] = useState<Boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState<boolean>(false);

  useEffect(() => {
    fetchTransactions();
  }, [startDate, endDate]);

  useEffect(() => { fetchPieChartData() }, [transactions]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(`raw_records_${userID.replace(/-/g, '')}`)
        .select('*')
        .gte('timestamp', startDate)
        .lte('timestamp', endDate)
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching transaction history', error);
      } else {
        setTransactions(data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPieChartData = async () => {
    const inflowTransactions = transactions.filter((transaction) => transaction.amount >= 0);
    const outflowTransactions = transactions.filter((transaction) => transaction.amount < 0);
    setInflowPieChartData(formatPieChartData(inflowTransactions || []));
    setOutflowPieChartData(formatPieChartData(outflowTransactions || []));
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formatPieChartData = (data: Transaction[]) => {
    const formattedData = data.reduce((acc: PieChartData[], curr) => {
      const categoryIndex = acc.findIndex(item => item.name === curr.category);
      if (categoryIndex >= 0) {
        acc[categoryIndex].amount += curr.amount;
      } else {
        acc.push({
          name: curr.category,
          amount: curr.amount,
          color: curr.color,
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        });
      }
      return acc;
    }, []);
    return formattedData;
  };

  const fetchGoals = async () => {
    const { data, error } = await supabase
      .from(`spending_goals_${userID.replace(/-/g, '')}`)
      .select('*');
    if (error) {
      console.error('Error fetching goals:', error);
      return [];
    }
    return data as Goal[];
  };

  const updateGoalAmounts = async (amount: number, transactionDate: Date) => {
    const goals = await fetchGoals();

    for (const goal of goals) {
      if (new Date(goal.start_date) <= transactionDate) {
        goal.current_amount -= amount;

        const { error } = await supabase
          .from(`spending_goals_${userID.replace(/-/g, '')}`)
          .update({ current_amount: goal.current_amount })
          .eq('id', goal.id);

        if (error) {
          console.error('Error updating goal amount:', error);
        }
      }
    }
  };

  const deleteTransaction = async (transactionID: string, transaction_amount: number, transaction_timestamp: string) => {
    setDeleting(true);
    try {
      const { error } = await supabase
        .from(`raw_records_${userID.replace(/-/g, '')}`)
        .delete()
        .eq('id', transactionID);

      if (error) {
        console.error('Error deleting transaction', error);
      } else {
        setTransactions((prevTransactions) =>
          prevTransactions.filter((transaction) => transaction.id !== transactionID)
        );
        await updateGoalAmounts(transaction_amount, new Date(transaction_timestamp));
      }
    } catch (error) {
      console.error('Error deleting transaction', error);
    } finally {
      setDeleting(false);
    }
  };

  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
        <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
        <View style={styles.transactionContent}>
            <View style={styles.transactionHeader}>
                <Text style={styles.transactionDescription}>{item.description}</Text>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteTransaction(item.id, item.amount, item.timestamp)}
                    disabled={deleting}
                >
                    <Text style={styles.deleteButtonText}>x</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.transactionDetails}>
                <Text style={styles.transactionCategory}>{item.category}</Text>
                <Text style={styles.transactionDate}>{item.date}</Text>
            </View>
            <View style={styles.transactionFooter}>
                
                <Text style={styles.transactionTimestamp}>{formatTimestamp(item.timestamp)}</Text>
                <Text style={styles.transactionAmount}>{item.amount < 0 ? `-$${Math.abs(item.amount)}` : `+$${item.amount}`}</Text>
            </View>
        </View>
    </View>
);


  const filteredTransactions = selectedCategory
    ? transactions.filter(transaction => transaction.category === selectedCategory)
    : transactions;

  const categories = Array.from(new Set(transactions.map(transaction => transaction.category)));

  return (
    <View style={styles.transactionContainer}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          {transactions.length !== 0 && (
            <>
              {showChart && <TouchableOpacity style={styles.button} onPress={() => setShowInflowPieChart(!showInflowPieChart)}>
                {<Text style={styles.buttonText}>{showInflowPieChart ? "Inflow" : "Outflow"}</Text>}
              </TouchableOpacity>}
              {showChart && <PieChartComponent data={showInflowPieChart ? inflowPieChartData : outflowPieChartData} />}
              <TouchableOpacity style={styles.button} onPress={() => setIsFilterModalVisible(true)}>
                <Text style={styles.buttonText}>Filter</Text>
              </TouchableOpacity>
            </>
          )}
          <View style={styles.topRightButtonContainer}>
         {showAll && <Pressable style={styles.viewAllButton} onPress={() => router.push(`ViewAll/${userID}`)}>
            <Text style={styles.viewAllButtonText}>View All</Text>
          </Pressable>}
            </View>
          <FlatList
            data={filteredTransactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
          />
        </>
      )}
      <Modal visible={isFilterModalVisible} animationType="slide" transparent={true}>
        <View style={styles.filterContainer}>
          <View style={styles.filterContent}>
            <Text style={styles.filterTitle}>Select Category</Text>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
              style={styles.filterPicker}
            >
              <Picker.Item label="All" value="" />
              {categories.map(category => (
                <Picker.Item key={category} label={category} value={category} />
              ))}
            </Picker>
            <TouchableOpacity style={styles.button} onPress={() => setIsFilterModalVisible(false)}>
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};



export default ShowTransactions;
