import React, { useState, useEffect } from 'react';
import { Modal, View, TextInput, Alert, Platform, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
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
  const getSingaporeDate = (date = new Date()) => {
    const offsetDate = new Date(date);
    offsetDate.setHours(offsetDate.getHours() + 8);
    return offsetDate;
  };
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [showDateTimePicker, setShowDateTimePicker] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<string>('');
  const [isNewCategoryOutflow, setIsNewCategoryOutflow] = useState<boolean>(true);

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

  const handleSubmit = async () => {
    if (!amount || !selectedCategory || !description) {
      Alert.alert("Please fill up all fields!");
    } else {
      let { data: category_record, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userID)
        .eq('name', selectedCategory)
        .single()
      const transaction = {
        amount: category_record.outflow ? -parseFloat(amount) : parseFloat(amount),
        category: selectedCategory,
        description,
        timestamp: showDateTimePicker ? getSingaporeDate(date) : getSingaporeDate()
      };
      try {
        const { error } = await supabase
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
          setShowDateTimePicker(false);
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
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      Alert.alert('Please enter a category name');
      return;
    }
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ user_id: userID, name: newCategory, outflow: isNewCategoryOutflow }])
        .select();
      if (error) {
        console.error('Error adding category:', error);
      } else {
        setCategories([...categories, ...data]);
        setNewCategory('');
        setModalVisible(false);
      }
    } catch (err) {
      console.error('Unexpected error adding category:', err);
    }
  };

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.welcomeText}>Create Transaction</Text>
      <View style={styles.categoryGridContainer}>
        <FlatList
          data={[...categories, { id: 'add-new', user_id: userID, name: 'Add New' }]}
          renderItem={({ item }) => item.id === 'add-new' ? (
            <TouchableOpacity
              style={[styles.categorySquare, styles.addCategorySquare]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.categoryText}>+ Add</Text>
            </TouchableOpacity>
          ) : renderCategory({ item })}
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder="New Category"
              placeholderTextColor="grey"
              textAlign="center"
              value={newCategory}
              onChangeText={setNewCategory}
            />
            {isNewCategoryOutflow && <TouchableOpacity style={styles.button} onPress={() => setIsNewCategoryOutflow(false)}>
              <Text style={styles.buttonText}>Outflow</Text>
            </TouchableOpacity>}
            {!isNewCategoryOutflow && <TouchableOpacity style={styles.button} onPress={() => setIsNewCategoryOutflow(true)}>
              <Text style={styles.buttonText}>Inflow</Text>
            </TouchableOpacity>}
            <TouchableOpacity style={styles.button} onPress={handleAddCategory}>
              <Text style={styles.buttonText}>Add Category</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CreateTransactionForm;