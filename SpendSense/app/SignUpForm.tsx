import { Text, TextInput, View, Alert, Pressable, Image } from "react-native";
import { useState } from "react";
import supabase from "../supabase/supabase";
import { router } from "expo-router";
import styles from '../styles/styles';
import { SafeAreaView } from "react-native-safe-area-context";

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
      const userId = data.user.id;
      const defaultCategories = [
        'Food',
        'Transport',
        'Shopping',
        'Entertainment',
        'Medical',
        'Housing',
        'Income'
      ];

      const { error: tableError } = await supabase
        .rpc('create_user_table', { user_id: userId });

      const { error: categoryError } = await supabase
        .from('categories')
        .insert(defaultCategories.map(category => ({
          user_id: userId,
          name: category
        })));

      if (tableError) {
        Alert.alert("Error", tableError.message);
      }

      if (categoryError) {
        Alert.alert("Error", categoryError.message);
      }
      
      Alert.alert("Success!", "Account created successfully")
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
      <Pressable style={styles.transparentButton} onPress={handleSignup}>
        <Text style={styles.transparentButtonText}>Sign Up</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Back</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default SignUpForm;
