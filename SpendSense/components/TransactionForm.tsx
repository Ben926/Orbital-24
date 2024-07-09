import React, { useState, useEffect } from 'react';
import { Modal, View, TextInput, Alert, Platform, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import supabase from '@/supabase/supabase';
import styles from '../styles/styles.js';

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

const CreateTransactionForm = ({ userID }) => {
  const getSingaporeDate = (date = new Date()) => {
    const offsetDate = new Date(date);
    offsetDate.setHours(offsetDate.getHours() + 8);
    return offsetDate;
  };
  const [categories, setCategories] = useState<Category[]>([]);
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
      .from(`spending_goals_${userID.replace(/-/g, '')}`)
      .select('*');
    if (error) {
      console.error('Error fetching goals:', error);
      return [];
    }
    return data as Goal[];
  };

  const fetchBudgets = async () => {
    const { data, error } = await supabase
      .from(`budget_plan_${userID.replace(/-/g, '')}`)
      .select('*');
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
          .from(`spending_goals_${userID.replace(/-/g, '')}`)
          .update({ current_amount: goal.current_amount })
          .eq('id', goal.id);

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
          .from(`budget_plan_${userID.replace(/-/g, '')}`)
          .update({ amount_spent: budget.amount_spent })
          .eq('id', budget.id);

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
        amount: transactionAmount,
        category: selectedCategoryName,
        log: getSingaporeDate(),
        description,
        timestamp: showDateTimePicker ? getSingaporeDate(date) : getSingaporeDate(),
        color: selectedCategory.color
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
          await updateGoalAmounts(transactionAmount, transaction.timestamp);
          await updateBudgets(transactionAmount, transaction.timestamp);
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
        <Text style={styles.signText}>
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
      if (existingCategory.name === 'KSI') {
        Alert.alert('Error', 'There can never be 2 KSIs.');
      } else {
        Alert.alert('Error', 'Category already exists');
      }
      return;
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ user_id: userID, name: newCategory, log: getSingaporeDate(), outflow: isNewCategoryOutflow, color: getRandomColor() }])
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
      if (existingCategory.name === 'KSI') {
        Alert.alert('Error', 'There can never be 2 KSIs.');
      } else {
        Alert.alert('Error', 'Category already exists');
      }
      return;
    }

    try {
      const { error: error_raw_records_table } = await supabase
        .from(`raw_records_${userID.replace(/-/g, '')}`)
        .update({ category: newCategoryName })
        .eq('category', category.name)

      const { error: error_categories_table } = await supabase
        .from('categories')
        .update({ name: newCategoryName })
        .eq('id', category.id);


      if (error_raw_records_table || error_categories_table) {
        console.error('Error updating category');
      } else {
        setCategories(categories.map(cat => cat.id === category.id ? { ...cat, name: newCategoryName } : cat));
        setEditingCategory(null);
        setNewCategoryName('');
        Alert.alert('Category updated successfully');
      }
    } catch (err) {
      console.error('Unexpected error updating category:', err);
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    let { data } = await supabase
      .from(`raw_records_${userID.replace(/-/g, '')}`)
      .select('*')
      .eq('category', category.name)

    const records_with_category = data || [];

    if (records_with_category.length != 0) {
      Alert.alert("Cannot delete category as there are exsiting records!")
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
        setCategories(categories.filter(cat => cat.id !== category.id));
        setEditingCategory(null);
        Alert.alert('Category deleted successfully');
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
        placeholder="Description"
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