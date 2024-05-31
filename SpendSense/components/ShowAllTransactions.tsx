import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import supabase from "../supabase/supabase";
import styles from '@/styles/styles';

type Transaction = {
  id: string;
  date: string;
  category: string;
  amount: number;
  timestamp: string;
  description: string;
};

const ShowAllTransactions = ({ userID }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      let { data, error } = await supabase
        .from(`raw_records_${userID.replace(/-/g, '')}`)
        .select('*')
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

  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
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
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default ShowAllTransactions;
