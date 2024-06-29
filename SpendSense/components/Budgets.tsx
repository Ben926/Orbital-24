import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, TouchableOpacity, Modal, TextInput, Alert, } from 'react-native';
import * as Progress from 'react-native-progress';
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from '@/styles/styles';
import DateTimePicker from '@react-native-community/datetimepicker';

import supabase from '@/supabase/supabase';

type Budget = {
    id: string;
    budget_amount: number;
    amount_spent: number;
    start_date: string;
    end_date: string;
    description: string;
};

interface BudgetsProps {
    userID: string;
}

const BudgetPage: React.FC<BudgetsProps> = ({ userID }) => {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [budgetAmount, setBudgetAmount] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const getSingaporeDate = (date = new Date()) => {
        const offsetDate = new Date(date);
        offsetDate.setHours(offsetDate.getHours() + 8);
        return offsetDate;
    };
    const onStartDateChange = (event: any, selectedDate?: Date) => {
        const currentStartDate = selectedDate || startDate;
        setStartDate(currentStartDate);
    };

    const onEndDateChange = (event: any, selectedDate?: Date) => {
        const currentEndDate = selectedDate || endDate;
        setEndDate(currentEndDate);
    };

    useEffect(() => {
        fetchBudgets();
    }, []);


    const fetchBudgets = async () => {
        const { data, error } = await supabase
            .from(`budget_plan_${userID.replace(/-/g, '')}`)
            .select('*');
        if (error) {
            console.error(error);
        } else {
            setBudgets(data as Budget[]);
        }
    };

    const calculateAmountSpent = async (startDate: Date, endDate: Date) => {
        const formattedStartDate = startDate.toISOString();
        const formattedEndDate = endDate.toISOString();
        const { data, error } = await supabase
            .from(`raw_records_${userID.replace(/-/g, '')}`)
            .select('*')
            .lt('amount', 0)
            .gte('timestamp', formattedStartDate)
            .lte('timestamp', formattedEndDate)
            .order('timestamp', { ascending: false });

        if (error) {
            console.error(error);
            return;
        }
        const amount_spent = -data.reduce((sum, transaction) => sum + transaction.amount, 0);
        return amount_spent;
    };

    const addBudget = async () => {
        if (!budgetAmount) {
            Alert.alert('Please fill in the goal and amount!')
        }
        else if (isNaN(parseFloat(budgetAmount))) {
            Alert.alert('Key in a valid amount')   
        }
       else if (budgetAmount.trim()) {
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
            const amount_spent = await calculateAmountSpent(getSingaporeDate(startDate), getSingaporeDate(endDate));
            const { data, error } = await supabase
                .from(`budget_plan_${userID.replace(/-/g, '')}`)
                .insert([
                    {
                        log: getSingaporeDate(),
                        budget_amount: parseFloat(budgetAmount),
                        amount_spent,
                        start_date: getSingaporeDate(startDate),
                        end_date: getSingaporeDate(endDate),
                        description: description
                    },
                ])
                .select();


            if (error) {
                console.error(error);
            } else {
                Alert.alert('Success', 'Goal created successfully!');
                setBudgets([...budgets, ...data]);
                setBudgetAmount('');
                setDescription('');
                setModalVisible(false);
                setStartDate(new Date());
                setEndDate(new Date());
            }
        } 
    };
    const deleteBudget = async (budgetID: string) => {
        try {
            const { error } = await supabase
                .from(`budget_plan_${userID.replace(/-/g, '')}`)
                .delete()
                .eq('id', budgetID);

            if (error) {
                console.error('Error deleting budget', error);
            } else {
                setBudgets((prevBudgets) =>
                    prevBudgets.filter((budget) => budget.id !== budgetID)
                );
            }
        } catch (error) {
            console.error('Error deleting budget', error);
        }
    };
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            month: 'short',
            day: 'numeric',
        };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <SafeAreaView style={styles.transactionContainer}>
            <FlatList
                data={budgets}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.transactionItem}>
                        <View style={styles.transactionContent}>
                            <View style={styles.transactionHeader}>
                                <Text style={styles.transactionAmount}>Budget: ${item.budget_amount}</Text>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => deleteBudget(item.id)}
                                >
                                    <Text style={styles.deleteButtonText}>x</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.transactionAmount}>Amount Spent: ${item.amount_spent}</Text>
                            <Text style={styles.transactionTimestamp}>
                    {`${formatDate(item.start_date)} - ${formatDate(item.end_date)}`}
                </Text>

                            <Text style={styles.transactionDescription}>Description: {item.description}</Text>
                            <View style={styles.row}>
                                <Progress.Bar
                                    progress={(item.amount_spent / item.budget_amount)}
                                    width={null}
                                    height={10}
                                    color="#49D469"
                                    borderRadius={5}
                                    style={{ flex: 1, marginRight: 10 }}
                                />
                                <Text>{Math.round(item.amount_spent/item.budget_amount*100)}%</Text>
                            </View>
                        </View>
                    </View>
                )}
            />
            <TouchableOpacity
                style={styles.transparentButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.transparentButtonText}>Add New Budget</Text>
            </TouchableOpacity>


            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.welcomeText}>Add a New Budget</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter description"
                            placeholderTextColor="grey"
                            textAlign="center"
                            value={description}
                            onChangeText={setDescription}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter budget"
                            keyboardType="numeric"
                            placeholderTextColor="grey"
                            textAlign="center"
                            value={budgetAmount}
                            onChangeText={setBudgetAmount}
                        />
                        <View style={styles.datetimepicker}>
                            <DateTimePicker
                                value={startDate}
                                mode="date"
                                display="default"
                                onChange={onStartDateChange}
                            />
                            <DateTimePicker
                                value={endDate}
                                mode="date"
                                display="default"
                                onChange={onEndDateChange}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={addBudget}
                        >
                            <Text style={styles.buttonText}>Save Budget</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.transparentButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.transparentButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default BudgetPage;
