// components/BottomTabs.js
import React from 'react';
import { View, Button, StyleSheet, Pressable, Text } from 'react-native';
import { router } from 'expo-router';
import { useLocalSearchParams } from "expo-router";
import  styles from '../styles/styles';
import { Feather, Entypo } from '@expo/vector-icons';

export default function BottomTabs() {
    const {userID} = useLocalSearchParams();
    const handleHome = () => {router.replace(`${userID}`)}
    const handleBudgetPage = () => {router.replace(`BudgetPage/${userID}`)}
    const handleGoalPage = () => {router.replace(`GoalPage/${userID}`)}
    
  return (
    <View style={styles.tabsContainer}>
      <Pressable style={styles.transparentButton} onPress={handleHome}>
        <Entypo name="home" size={24} color="black" />
      </Pressable>
      <Pressable style={styles.transparentButton} onPress={handleBudgetPage}>
        <Feather name="dollar-sign" size={24} color="black" />
      </Pressable>
      <Pressable style={styles.transparentButton} onPress={handleGoalPage}>
        <Feather name="target" size={24} color="black" />
      </Pressable>
    </View>
  );
}