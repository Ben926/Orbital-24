import { Text, TextInput, View, Alert, Pressable, Image } from "react-native";
import { useState } from "react";
import supabase from "../supabase/supabase";
import { router } from "expo-router";
import styles from '../styles/styles';
import { SafeAreaView } from "react-native-safe-area-context";
import { getSingaporeDate } from "@/utils/getSingaporeDate";

const logoImg = require("../assets/images/spendsense-logo.png");

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Signup Error", "Passwords do not match");
      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      Alert.alert("Signup Error", error.message);
    } else {
      const userID = data.user.id;
      const defaultCategories = [
        { name: 'Food', color: '#FF6347' },         
        { name: 'Transport', color: '#FFD700' },    
        { name: 'Shopping', color: '#1E90FF' },     
        { name: 'Entertainment', color: '#32CD32' },
        { name: 'Medical', color: '#FF69B4' },      
        { name: 'Housing', color: '#8A2BE2' },      
        { name: 'Income', color: '#00FF7F' }   
      ];

      const { error: categoryError } = await supabase
        .from('categories')
        .insert(defaultCategories.map(category => ({
          user_id: userID,
          log: getSingaporeDate(),
          name: category.name,
          color: category.color,
          outflow: category.name == "Income" ? false : true 
        })));

      if (categoryError) {
        Alert.alert("Error", categoryError.message);
      }
      
      Alert.alert("Success!", "Account created successfully.")
    }
  };

  return (
    <SafeAreaView style={styles.loginContainer}>
      <View style={styles.logoContainer}>
        <Image source={logoImg} style={styles.logo} />
      </View>
      <TextInput
        textAlign="center"
        placeholderTextColor="black"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        textAlign="center"
        placeholderTextColor="black"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        textAlign="center"
        placeholderTextColor="black"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        secureTextEntry
      />
      <Pressable style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>
      <Pressable style={styles.transparentButton} onPress={() => router.back()}>
        <Text style={styles.transparentButtonText}>Back</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default SignUpForm;
