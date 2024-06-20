import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from '@/styles/styles';

import supabase from '@/supabase/supabase';

type Goal = {
    id: string;
    goal_name: string;
    target_amount: string;
    current_amount: string;
    start_date: string;
    description: string;
};

interface GoalsProps {
    userID: string;
}

const GoalPage: React.FC<GoalsProps> = ({ userID }) => {
    const getSingaporeDate = (date = new Date()) => {
        const offsetDate = new Date(date);
        offsetDate.setHours(offsetDate.getHours());
        return offsetDate;
      };
    const [goals, setGoals] = useState<Goal[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newGoal, setNewGoal] = useState('');
    const [budgetAmount, setBudgetAmount] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        fetchGoals();
    }, []);
    

    const fetchGoals = async () => {
        const { data, error } = await supabase
            .from(`spending_goals_${userID.replace(/-/g, '')}`)
            .select('*');
        if (error) {
            console.error(error);
        } else {
            setGoals(data as Goal[]);
        }
    };
    const calculateCurrentAmount = async (startDate: Date) => {
        const { data: incomeData, error: incomeError } = await supabase
            .from(`raw_records_${userID.replace(/-/g, '')}`)
            .select('amount')
            .gt('amount', '0')
            .gte('timestamp', startDate);

        const { data: expenseData, error: expenseError } = await supabase
            .from(`raw_records_${userID.replace(/-/g, '')}`)
            .select('amount')
            .lt('amount', '0')
            .gte('timestamp', startDate);

        if (incomeError || expenseError) {
            console.error(incomeError || expenseError);
            return 0;
        }

        const totalIncome = incomeData.reduce((sum, transaction) => sum + transaction.amount, 0);
        const totalExpenses = expenseData.reduce((sum, transaction) => sum + transaction.amount, 0);

        return totalIncome + totalExpenses;
    };

    const addGoal = async () => {
        
        

        if (newGoal.trim() && budgetAmount.trim() && description.trim()) {
            const currentAmount = await calculateCurrentAmount(getSingaporeDate());
            const { data, error } = await supabase
                .from(`spending_goals_${userID.replace(/-/g, '')}`)
                .insert([
                    {
                        goal_name: newGoal,
                        target_amount: parseFloat(budgetAmount),
                        current_amount: currentAmount,
                        start_date: getSingaporeDate(),
                        description: description
                    },
                ])
                .select();
                

            if (error) {
                console.error(error);
            } else {
                Alert.alert('Success', 'Goal created successfully!');
                setGoals([...goals, ...data]);
                setNewGoal('');
                setBudgetAmount('');
                setDescription('');
                setModalVisible(false);
            }
        }
    };

    return (
        <SafeAreaView style={styles.indexContainer}>
            <FlatList
                data={goals}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.transactionItem}>
                        <Text style={styles.transactionDescription}>{item.goal_name}</Text>
                        <Text style={styles.transactionAmount}>Target Amount: ${item.target_amount}</Text>
                        <Text style={styles.transactionAmount}>Current Amount: ${item.current_amount}</Text>
                        <Text style={styles.transactionDate}>Start Date: {item.start_date}</Text>
                        <Text style={styles.transactionDescription}>Description: {item.description}</Text>
                    </View>
                )}
            />
            <TouchableOpacity
                style={styles.transparentButton}
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
                            placeholder="Enter your goal"
                            placeholderTextColor="grey"
                            textAlign="center"
                            value={newGoal}
                            onChangeText={setNewGoal}
                        />
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
                            placeholder="Enter target amount"
                            keyboardType="numeric"
                            placeholderTextColor="grey"
                            textAlign="center"
                            value={budgetAmount}
                            onChangeText={setBudgetAmount}
                        />
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
        </SafeAreaView>
    );
};

export default GoalPage;
