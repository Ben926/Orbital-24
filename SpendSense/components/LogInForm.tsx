import { TextInput, View, StyleSheet, Button, Alert } from "react-native";
import { useState } from "react";
import supabase from "../supabase/supabase.js"; 

const LogInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({email,password});
    if (error) {
      Alert.alert("Login Error", error.message);
    } else {
      Alert.alert("Success", "Logged in successfully");
    }
  };

  return (
    <View style={styles.container}>
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
      <Button title="Log In" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 16,
    color: "black",
  },
});

export default LogInForm;