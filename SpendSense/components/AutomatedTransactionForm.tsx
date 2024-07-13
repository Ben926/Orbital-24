import React, { useState, useEffect } from 'react';
import { View, TextInput, Alert, Platform, Text, TouchableOpacity, FlatList, Pressable } from 'react-native';
import supabase from '@/supabase/supabase';
import styles from '../styles/styles';
import { useUser } from '@/contexts/UserContext';
import { getSingaporeDate } from "@/utils/getSingaporeDate";
import { useFetchCategories } from '@/utils/useFetchCategories';
import ModalSelector from 'react-native-modal-selector';

type Category = {
    id: string;
    user_id: string;
    name: string;
    log: string;
    outflow: boolean;
    color: string;
};

const AutomatedTransactionForm = () => {
    const { userID, setRefreshUserData } = useUser();
    const { categories } = useFetchCategories();
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [frequency, setFrequency] = useState<string>('Daily');
    const [dayOfWeek, setDayOfWeek] = useState<string>('Monday');
    const [dayOfMonth, setDayOfMonth] = useState<number>(1);
    const daysOfMonth = Array.from({ length: 28 }, (_, i) => ({ key: i + 1, label: `${i + 1}` }));
    const daysOfWeek = [
        { key: 1, label: 'Monday' },
        { key: 2, label: 'Tuesday' },
        { key: 3, label: 'Wednesday' },
        { key: 4, label: 'Thursday' },
        { key: 5, label: 'Friday' },
        { key: 6, label: 'Saturday' },
        { key: 0, label: 'Sunday' },
    ];
    const getKeyFromLabel = (label: string) => {
        const day = daysOfWeek.find((day) => day.label === label);
        return day ? day.key : 0;
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
                const currentDay = today.getDay();
                let daysUntilNextExecution = getKeyFromLabel(dayOfWeek) - currentDay;
                if (daysUntilNextExecution <= 0) {
                    daysUntilNextExecution += 7; // Ensure the next execution day is in the future
                }
                nextExecutionDate.setDate(today.getDate() + daysUntilNextExecution);
                nextExecutionDate.setHours(0, 0, 0, 0); // Set to start of the day
                nextExecutionDate = getSingaporeDate(nextExecutionDate);
                break;
            case 'Monthly':
                if (dayOfMonth <= today.getDate()) {
                    nextExecutionDate = new Date(today.getFullYear(), today.getMonth() + 1, dayOfMonth); // Set to the ${dayOfMonth} of the next month
                } else {
                    nextExecutionDate = new Date(today.getFullYear(), today.getMonth(), dayOfMonth);
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
                day: frequency == "Daily" ? -1 : (frequency == "Weekly" ? getKeyFromLabel(dayOfWeek) : dayOfMonth),
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
            {frequency === 'Weekly' && (
                <>
                    <ModalSelector
                        data={daysOfWeek}
                        initValue={dayOfWeek}
                        onChange={(option) => setDayOfWeek(option.label)}
                        style={styles.monthButton}
                    >
                        <TextInput
                            style={styles.buttonText}
                            editable={false}
                            placeholder="Select Day"
                            value={dayOfWeek}
                        />
                    </ModalSelector>
                </>
            )}
            {frequency === 'Monthly' && (
                <>
                    <ModalSelector
                        data={daysOfMonth}
                        initValue={`${dayOfMonth}`}
                        onChange={(option) => setDayOfMonth(option.key)}
                        style={styles.monthButton}
                    >
                        <TextInput
                            style={styles.buttonText}
                            editable={false}
                            placeholder="Select Day"
                            value={`${dayOfMonth}`}
                        />
                    </ModalSelector>
                </>
            )}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Automate!</Text>
            </TouchableOpacity>
        </View >
    );
};

export default AutomatedTransactionForm;