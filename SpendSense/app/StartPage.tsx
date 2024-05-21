import { Text, View, Image, ScrollView, StyleSheet, Pressable } from "react-native";
import { HelloWave } from "@/components/HelloWave";
import { router } from "expo-router";

const logoImg = require("../assets/images/spendsense-logo.png");

const Start = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Image source={logoImg} style={styles.logo} />
        <HelloWave />
        <Text style={styles.welcomeText}>Welcome to SpendSense!</Text>
        <Pressable style={styles.button} onPress={() => router.replace("LogInForm")}>
          <Text style={styles.buttonText}>Log In</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => router.replace("SignUpForm")}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    width: 300,
    height: 300
  },
  welcomeText: {
    fontFamily: 'Verdana',
    paddingBottom: 30,
    textAlign: 'center',
    fontSize: 18
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: "Verdana"
  },
});

export default Start;
