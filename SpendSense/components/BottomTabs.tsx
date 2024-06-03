// components/BottomTabs.js
import React from 'react';
import { View, Button, StyleSheet, Pressable, Text } from 'react-native';
import { router } from 'expo-router';
import { useLocalSearchParams } from "expo-router";
import  styles from '../styles/styles';
import { Ionicons } from '@expo/vector-icons';

export default function BottomTabs() {
    const {userID} = useLocalSearchParams();
    const handleHome = () => {router.replace(`${userID}`)}
    
  return (
    <View style={styles.tabsContainer}>
      <Pressable style={styles.transparentButton} onPress={handleHome}>
        <Ionicons name="swap-horizontal" size={24} color="black" />
      </Pressable>
      <Pressable style={styles.transparentButton} onPress={handleHome}>
        <Ionicons name="pause" size={24} color="black" />
      </Pressable>
      {/* <Link href="/profile" style={styles.button}>
        <Button title="Profile" />
      </Link>
      <Link href="/settings" style={styles.button}>
        <Button title="Settings" />
      </Link>
      <Link href="/notifications" style={styles.button}>
        <Button title="Notifications" />
      </Link>
      <Link href="/more" style={styles.button}>
        <Button title="More" />
      </Link> */}
    </View>
  );
}

const styless = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    padding: 10,
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
});
