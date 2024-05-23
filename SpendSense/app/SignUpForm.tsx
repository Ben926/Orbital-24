import { Text, TextInput, View, StyleSheet, Button, Alert, Pressable, Image} from "react-native";
import { useState } from "react";
import supabase from "../supabase/supabase";
import { router } from "expo-router";

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

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      Alert.alert("Signup Error", error.message);
    } else {
      Alert.alert("Success", "Signed up successfully");
    }
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
      <TextInput
        textAlign="center"
        placeholderTextColor="black"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        secureTextEntry
      />
      <Pressable style={styles.button2} onPress={handleSignup}>
        <Text style={styles.buttonText2}>Sign Up</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Back</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    flex: 1
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 50, 
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
  logo: {
    width: 300,
    height: 300,
  },
});

export default SignUpForm;