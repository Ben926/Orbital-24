import React, { useState, useEffect } from "react";
import { View, ScrollView, Dimensions, Text, Pressable, Modal, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarChart } from "react-native-chart-kit";
import supabase from "@/supabase/supabase";
import styles from "@/styles/styles";
import { useUser } from '@/contexts/UserContext';
import { router } from "expo-router"
import { Picker } from '@react-native-picker/picker';

type Transaction = {
    id: string;
    date: string;
    category: string;
    amount: number;
    timestamp: string;
    description: string;
    color: string;
    type: string;
}

const MonthlyExpenseChart = () => {
    const [inflows, setInflows] = useState<number[]>([]);
    const [outflows, setOutflows] = useState<number[]>([]);
    const [net, setNet] = useState<number[]>([]);
    const [labels, setLabels] = useState<string[]>([]);
    const { userID, refreshUserData, setRefreshUserData } = useUser();
    const [transactionType, setTransactionType] = useState<string>("outflows");
    const [filteredData, setFilteredData] = useState<number[]>([]);
    const [filteredLabels, setFilteredLabels] = useState<string[]>([]);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => { fetchTransactions() }, [refreshUserData]);
    useEffect(() => { fetchFilteredTransactions() }, [refreshUserData, selectedCategory]);

    const fetchTransactions = async () => {
        try {
            const { data, error } = await supabase
                .from('raw_records')
                .select('*')
                .eq('user_id', userID);
            if (error) {
                console.error('Error fetching transactions', error);
            } else {
                processMonthlyData(data || []);
            }
        } finally {
            setRefreshUserData(false);
        }
    }

    const fetchFilteredTransactions = async () => {
        try {
            const { data, error } = await supabase
                .from('raw_records')
                .select('*')
                .eq('user_id', userID)
                .eq('category', selectedCategory);
            if (error) {
                console.error('Error fetching transactions', error);
            } else {
                processFilteredData(data || []);
            }
        } finally {
            setRefreshUserData(false);
        }
    }

    const processMonthlyData = (transactions: Transaction[]) => {
        if (transactions.length === 0) {
            setInflows([]);
            setOutflows([]);
            setNet([]);
            setLabels([]);
            return;
        }

        // Sort transactions by date
        transactions.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        const firstDate = new Date(transactions[0].timestamp);
        const lastDate = new Date(transactions[transactions.length - 1].timestamp);

        const firstMonth = firstDate.getMonth();
        const firstYear = firstDate.getFullYear();
        const lastMonth = lastDate.getMonth();
        const lastYear = lastDate.getFullYear();

        const inflows: number[] = [];
        const outflows: number[] = [];
        const net: number[] = [];
        const generatedLabels: string[] = [];
        let currentYear = firstYear;
        let currentMonth = firstMonth;

        while (currentYear < lastYear || (currentYear === lastYear && currentMonth <= lastMonth)) {
            const label = `${new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(currentYear, currentMonth))} ${currentYear}`;
            generatedLabels.push(label);
            inflows.push(0);
            outflows.push(0);
            net.push(0);

            if (currentMonth === 11) {
                currentMonth = 0;
                currentYear++;
            } else {
                currentMonth++;
            }
        }

        transactions.forEach(transaction => {
            const transactionDate = new Date(transaction.timestamp);
            const transactionMonth = transactionDate.getMonth();
            const transactionYear = transactionDate.getFullYear();
            const label = `${new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(transactionYear, transactionMonth))} ${transactionYear}`;
            const index = generatedLabels.indexOf(label);
            if (transaction.amount > 0) {
                inflows[index] += transaction.amount;
            } else {
                outflows[index] += Math.abs(transaction.amount); // Use absolute value for outflows
            }
            net[index] = inflows[index] - outflows[index];
        });

        setInflows(inflows);
        setOutflows(outflows);
        setNet(net);
        setLabels(generatedLabels);
        setCategories(Array.from(new Set(transactions.map(transaction => transaction.category))));
    };

    const processFilteredData = (transactions: Transaction[]) => {
        if (transactions.length === 0) {
            setFilteredData([]);
            setFilteredLabels([]);
            return;
        }

        // Sort transactions by date
        transactions.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        const firstDate = new Date(transactions[0].timestamp);
        const lastDate = new Date(transactions[transactions.length - 1].timestamp);

        const firstMonth = firstDate.getMonth();
        const firstYear = firstDate.getFullYear();
        const lastMonth = lastDate.getMonth();
        const lastYear = lastDate.getFullYear();

        const data: number[] = [];
        const generatedLabels: string[] = [];
        let currentYear = firstYear;
        let currentMonth = firstMonth;

        while (currentYear < lastYear || (currentYear === lastYear && currentMonth <= lastMonth)) {
            const label = `${new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(currentYear, currentMonth))} ${currentYear}`;
            generatedLabels.push(label);
            data.push(0);

            if (currentMonth === 11) {
                currentMonth = 0;
                currentYear++;
            } else {
                currentMonth++;
            }
        }

        transactions.forEach(transaction => {
            const transactionDate = new Date(transaction.timestamp);
            const transactionMonth = transactionDate.getMonth();
            const transactionYear = transactionDate.getFullYear();
            const label = `${new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(transactionYear, transactionMonth))} ${transactionYear}`;
            const index = generatedLabels.indexOf(label);
            data[index] += Math.abs(transaction.amount);
        });

        setFilteredData(data);
        setFilteredLabels(generatedLabels);
    };

    return (
        <SafeAreaView style={styles.loginContainer}>
            <View style={styles.buttonGroup}>
                <Pressable style={[styles.timeUnselectButton, transactionType === 'outflows' && styles.timeButton]} onPress={() => setTransactionType("outflows")}>
                    <Text style={styles.buttonText}>Outflows</Text>
                </Pressable>
                <Pressable style={[styles.timeUnselectButton, transactionType === 'inflows' && styles.timeButton]} onPress={() => setTransactionType("inflows")}>
                    <Text style={styles.buttonText}>Inflows</Text>
                </Pressable>
                <Pressable style={[styles.timeUnselectButton, transactionType === 'net' && styles.timeButton]} onPress={() => setTransactionType("net")}>
                    <Text style={styles.buttonText}>Net Total</Text>
                </Pressable>
            </View>
            <ScrollView horizontal>
                <BarChart
                    data={{
                        labels: labels,
                        datasets: [
                            {
                                data: transactionType == "outflows" ?
                                    outflows :
                                    (transactionType == "inflows" ? inflows : net)
                            }]
                    }}
                    width={Dimensions.get("window").width * labels.length / 3} // Adjust width based on number of labels
                    height={280}
                    yAxisLabel="$"
                    chartConfig={{
                        backgroundColor: "#ffffff",
                        backgroundGradientFrom: "#ffffff",
                        backgroundGradientTo: "#ffffff",
                        decimalPlaces: 0, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(0, 125, 0, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForBackgroundLines: {
                            stroke: "#e3e3e3"
                        },
                        barPercentage: 0.5
                    }}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                        paddingVertical: 10
                    }}
                    showValuesOnTopOfBars
                    fromZero

                />
            </ScrollView>
            <View style={{ borderBottomColor: '#e3e3e3', borderBottomWidth: 1, marginVertical: 10 }} />
            <Text style={styles.buttonText}> By Category </Text>
            <TouchableOpacity style={styles.button} onPress={() => setIsFilterModalVisible(true)}>
                <Text style={styles.buttonText}>{selectedCategory || "Select"}</Text>
            </TouchableOpacity>
            <Modal visible={isFilterModalVisible} animationType="slide" transparent={true}>
                <View style={styles.filterContainer}>
                    <View style={styles.filterContent}>
                        <Text style={styles.filterTitle}>Select Category</Text>
                        <Picker
                            selectedValue={selectedCategory}
                            onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                            style={styles.filterPicker}
                        >
                            <Picker.Item label="" value="" />
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
            <ScrollView horizontal>
                <BarChart
                    data={{
                        labels: filteredLabels,
                        datasets: [
                            {
                                data: filteredData
                            }]
                    }}
                    width={Dimensions.get("window").width * labels.length / 3} // Adjust width based on number of labels
                    height={200}
                    yAxisLabel="$"
                    chartConfig={{
                        backgroundColor: "#ffffff",
                        backgroundGradientFrom: "#ffffff",
                        backgroundGradientTo: "#ffffff",
                        decimalPlaces: 0, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(0, 125, 0, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForBackgroundLines: {
                            stroke: "#e3e3e3"
                        },
                        barPercentage: 0.5
                    }}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                        paddingVertical: 10
                    }}
                    showValuesOnTopOfBars
                    fromZero

                />
            </ScrollView>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.transparentButtonText}>Back</Text>
            </Pressable>
        </SafeAreaView>
    );
};

export default MonthlyExpenseChart;
