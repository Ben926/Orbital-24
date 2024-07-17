import React, { useState } from 'react';
import { FlatList, Text, View, TouchableOpacity, Modal, Pressable, ActivityIndicator } from 'react-native';
import styles from '@/styles/styles';
import supabase from '@/supabase/supabase';
import { useUser } from '@/contexts/UserContext';
import AutomatedTransactionForm from './AutomatedTransactionForm';
import { useFetchAutomatedTransactions } from '@/utils/useFetchAutomatedTransactions';

const AutomatedTransactionsPage = () => {
    const { userID, setRefreshUserData } = useUser();
    const { automatedTransactions, updateAutomatedTransactions } = useFetchAutomatedTransactions();
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleUpdateAutomatedTransactions = async () => {
        setLoading(true);
        try {
            await updateAutomatedTransactions();
        } catch (error) {
            console.error('Error updating automated transactions', error);
        } finally {
            setLoading(false);
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
                setRefreshUserData(true);
            }
        } catch (error) {
            console.error('Error deleting transaction', error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        };
        return date.toLocaleDateString('en-US', options);
    };


    return (<View style={styles.transactionContainer}>
        <FlatList
            data={automatedTransactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.transactionItem}>
                    <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
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
                        <View style={styles.transactionDetails}>
                            <Text style={styles.transactionCategory}>{item.category}</Text>


                        </View>
                        <Text style={styles.transactionTimestamp}>
                            Next Transaction Date: {formatDate(item.next_execution_date)} ({item.frequency})
                        </Text>
                        <View style={styles.transactionFooter}>
                            <Text style={styles.transactionAmount}>{item.amount < 0 ? `-$${Math.abs(item.amount)}` : `+$${item.amount}`}</Text>
                        </View>
                    </View>
                </View>
            )}
        />
        <TouchableOpacity style={styles.button} onPress={handleUpdateAutomatedTransactions} disabled={loading}>
            <Text style={styles.buttonText}>Update Automations!</Text>
        </TouchableOpacity>
        {loading && <View>
            <ActivityIndicator size="large" color="#008000" />
        </View>}
        <Pressable style={styles.transparentButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.transparentButtonText}>Create New Automation</Text>
        </Pressable>

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
