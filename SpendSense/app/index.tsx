import { Text, View, Image, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import SplashScreen from "./SplashScreen";
import { useState, useEffect } from "react";
import styles from '../styles/styles';
import { SafeAreaView } from "react-native-safe-area-context";

const logoImg = require("../assets/images/spendsense-logo.png");

const HomePage = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);

  const handleFinishSplash = () => {
    setIsShowSplash(false);
  };

  
  if (!isShowSplash) {
    return (
      <SafeAreaView style={styles.indexContainer}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Image source={logoImg} style={styles.logo} />
          <Text style={styles.welcomeText}>Welcome to SpendSense!</Text>
          <Pressable style={styles.button} onPress={() => router.push("LogInForm")}>
            <Text style={styles.buttonText}>Log In</Text>
          </Pressable>
          <View style={styles.row}>
          <Text style={styles.text2}>Don't have an account?</Text>
          <Pressable style={styles.transparentButton} onPress={() => router.push("SignUpForm")}>
            <Text style={styles.createAccButtonText}>Create one now!</Text>
          </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  } else {
    return <SplashScreen onFinish={handleFinishSplash}/>;
  }
  
}

export default HomePage