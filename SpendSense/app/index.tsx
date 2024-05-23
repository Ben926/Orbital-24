import { Text, View, Image, ScrollView, StyleSheet, Pressable } from "react-native";
import { HelloWave } from "@/components/HelloWave";
import { router } from "expo-router";
import SplashScreen from "./SplashScreen";
import { useState, useEffect } from "react";

const logoImg = require("../assets/images/spendsense-logo.png");

const HomePage = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);

  const handleFinishSplash = () => {
    setIsShowSplash(false);
  };

  
  if (!isShowSplash) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Image source={logoImg} style={styles.logo} />
          <Text style={styles.welcomeText}>Welcome to SpendSense!</Text>
          <Pressable style={styles.button} onPress={() => router.push("LogInForm")}>
            <Text style={styles.buttonText}>Log In</Text>
          </Pressable>
          <View style={styles.row}>
          <Text style={styles.text2}>Don't have an account?</Text>
          <Pressable style={styles.button2} onPress={() => router.push("SignUpForm")}>
            <Text style={styles.buttonText2}>Create one now!</Text>
          </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  } else {
    return <SplashScreen onFinish={handleFinishSplash}/>;
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16
  },
  logo: {
    width: 300,
    height: 300
  },
  welcomeText: {
    fontFamily: 'Figtree-Bold',
    paddingBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 24,
  },
  text2: {
    fontFamily: "Figtree",
    color: 'black',
    fontSize: 16,
    marginRight: 5, 
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    fontFamily: 'Figtree'
  },
  button: {
    backgroundColor: '#49D469',
    paddingVertical: 12,
    paddingHorizontal: 160,
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
    fontSize: 16,
    textAlign: 'center',
    fontFamily: "Figtree-Bold"
  },
  buttonText2: {
    color: '#49D469',
    fontSize: 16,
    fontFamily: "Figtree-Bold",
    textDecorationLine: 'underline',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  }
});

export default HomePage