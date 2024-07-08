import React, { useState } from "react";
import { Text, TextInput, View, Alert, Pressable, Image, TouchableOpacity } from "react-native";
import supabase from "../supabase/supabase";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons'; 
const logoImg = require("../assets/images/spendsense-logo.png");
import styles from '../styles/styles';
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from '../contexts/UserContext';

const LogInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const { setUserID } = useUser();
  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      Alert.alert("Login Error", error.message);
    } else {
      const userID = data.user.id;
      setUserID(userID);
      Alert.alert("Success", "Logged in successfully");
      router.replace(`Home`);
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address to reset your password.");
      return;
    }

    supabase.auth.resetPasswordForEmail(email)
      .then(() => {
        Alert.alert("Success", "Password reset email sent.");
      })
      .catch(error => {
        Alert.alert("Error", error.message);
      });
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
      <View style={styles.loginPasswordContainer}>
        <TextInput
          textAlign="center"
          placeholderTextColor="black"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.passwordInput}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.toggleButton}>
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Pressable onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </Pressable>
      <Pressable style={styles.transparentButton} onPress={() => router.back()}>
        <Text style={styles.transparentButtonText}>Back</Text>
      </Pressable>
    </SafeAreaView>
  );
};


export default LogInForm;
