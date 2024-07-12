import React, { useState, useEffect } from 'react';
import { Modal, View, TextInput, Alert, Platform, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import supabase from '@/supabase/supabase';
import styles from '../styles/styles.js';
import { useUser } from '@/contexts/UserContext';

type Goal = {
    id: string;
    goal_name: string;
    target_amount: number;
    current_amount: number;
    start_date: string;
    description: string;
};

type Budget = {
    id: string;
    budget_amount: number;
    amount_spent: number;
    start_date: string;
    end_date: string;
    description: string;
};

type Category = {
    id: string;
    user_id: string;
    name: string;
    log: string;
    outflow: boolean;
    color: string;
};

const AutomatedTransactionForm = () => {
    const getSingaporeDate = (date = new Date()) => {
        const offsetDate = new Date(date);
        offsetDate.setHours(offsetDate.getHours() + 8);
        return offsetDate;
    };
    const { userID, refreshUserData, setRefreshUserData } = useUser();
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [frequency, setFrequency] = useState<string>('');

    useEffect(() => {
        const fetchCategories = async () => {
            let { data, error } = await supabase
                .from('categories')
                .select('*')
                .eq('user_id', userID);
            if (error) {
                console.error('Error fetching categories:', error);
                setCategories([]);
            } else if (data) {
                setCategories(data as Category[]);
            }
        };
        fetchCategories();
    }, []);

    const fetchGoals = async () => {
        const { data, error } = await supabase
            .from(`spending_goals`)
            .select('*')
            .eq('user_id', userID);
        if (error) {
            console.error('Error fetching goals:', error);
            return [];
        }
        return data as Goal[];
    };

    const fetchBudgets = async () => {
        const { data, error } = await supabase
            .from(`budget_plan`)
            .select('*')
            .eq('user_id', userID);
        if (error) {
            console.error("Error fetching budgets:", error);
            return [];
        }
        return data as Budget[];
    };

    const updateGoalAmounts = async (amount: number, transactionDate: Date) => {
        const goals = await fetchGoals();

        for (const goal of goals) {
            if (getSingaporeDate(new Date(goal.start_date)) <= transactionDate) {
                goal.current_amount += amount;

                const { error } = await supabase
                    .from(`spending_goals`)
                    .update({ current_amount: goal.current_amount })
                    .eq('id', goal.id)
                    .eq('user_id', userID);

                if (error) {
                    console.error('Error updating goal amount:', error);
                }
            }
        }
    };

    const updateBudgets = async (amount: number, transactionDate: Date) => {
        if (amount > 0) {
            return;
        }
        const budgets = await fetchBudgets();

        for (const budget of budgets) {
            if (getSingaporeDate(new Date(budget.start_date)) <= transactionDate
                && getSingaporeDate(new Date(budget.end_date)) > transactionDate) {
                budget.amount_spent -= amount;

                const { error } = await supabase
                    .from(`budget_plan`)
                    .update({ amount_spent: budget.amount_spent })
                    .eq('id', budget.id)
                    .eq('user_id', userID);

                if (error) {
                    console.error('Error updating budgets:', error);
                }
            }
        }
    };

    const handleSubmit = async () => {
        if (!amount || !selectedCategoryName || !selectedCategory) {
            Alert.alert("Please select category and input a non-zero amount!");
        } else if (isNaN(parseFloat(amount))) {
            Alert.alert('Key in a valid amount')
        } else if (parseFloat(amount) == 0) {
            Alert.alert('Amount cannot be zero!')
        } else {
            const transactionAmount = selectedCategory.outflow ? -parseFloat(amount) : parseFloat(amount);

            const transaction = {
                user_id: userID,
                amount: transactionAmount,
                category: selectedCategoryName,
                log: getSingaporeDate(),
                description,
                frequency,
                color: selectedCategory.color
            };
            try {
                const { error } = await supabase
                    .from(`raw_records`)
                    .insert([transaction])
                    .select();
                if (error) {
                    console.error('Error creating transaction:', error);
                } else {
                    Alert.alert('Success', 'Transaction created successfully!');
                    await updateGoalAmounts(transactionAmount, transaction.timestamp);
                    await updateBudgets(transactionAmount, transaction.timestamp);
                    setRefreshUserData(true);
                    setSelectedCategory(null);
                    setSelectedCategoryName('');
                    setAmount('');
                    setDescription('');
                }
            } catch (err) {
                console.error('Unexpected error creating transaction:', err);
            }
        }
    };

    const renderCategory = ({ item }: { item: Category }) => (
        <TouchableOpacity
            style={[styles.categorySquare, selectedCategoryName === item.name && styles.selectedCategory]}
            onPress={() => { setSelectedCategoryName(item.name); setSelectedCategory(item); }}
        >
            <Text style={styles.categoryText}>{item.name}</Text>
            {selectedCategoryName === item.name && (
                <Text style={styles.signText}>
                    {item.outflow ? "-" : '+'}
                </Text>
            )}
        </TouchableOpacity>
    );


    return (
        <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>Create Automated Transaction</Text>
            <View style={styles.categoryGridContainer}>
                <FlatList
                    data={[...categories]}
                    renderItem={({ item }) => renderCategory({ item })}
                    keyExtractor={(item) => item.id}
                    numColumns={3}
                    contentContainerStyle={styles.flatList}
                    showsVerticalScrollIndicator={false}
                />
            </View>
            <TextInput
                style={styles.input}
                placeholder="Amount"
                placeholderTextColor="grey"
                textAlign="center"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
            />
            <TextInput
                style={styles.input}
                placeholder="Description (optional)"
                placeholderTextColor="grey"
                textAlign="center"
                value={description}
                onChangeText={setDescription}
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Automate!</Text>
            </TouchableOpacity>
        </View >
    );
};

export default AutomatedTransactionForm;