import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import supabase from "@/supabase/supabase";
import { getSingaporeDate } from "@/utils/getSingaporeDate";
import { useUser } from '../contexts/UserContext';
import styles from "@/styles/styles";
import { router } from "expo-router";

type Transaction = {
  id: string;
  log: string;
  category: string;
  amount: number;
  timestamp: string;
  description: string;
  color: string;
};

const ShowAnalytics = () => {
  const { userID, refreshUserData, setRefreshUserData } = useUser();
  const [timePeriod, setTimePeriod] = useState('daily');
  const [manualStartDate, setManualStartDate] = useState<Date>(new Date());
  const [manualEndDate, setManualEndDate] = useState<Date>(new Date());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [prevMonthTransactions, setPrevMonthTransactions] = useState<Transaction[]>([]);
  const [currMonthTransactions, setCurrMonthTransactions] = useState<Transaction[]>([]);
  const [prevMonthOutflow, setPrevMonthOutflow] = useState<Transaction[]>([]);
  const [currMonthOutflow, setCurrMonthOutflow] = useState<Transaction[]>([]);
  const [prevMonthInflow, setPrevMonthInflow] = useState<Transaction[]>([]);
  const [currMonthInflow, setCurrMonthInflow] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [comparisonText, setComparisonText] = useState<string>('');
  const [comparisonOutText, setComparisonOutText] = useState<string>('');
  const [comparisonInText, setComparisonInText] = useState<string>('');
  const [comparisonColor, setComparisonColor] = useState<string>('');
  const [outColor, setOutColor] = useState<string>('');
  const [inColor, setInColor] = useState<string>('');

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
    const currOutflows = currMonthOutflow.reduce((total, transaction) => total + transaction.amount, 0);
    const currInflows = currMonthInflow.reduce((total, transaction) => total + transaction.amount, 0);
    const prevOutflows = prevMonthOutflow.reduce((total, transaction) => total + transaction.amount, 0);
    const prevInflows = prevMonthInflow.reduce((total, transaction) => total + transaction.amount, 0);

    const diffTotal = currentTotal - prevTotal;
    const diffOutflows = currOutflows - prevOutflows;
    const diffInflows = currInflows - prevInflows;
    const absDiffTotal = Math.abs(diffTotal);
    const absDiffOutflows = Math.abs(diffOutflows);
    const absDiffInflows = Math.abs(diffInflows);
    const savedText = diffTotal < 0
      ? `You have saved $${absDiffTotal.toFixed(2)} less this month so far compared to last month. (Net Total)`
      : `You have saved $${absDiffTotal.toFixed(2)} more this month so far compared to last month. (Net Total)`;
    const OutText = diffOutflows <= 0
      ? `You have spent $${absDiffOutflows.toFixed(2)} more this month so far compared to last month. (Outflows)`
      : `You have spent $${absDiffOutflows.toFixed(2)} less this month so far compared to last month.(Outflows)`;
    const InText = diffInflows < 0
      ? `You have earned $${absDiffInflows.toFixed(2)} less this month so far compared to last month. (Inflows)`
      : `You have earned $${absDiffInflows.toFixed(2)} more this month so far compared to last month. (Inflows)`;

    setComparisonText(savedText);
    setComparisonOutText(OutText);
    setComparisonInText(InText);
    setComparisonColor(diffTotal < 0 ? 'red' : 'green');
    setOutColor(diffOutflows < 0 ? 'red' : 'green');
    setInColor(diffInflows < 0 ? 'red' : 'green');
  }, [currMonthTransactions, prevMonthTransactions, currMonthOutflow, currMonthInflow, prevMonthOutflow, prevMonthInflow]);


  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('raw_records')
          .select('*')
          .eq('user_id', userID)
          .gte('timestamp', getStartDate())
          .lte('timestamp', getEndDate());

        const { startDate: prevStart, endDate: prevEnd } = getPrevMonthDates();
        const { startDate: currStart, endDate: currEnd } = getCurrMonthDates();
        const { data: prevData, error: prevError } = await supabase
          .from('raw_records')
          .select('*')
          .eq('user_id', userID)
          .gte('timestamp', prevStart)
          .lte('timestamp', prevEnd);

        const { data: currData, error: currError } = await supabase
          .from('raw_records')
          .select('*')
          .eq('user_id', userID)
          .gte('timestamp', currStart)
          .lte('timestamp', currEnd);
        let prevOutflows = prevData?.filter((transaction) => transaction.amount < 0)
        let prevInflows = prevData?.filter((transaction) => transaction.amount >= 0)
        let currOutflows = currData?.filter((transaction) => transaction.amount < 0)
        let currInflows = currData?.filter((transaction) => transaction.amount >= 0)

        if (error) {
          console.error('Error fetching transactions', error);
        } else {
          setTransactions(data || []);
          setPrevMonthTransactions(prevData || []);
          setCurrMonthTransactions(currData || []);
          setPrevMonthOutflow(prevOutflows || []);
          setCurrMonthOutflow(currOutflows || []);
          setPrevMonthInflow(prevInflows || []);
          setCurrMonthInflow(currInflows || []);
        }
      } finally {
        setLoading(false);
        setRefreshUserData(false);
      }
    };

    fetchTransactions();
  }, [timePeriod, manualStartDate, manualEndDate, refreshUserData]);

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
        acc[category] = { amount, color };
      }
      return acc;
    }, {} as { [key: string]: { amount: number, color: string } });

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
      <Text style={{ color: comparisonColor, textAlign: 'center', marginVertical: 8 }}>{comparisonText}</Text>
      <Text style={{ color: outColor, textAlign: 'center', marginVertical: 8 }}>{comparisonOutText}</Text>
      <Text style={{ color: inColor, textAlign: 'center', marginVertical: 8 }}>{comparisonInText}</Text>
      <View style={styles.topRightButtonContainer}>
        <Pressable style={styles.viewAllButton} onPress={() => router.push(`MonthlyTotals`)}>
          <Text style={[styles.viewAllButtonText, { fontSize: 15 }]}>View Graphs</Text>
        </Pressable>
      </View>
      <View style={{ borderBottomColor: '#e3e3e3', borderBottomWidth: 1, marginVertical: 10 }} />
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
      {loading ? (
        <ActivityIndicator size="large" color="#008000" />
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
