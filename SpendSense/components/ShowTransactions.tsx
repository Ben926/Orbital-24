import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import supabase from "../supabase/supabase";
import styles from '@/styles/styles';
import PieChartComponent from '@/components/PieChart';

type Transaction = {
  id: string;
  date: string;
  category: string;
  amount: number;
  timestamp: string;
  description: string;
  color: string
};

interface ShowTransactionsProps {
  userID: string;
  startDate: string;
  endDate: string;
}

type PieChartData = {
  name: string;
  amount: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
};

const ShowTransactions: React.FC<ShowTransactionsProps> = ({ userID, startDate, endDate }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [outflowPieChartData, setOutflowPieChartData] = useState<PieChartData[]>([]);
  const [inflowPieChartData, setInflowPieChartData] = useState<PieChartData[]>([]);
  const [showInflowPieChart, setShowInflowPieChart] = useState<Boolean>(false);

  useEffect(() => {
    fetchTransactions();
  }, [startDate, endDate]);

  useEffect(() => {fetchPieChartData()}, [transactions]);

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
      const inflowTransactions = transactions.filter((transaction) => transaction.amount >= 0)
      const outflowTransactions = transactions.filter((transaction) => transaction.amount < 0)
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

const deleteTransaction = async (transactionID: string) => {
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
    }
  } catch (error) {
    console.error('Error deleting transaction', error);
  }
};

const renderItem = ({ item }: { item: Transaction }) => (
  <View style={styles.transactionItem}>
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => deleteTransaction(item.id)}
    >
      <Text style={styles.deleteButtonText}>x</Text>
    </TouchableOpacity>
    <Text style={styles.transactionDate}>{item.date}</Text>
    <Text style={styles.transactionCategory}>{item.category}</Text>
    <Text style={styles.transactionAmount}>${item.amount}</Text>
    <Text style={styles.transactionTimestamp}>{formatTimestamp(item.timestamp)}</Text>
    <Text style={styles.transactionDescription}>{item.description}</Text>
  </View>
);

return (
  <View style={styles.transactionContainer}>
    {loading ? (
      <Text>Loading...</Text>
    ) : (
      <>
        {transactions.length != 0 && <TouchableOpacity style={styles.button} onPress={() => setShowInflowPieChart(!showInflowPieChart)}>
          <Text style={styles.buttonText}>{showInflowPieChart ? "Inflow" : "Outflow"}</Text>
        </TouchableOpacity>}
        <PieChartComponent data={showInflowPieChart ? inflowPieChartData : outflowPieChartData} />
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      </>
    )}
  </View>
);
};

export default ShowTransactions;
