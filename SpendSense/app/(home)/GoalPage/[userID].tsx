import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from '@/styles/styles';
import BottomTabs from '@/components/BottomTabs';
import supabase from '@/supabase/supabase';

type Goal = {
    id: string;
    goal_name: string;
    target_amount: string;
    current_amount: string;
    start_date: string;
  };
const GoalPage = () => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newGoal, setNewGoal] = useState('');
    const [budgetAmount, setBudgetAmount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        const { data, error } = await supabase
            .from('goals')
            .select('*');
        if (error) {
            console.error(error);
        } else {
            setGoals(data as Goal[]);
        }
    };
    

    const addGoal = () => {
        if (newGoal.trim()) {
            setGoals([...goals, { id: Date.now().toString(), name: newGoal }]);
            setNewGoal('');
            setModalVisible(false);
        }
    };

    return (
        <SafeAreaView style={styles.indexContainer}>
            <FlatList
                data={goals}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.transactionItem}>
                        <Text style={styles.transactionDescription}>{item.name}</Text>
                    </View>
                )}
                ListEmptyComponent={() => <Text style={styles.text2}>No goals yet. Add a goal to start saving!</Text>}
            />
            <TouchableOpacity
                style={styles.transparentButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.transparentButtonText}>Add New Goal</Text>
            </TouchableOpacity>
            <BottomTabs />

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
                            value={newGoal}
                            onChangeText={setNewGoal}
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
