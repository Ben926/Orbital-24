import React, { useState, useEffect } from 'react';
import { Modal, View, TextInput, Alert, Platform, Text, TouchableOpacity, FlatList, Pressable } from 'react-native';
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
    const [frequency, setFrequency] = useState<string>('Daily');

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

    const getNextExecutionDate = () => {
        const today = new Date();
        let nextExecutionDate = new Date(today);
        switch (frequency) {
            case 'Daily':
                nextExecutionDate.setDate(today.getDate() + 1);
                nextExecutionDate.setHours(0, 0, 0, 0);
                nextExecutionDate = getSingaporeDate(nextExecutionDate);
                break;
            case 'Weekly':
                const daysUntilNextWeek = 7 - today.getDay(); // Days remaining in the current week
                nextExecutionDate.setDate(today.getDate() + daysUntilNextWeek); // Move to the next week's start
                nextExecutionDate.setHours(0, 0, 0, 0); // Set to start of the day
                nextExecutionDate = getSingaporeDate(nextExecutionDate);
                break;
            case 'Monthly':
                if (today.getMonth() === 11) { // If it's December
                    nextExecutionDate = new Date(today.getFullYear() + 1, 0, 1); // Set to January 1st of the next year
                } else {
                    nextExecutionDate = new Date(today.getFullYear(), today.getMonth() + 1, 1); // Set to the 1st of the next month
                }
                nextExecutionDate.setHours(0, 0, 0, 0);
                nextExecutionDate = getSingaporeDate(nextExecutionDate);
                break;
        }
        return nextExecutionDate;
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
            const automatedTransaction = {
                user_id: userID,
                amount: transactionAmount,
                category: selectedCategoryName,
                log: getSingaporeDate(),
                description,
                frequency,
                next_execution_date: getNextExecutionDate(),
                color: selectedCategory.color
            };
            try {
                const { error } = await supabase
                    .from(`automated_transactions`)
                    .insert([automatedTransaction])
                    .select();
                if (error) {
                    console.error('Error creating automation:', error);
                } else {
                    Alert.alert('Success', 'Automation created successfully!');
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
                <Text>
                    {item.outflow ? "-" : '+'}
                </Text>
            )}
        </TouchableOpacity>
    );


    return (
        <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>Automate New Transaction</Text>
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
            <View style={styles.buttonGroup}>
                <Pressable style={[styles.timeUnselectButton, frequency == 'Daily' && styles.timeButton]} onPress={() => setFrequency('Daily')}>
                    <Text style={styles.buttonText}>Daily</Text>
                </Pressable>
                <Pressable style={[styles.timeUnselectButton, frequency == 'Weekly' && styles.timeButton]} onPress={() => setFrequency('Weekly')}>
                    <Text style={styles.buttonText}>Weekly</Text>
                </Pressable>
                <Pressable style={[styles.timeUnselectButton, frequency == 'Monthly' && styles.timeButton]} onPress={() => setFrequency('Monthly')}>
                    <Text style={styles.buttonText}>Monthly</Text>
                </Pressable>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Automate!</Text>
            </TouchableOpacity>
        </View >
    );
};

export default AutomatedTransactionForm;