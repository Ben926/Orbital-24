import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import supabase from "@/supabase/supabase";
import { getSingaporeDate } from "@/utils/getSingaporeDate";
import styles from "@/styles/styles";

type Transaction = {
  id: string;
  date: string;
  category: string;
  amount: number;
  timestamp: string;
  description: string;
  color: string;
};

const ShowAnalytics = () => {
  const [timePeriod, setTimePeriod] = useState('daily');
  const [manualStartDate, setManualStartDate] = useState<Date>(new Date());
  const [manualEndDate, setManualEndDate] = useState<Date>(new Date());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [prevMonthTransactions, setPrevMonthTransactions] = useState<Transaction[]>([]);
  const [currMonthTransactions, setCurrMonthTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [comparisonText, setComparisonText] = useState<string>('');
  const [comparisonColor, setComparisonColor] = useState<string>('');

  const handleTimePeriodChange = (period: string) => {
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
        const firstDayOfWeek = today.getDate() - today.getDay() + 1;
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
    let endDate;
    switch (timePeriod) {
      case 'manual':
        endDate = manualEndDate;
        endDate.setHours(23, 59, 59, 999);
        endDate = getSingaporeDate(endDate);
        break;
      case 'daily':
        endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
        endDate = getSingaporeDate(endDate);
        break;
      case 'weekly':
        endDate = new Date();
        const day = endDate.getDay();
        const diff = 7 - day;
        endDate.setDate(endDate.getDate() + diff + 1);
        endDate.setHours(23, 59, 59, 999);
        endDate = getSingaporeDate(endDate);
        break;
      case 'monthly':
        endDate = new Date();
        endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
        endDate = getSingaporeDate(endDate);
        break;
      default:
        endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
        endDate = getSingaporeDate(endDate);
        break;
    }
    return endDate.toISOString();
  };
  const getCurrMonthDates = () => {
    const today = new Date();
    let currMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    currMonthStart.setHours(0, 0, 0, 0);
    const endDate = new Date();
    let currMonthEnd = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
    currMonthEnd.setHours(23, 59, 59, 999);
    return {
        startDate: getSingaporeDate(currMonthStart).toISOString(),
        endDate: getSingaporeDate(currMonthEnd).toISOString(),
      };
    
  }

  const getPrevMonthDates = () => {
    const today = new Date();
    const prevMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate() - today.getDate() + 1);
    const prevMonthEnd = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    prevMonthEnd.setHours(23, 59, 59, 999);
    return {
      startDate: getSingaporeDate(prevMonthStart).toISOString(),
      endDate: getSingaporeDate(prevMonthEnd).toISOString(),
    };
  };
  
  useEffect(() => {
    const currentTotal = currMonthTransactions.reduce((total, transaction) => total + transaction.amount, 0);
    const prevTotal = prevMonthTransactions.reduce((total, transaction) => total + transaction.amount, 0);

    const diff = currentTotal - prevTotal;
    const absDiff = Math.abs(diff);
    const comparisonText = diff < 0
      ? `You have spent $${absDiff.toFixed(2)} more this month so far compared to last month.`
      : `You have spent $${absDiff.toFixed(2)} less this month so far compared to last month.`;

    setComparisonText(comparisonText);
    setComparisonColor(diff < 0 ? 'red' : 'green');
  }, [transactions, prevMonthTransactions]);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('raw_records')
          .select('*')
          .gte('timestamp', getStartDate())
          .lte('timestamp', getEndDate());

        const { startDate: prevStart, endDate: prevEnd } = getPrevMonthDates();
        const { startDate: currStart, endDate: currEnd } = getCurrMonthDates();
        const { data: prevData, error: prevError } = await supabase
            .from('raw_records')
            .select('*')
            .gte('timestamp', prevStart)
            .lte('timestamp', prevEnd);

        const { data: currData, error: currError } = await supabase
            .from('raw_records')
            .select('*')
            .gte('timestamp', currStart)
            .lte('timestamp', currEnd);

        if (error) {
          console.error('Error fetching transactions', error);
        } else {
          setTransactions(data || []);
          setPrevMonthTransactions(prevData || []);
          setCurrMonthTransactions(currData || []);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [timePeriod, manualStartDate, manualEndDate]);

  const renderCategorySpending = ({ item }: { item: { category: string, amount: number, color: string } }) => (
    <View style={styles.analyticsItem}>
      <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
      <Text style={styles.analyticsDescription}>{item.category}</Text>
      <Text style={styles.analyticsAmount}>{item.amount < 0 ? `-$${Math.abs(item.amount)}` : `+$${item.amount}`}</Text>
    </View>
  );

  const getCategorySpending = () => {
    const categorySpending = transactions.reduce((acc, transaction) => {
      const category = transaction.category;
      const amount = transaction.amount;
      const color = transaction.color
      if (acc[category]) {
        acc[category].amount += amount;
      } else {
        acc[category] = {amount, color};
      }
      return acc;
    }, {} as { [key: string]: {amount: number, color: string }});

    return Object.keys(categorySpending).map((category) => ({
      category,
      amount: categorySpending[category].amount,
      color: categorySpending[category].color,
    }));
  };
  const getTotalSpending = () => {
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
  };
  const dataWithTotalSpending = [...getCategorySpending(), { category: 'Total', amount: getTotalSpending(), color: '', isTotal: true }];

  return (
    <View style={styles.transactionContainer}>
      <View style={styles.buttonGroup}>
        <Pressable style={[styles.timeUnselectButton, timePeriod === 'daily' && styles.timeButton]} onPress={() => handleTimePeriodChange('daily')}>
          <Text style={styles.buttonText}>Today</Text>
        </Pressable>
        <Pressable style={[styles.timeUnselectButton, timePeriod === 'weekly' && styles.timeButton]} onPress={() => handleTimePeriodChange('weekly')}>
          <Text style={styles.buttonText}>This Week</Text>
        </Pressable>
        <Pressable style={[styles.timeUnselectButton, timePeriod === 'monthly' && styles.timeButton]} onPress={() => handleTimePeriodChange('monthly')}>
          <Text style={styles.buttonText}>This Month</Text>
        </Pressable>
        <Pressable style={[styles.timeUnselectButton, timePeriod === 'manual' && styles.timeButton]} onPress={() => handleTimePeriodChange('manual')}>
          <Text style={styles.buttonText}>Manual</Text>
        </Pressable>
      </View>
      <View style={styles.datetimepicker}>
        {timePeriod === 'manual' && (
          <>
            <DateTimePicker
              value={manualStartDate}
              mode="date"
              display="default"
              onChange={onManualStartDateChange}
            />
            <DateTimePicker
              value={manualEndDate}
              mode="date"
              display="default"
              onChange={onManualEndDateChange}
            />
          </>
        )}
      </View>
      <Text style={{ color: comparisonColor, textAlign: 'center', marginVertical: 10 }}>{comparisonText}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        
        <FlatList
          data={dataWithTotalSpending}
          keyExtractor={(item) => item.category}
          renderItem={renderCategorySpending}
        />
        
      )}
    </View>
  );
};

export default ShowAnalytics;
