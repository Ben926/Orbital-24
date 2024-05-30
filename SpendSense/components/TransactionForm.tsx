import React, { useState, useEffect } from 'react';
import { ScrollView, View, TextInput, Alert, Platform, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import supabase from '@/supabase/supabase';
import styles from '../styles/styles.js';

type Category = {
  id: string;
  user_id: string;
  created_at: string;
  name: string;
};

const CreateTransactionForm = ({ userID }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<Date>(() => {
    const initialDate = new Date();
    initialDate.setHours(initialDate.getHours() + 8);
    return initialDate;
  });
  const [showDateTimePicker, setShowDateTimePicker] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      let { data, error } = await supabase
        .from('categories')
        .select('*');
      if (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } else if (data) {
        setCategories(data as Category[]);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    const isIncome = selectedCategory === 'Income';
    const transaction = {
      amount: isIncome ? parseFloat(amount) : -parseFloat(amount),
      category: selectedCategory,
      description,
      timestamp: date
    };
    if (!amount || !selectedCategory || !description) {
      Alert.alert("Please fill up all fields!");
    } else {
      try {
        const { data, error } = await supabase
          .from(`raw_records_${userID.replace(/-/g, '')}`)
          .insert([transaction])
          .select();
        if (error) {
          console.error('Error creating transaction:', error);
        } else {
          Alert.alert('Success', 'Transaction created successfully!');
          setSelectedCategory('');
          setAmount('');
          setDescription('');
          setDate(new Date());
        }
      } catch (err) {
        console.error('Unexpected error creating transaction:', err);
      }
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDateTimePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || date;
    setShowDateTimePicker(Platform.OS === 'ios');
    setDate(currentTime);
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[styles.categorySquare, selectedCategory === item.name && styles.selectedCategory]}
      onPress={() => setSelectedCategory(item.name)}
    >
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView>
      <View style={styles.loginContainer}>
        <Text style={styles.welcomeText}>Create Transaction</Text>
        <View style={styles.categoryGridContainer}>
          <FlatList
            data={categories.filter(cat => cat.user_id === userID)}
            renderItem={renderCategory}
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
          placeholder="Description"
          placeholderTextColor="grey"
          textAlign="center"
          value={description}
          onChangeText={setDescription}
        />
        <TouchableOpacity style={styles.button} onPress={() => setShowDateTimePicker(!showDateTimePicker)}>
          <Text style={styles.buttonText}>Backdate Transaction</Text>
        </TouchableOpacity>
        <View style={styles.datetimepicker}>
          {showDateTimePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
          {showDateTimePicker && (
            <DateTimePicker
              value={date}
              mode="time"
              display="default"
              onChange={onTimeChange}
            />
          )}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CreateTransactionForm;