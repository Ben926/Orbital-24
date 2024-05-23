import { Text, TextInput, View, StyleSheet, Button, Alert, Pressable, Image, Dimensions } from "react-native";
import { useState } from "react";
import supabase from "../supabase/supabase";
import { router } from "expo-router";

const logoImg = require("../assets/images/spendsense-logo.png");

const LogInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      Alert.alert("Login Error", error.message);
    } else {
      Alert.alert("Success", "Logged in successfully");
      router.replace("/HomePage");
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
    <View style={styles.container}>
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
      <Pressable onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </Pressable>
      <Pressable style={styles.button2} onPress={handleLogin}>
        <Text style={styles.buttonText2}>Log In</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Back</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: 'white',
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    color: "black",
    fontFamily: "Figtree"
  },
  button: {
    backgroundColor: '#49D469',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },

  button2: {
    backgroundColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 0,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontFamily: "Figtree-Bold"
  },

  buttonText2: {
    color: '#49D469',
    fontSize: 18,
    fontFamily: "Figtree-Bold"
  },
  forgotPasswordText: {
    color: '#007bff',
    fontSize: 16,
    fontFamily: "Figtree",
    textAlign: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 300,
    height: 300,
  },
});

export default LogInForm;
