import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, Platform, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import supabase from '@/supabase/supabase';
import styles from '../styles/styles.js'; // Adjust the import path as necessary

type Category = {
  id: string;
  user_id: string;
  created_at: string;
  name: string;
};

const CreateTransactionForm = ({userID}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
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
      
    };
    console.log(`raw_records_${userID.replace(/-/g, '')}`);
    try {
      const { data, error } = await supabase
        .from(`raw_records_${userID.replace(/-/g, '')}`)
        .insert([transaction])
        .select()
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
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.welcomeText}>Create Transaction</Text>
      <View style={styles.loginPasswordContainer}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        >
          <Picker.Item label="Select a category" value="" />
          {categories
          .filter(cat => cat.user_id === userID)
          .map((cat) => (
            <Picker.Item key={cat.id} label={cat.name} value={cat.name} />
          ))}
        </Picker>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity style={styles.button} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.buttonText}>Select Date</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateTransactionForm;
