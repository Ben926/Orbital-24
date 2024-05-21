import { Text, TextInput, View, StyleSheet, Button, Alert, Pressable } from "react-native";
import { useState } from "react";
import supabase from "../supabase/supabase";
import { router } from "expo-router";

const LogInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      Alert.alert("Login Error", error.message);
    } else {
      Alert.alert("Success", "Logged in successfully");
      router.replace("Home");
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
      <Pressable style={styles.button} onPress={() => router.replace("StartPage")}>
        <Text style={styles.buttonText}>Back</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    flex: 1,
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
    fontFamily: "Verdana"
  },
  button: {
    backgroundColor: '#007bff',
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
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LogInForm;
