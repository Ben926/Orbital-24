import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, TouchableOpacity, Modal, TextInput, Alert, } from 'react-native';
import * as Progress from 'react-native-progress';
import styles from '@/styles/styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useUser } from '@/contexts/UserContext';
import supabase from '@/supabase/supabase';
import { getSingaporeDate } from "@/utils/getSingaporeDate";
import { useFetchGoals } from '@/utils/useFetchGoals';

const GoalPage = () => {
    const { userID } = useUser();
    const { goals, setRefreshUserData } = useFetchGoals();
    const [modalVisible, setModalVisible] = useState(false);
    const [newGoal, setNewGoal] = useState('');
    const [budgetAmount, setBudgetAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState<Date>(new Date());
    const onDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
    };

    const onTimeChange = (event: any, selectedTime?: Date) => {
        const currentTime = selectedTime || date;
        setDate(currentTime);
    };

    const calculateCurrentAmount = async (startDate: Date) => {
        const formattedStartDate = startDate.toISOString();
        const { data: incomeData, error: incomeError } = await supabase
            .from(`raw_records`)
            .select('amount')
            .eq('user_id', userID)
            .gt('amount', 0)
            .gte('timestamp', formattedStartDate)

        const { data: expenseData, error: expenseError } = await supabase
            .from(`raw_records`)
            .select('amount')
            .eq('user_id', userID)
            .lt('amount', 0)
            .gte('timestamp', formattedStartDate)

        if (incomeError || expenseError) {
            console.error(incomeError || expenseError);
            return 0;
        } else if (incomeData && expenseData) {{
        const totalIncome = incomeData.reduce((sum, transaction) => sum + transaction.amount, 0);
        const totalExpenses = expenseData.reduce((sum, transaction) => sum + transaction.amount, 0);
        return totalIncome + totalExpenses;
        }}
    };

    const addGoal = async () => {
        if (!budgetAmount || !newGoal) {
            Alert.alert('Please fill in the goal and amount!')

        }
        else if (isNaN(parseFloat(budgetAmount))) {
            Alert.alert('Key in a valid amount')

        }
        else if (newGoal.trim() && budgetAmount.trim()) {
            const calculatedCurrentAmount = await calculateCurrentAmount(getSingaporeDate(date));
            const { data, error } = await supabase
                .from(`spending_goals`)
                .insert([
                    {
                        user_id: userID,
                        goal_name: newGoal,
                        log: getSingaporeDate(),
                        target_amount: parseFloat(budgetAmount),
                        current_amount: calculatedCurrentAmount,
                        start_date: getSingaporeDate(date),
                        description: description
                    },
                ])
                .select();


            if (error) {
                console.error(error);
            } else {
                Alert.alert('Success', 'Goal created successfully!');
                setRefreshUserData(true);
                setNewGoal('');
                setBudgetAmount('');
                setDescription('');
                setModalVisible(false);
                setDate(new Date());
            }
        }
    };
    const deleteGoal = async (goalID: string) => {
        try {
            const { error } = await supabase
                .from(`spending_goals`)
                .delete()
                .eq('id', goalID)
                .eq('user_id', userID);

            if (error) {
                console.error('Error deleting goal', error);
            } else {
                setRefreshUserData(true);
            }
        } catch (error) {
            console.error('Error deleting transaction', error);
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

    return (
        <View style={styles.transactionContainer}>
            <FlatList
                data={goals}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.transactionItem}>
                        <View style={styles.transactionContent}>
                            <View style={styles.transactionHeader}>
                                <Text style={styles.transactionDescription}>{item.goal_name}</Text>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => deleteGoal(item.id)}
                                >
                                    <Text style={styles.deleteButtonText}>x</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.transactionAmount}>Target Amount: ${item.target_amount}</Text>
                            <Text style={styles.transactionAmount}>Amount Saved: ${item.current_amount}</Text>
                            <View style={styles.transactionFooter}>
                                <Text style={styles.transactionTimestamp}>Start Date: {formatTimestamp(item.start_date)}</Text>
                            </View>
                            {item.description && <Text style={styles.transactionDescription}>Description: {item.description}</Text>}
                            <View style={styles.row}>
                                <Progress.Bar
                                    progress={(item.current_amount / item.target_amount)}
                                    width={null}
                                    height={10}
                                    color="#49D469"
                                    borderRadius={5}
                                    style={{ flex: 1, marginRight: 10 }}
                                />
                                <Text>{Math.round(Math.min((item.current_amount / item.target_amount) * 100, 100))}%</Text>
                            </View>
                            {Math.round((item.current_amount / item.target_amount) * 100) >= 100 && <Text>Congratulations! 🎉</Text>}
                        </View>
                    </View>
                )}
            />
            <TouchableOpacity
                style={styles.createTransactionButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.transparentButtonText}>Add New Goal</Text>
            </TouchableOpacity>


            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.welcomeText}>Add a New Goal</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Goal"
                            placeholderTextColor="grey"
                            textAlign="center"
                            value={newGoal}
                            onChangeText={setNewGoal}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Description (optional)"
                            placeholderTextColor="grey"
                            textAlign="center"
                            value={description}
                            onChangeText={setDescription}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Target Amount"
                            keyboardType="numeric"
                            placeholderTextColor="grey"
                            textAlign="center"
                            value={budgetAmount}
                            onChangeText={setBudgetAmount}
                        />
                        <View style={styles.datetimepicker}>
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                            />
                            <DateTimePicker
                                value={date}
                                mode="time"
                                display="default"
                                onChange={onTimeChange}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={addGoal}
                        >
                            <Text style={styles.buttonText}>Save Goal</Text>
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
        </View>
    );
};

export default GoalPage;
