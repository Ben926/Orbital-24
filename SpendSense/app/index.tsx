import { Text, View, Image, Button, ScrollView, StyleSheet } from "react-native";
import { useCallback, useState } from "react";
import LogInForm from "../components/LogInForm";
import SignUpForm from "../components/SignUpForm";

const logoImg = require("../assets/images/spendsense-logo.png");

export default function Index() {
  const [isLogInVisible, setLogInVisible] = useState(false);
  const [isSignUpVisible, setSignUpVisible] = useState(false);
  const [hasPressed, setPressed] = useState(false);
  const LogInButton = <Button title="Log In" onPress={() => {
    setLogInVisible(true);
    setSignUpVisible(false);
    setPressed(true);
  }} />
  const SignUpButton = <Button title="Sign Up" onPress={() => {
    setSignUpVisible(true);
    setLogInVisible(false);
    setPressed(true);
  }} />

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Image source={logoImg} style={styles.logo} />
        <Text style={styles.welcomeText}>Welcome to SpendSense!</Text>
        {!hasPressed && (
          <>
            {LogInButton}
            {SignUpButton}
          </>
        )}
        {isLogInVisible && <LogInForm login={LogInButton} signup={SignUpButton}/>}
        {isSignUpVisible && <SignUpForm login={LogInButton} signup={SignUpButton}/>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    width: 300,
    height: 300,
  },
  welcomeText: {
    fontFamily: 'Verdana',
    paddingBottom: 30,
    textAlign: 'center',
  },
});