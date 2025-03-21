import React, { useState } from 'react';
import { Modal, View, TextInput, Alert, Platform, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import supabase from '@/supabase/supabase';
import styles from '../styles/styles.js';
import { useUser } from '@/contexts/UserContext';
import { getSingaporeDate } from "@/utils/getSingaporeDate";
import { useFetchBudgets } from '@/utils/useFetchBudgets';
import { useFetchGoals } from '@/utils/useFetchGoals';
import { useFetchCategories } from '@/utils/useFetchCategories';

type Category = {
  id: string;
  user_id: string;
  name: string;
  log: string;
  outflow: boolean;
  color: string;
};

const CreateTransactionForm = () => {
  const { updateBudgets, setRefreshUserData } = useFetchBudgets();
  const { updateGoalAmounts } = useFetchGoals();
  const { userID } = useUser();
  const { categories } = useFetchCategories();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [showDateTimePicker, setShowDateTimePicker] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<string>('');
  const [isNewCategoryOutflow, setIsNewCategoryOutflow] = useState<boolean>(true);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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
        timestamp: showDateTimePicker ? getSingaporeDate(date) : getSingaporeDate(),
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
    setDate(currentDate);
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || date;
    setDate(currentTime);
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

  const renderEditCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[styles.categorySquare, selectedCategoryName === item.name && styles.selectedCategory]}
      onPress={() => {
        setEditingCategory(item);
        setSelectedCategoryName(item.name)
        setSelectedCategory(item)
      }}
    >
      <Text style={styles.categoryText}>{item.name}</Text>
      {selectedCategoryName === item.name && (
        <Text>
          {item.outflow ? "-" : '+'}
        </Text>
      )}

    </TouchableOpacity>
  );

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      Alert.alert('Please enter a category name');
      return;
    }
    let { data: existingCategory, error: fetchError } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userID)
      .eq('name', newCategory)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking category:', fetchError);
      Alert.alert('Error', 'Error checking category');
      return;
    }

    if (existingCategory) {
      Alert.alert('Error', 'Category already exists');
      return;
    }

    try {
      const { error } = await supabase
        .from('categories')
        .insert([{ user_id: userID, name: newCategory, log: getSingaporeDate(), outflow: isNewCategoryOutflow, color: getRandomColor() }])
        .select();
      if (error) {
        console.error('Error adding category:', error);
      } else {
        setRefreshUserData(true);
        setNewCategory('');
        setModalVisible(false);
      }
    } catch (err) {
      console.error('Unexpected error adding category:', err);
    }
  };

  const handleEditCategory = async (category: Category) => {
    if (!newCategoryName.trim()) {
      Alert.alert('Please enter a new category name');
      return;
    }
    let { data: existingCategory, error: fetchError } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userID)
      .eq('name', newCategoryName)
      .single();
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking category:', fetchError);
      Alert.alert('Error', 'Error checking category');
      return;
    }

    if (existingCategory) {
      Alert.alert('Error', 'Category already exists');
      return;
    }

    try {
      const { error: error_raw_records_table } = await supabase
        .from(`raw_records`)
        .update({ category: newCategoryName })
        .eq('category', category.name)
        .eq('user_id', userID)

      const { error: error_categories_table } = await supabase
        .from('categories')
        .update({ name: newCategoryName })
        .eq('id', category.id);

      if (error_raw_records_table || error_categories_table) {
        console.error('Error updating category');
      } else {
        Alert.alert('Category updated successfully');
        setRefreshUserData(true);
        setEditingCategory(null);
        setNewCategoryName('');
      }
    } catch (err) {
      console.error('Unexpected error updating category:', err);
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    let { data } = await supabase
      .from(`raw_records`)
      .select('*')
      .eq('category', category.name)
      .eq('user_id', userID)

    const records_with_category = data || [];

    if (records_with_category.length != 0) {
      Alert.alert("Cannot delete category as there are existing records!")
      return;
    }

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', category.id);
      if (error) {
        console.error('Error deleting category:', error);
      } else {
        Alert.alert('Category deleted successfully');
        setRefreshUserData(true);
        setEditingCategory(null);
      }
    } catch (err) {
      console.error('Unexpected error deleting category:', err);
    }
  };

  return (
    <View style={styles.formContainer}>
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
        placeholder="Description (optional)"
        placeholderTextColor="grey"
        textAlign="center"
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity style={styles.button}
        onPress={() => {
          setEditModalVisible(true);
          setSelectedCategory(null); setSelectedCategoryName("")
        }}>
        <Text style={styles.buttonText}>Edit Categories</Text>
      </TouchableOpacity>
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
            <TouchableOpacity style={styles.button} onPress={() => setIsNewCategoryOutflow(!isNewCategoryOutflow)}>
              <Text style={styles.buttonText}>{isNewCategoryOutflow ? "Outflow" : "Inflow"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleAddCategory}>
              <Text style={styles.buttonText}>Add Category</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(!editModalVisible)}
      >
        <View style={styles.editContainer}>
          <Text style={styles.welcomeText}>Edit Category</Text>
          <View style={styles.categoryGridContainer}>
            <FlatList
              data={categories}
              renderItem={({ item }) => renderEditCategory({ item })}
              keyExtractor={(item) => item.id}
              numColumns={3}
              contentContainerStyle={styles.flatList}
              showsVerticalScrollIndicator={false}
            />
          </View>
          {editingCategory && (
            <View>
              <TextInput
                style={styles.input}
                placeholder="New Category Name"
                placeholderTextColor="grey"
                textAlign="center"
                value={newCategoryName}
                onChangeText={setNewCategoryName}
              />
              <TouchableOpacity style={styles.button} onPress={() => handleEditCategory(editingCategory)}>
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleDeleteCategory(editingCategory)}>
                <Text style={styles.buttonText}>Delete Category</Text>
              </TouchableOpacity>

            </View>
          )}
          <Pressable style={styles.transparentButton} onPress={() => setEditModalVisible(false)}>
            <Text style={styles.transparentButtonText}>Close</Text>
          </Pressable>
        </View>
      </Modal>

    </View>
  );
};

export default CreateTransactionForm;