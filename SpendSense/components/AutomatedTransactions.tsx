import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, TouchableOpacity, Modal, TextInput, Alert, Pressable } from 'react-native';
import styles from '@/styles/styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import supabase from '@/supabase/supabase';
import { useUser } from '@/contexts/UserContext';
import AutomatedTransactionForm from './AutomatedTransactionForm';

type AutomatedTransaction = {
    id: string;
    user_id: string;
    amount: number;
    description: string;
    category: string;
    color: string;
    log: string;
    frequency: string;
    next_execution_date: string;
};

type Category = {
    id: string;
    user_id: string;
    name: string;
    log: string;
    outflow: boolean;
    color: string;
};

const AutomatedTransactionsPage = () => {
    const { userID, refreshUserData, setRefreshUserData } = useUser();
    const [transactions, setTransactions] = useState<AutomatedTransaction[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchAutomatedTransactions();
    }, [refreshUserData]);


    const fetchAutomatedTransactions = async () => {
        const { data, error } = await supabase
            .from('automated_transactions')
            .select('*')
            .eq('user_id', userID);
        if (error) {
            console.error(error);
        } else {
            setTransactions(data as AutomatedTransaction[]);
            setRefreshUserData(false);
        }
    };

    const deleteAutomatedTransaction = async (transactionID: string) => {
        try {
            const { error } = await supabase
                .from('automated_transactions')
                .delete()
                .eq('id', transactionID)
                .eq('user_id', userID);

            if (error) {
                console.error('Error deleting transaction', error);
            } else {
                setTransactions((prevTransactions) =>
                    prevTransactions.filter((transaction) => transaction.id !== transactionID)
                );
            }
        } catch (error) {
            console.error('Error deleting transaction', error);
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


    return (<View style={styles.transactionContainer}>
        <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.transactionItem}>
                    <View style={styles.transactionContent}>
                        <View style={styles.transactionHeader}>
                            <Text style={styles.transactionDescription}>{item.description}</Text>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => deleteAutomatedTransaction(item.id)}
                            >
                                <Text style={styles.deleteButtonText}>x</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.transactionAmount}>${item.amount}</Text>
                        <Text style={styles.transactionTimestamp}>
                            Next Execution: {formatDate(item.next_execution_date)}
                        </Text>
                        <Text style={styles.transactionTimestamp}>
                            Frequency: {item.frequency}
                        </Text>
                    </View>
                </View>
            )}
        />
        <TouchableOpacity
            style={styles.createTransactionButton}
            onPress={() => setModalVisible(true)}
        >
            <Text style={styles.transparentButtonText}>Add New Automated Transaction</Text>
        </TouchableOpacity>

        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.transactionFormContainer}>
          <AutomatedTransactionForm />
          <Pressable style={styles.transparentButton} onPress={() => { setModalVisible(false); }}>
            <Text style={styles.transparentButtonText}>Close</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
    );
};

export default AutomatedTransactionsPage;
