import { Text, View, Image, Button, ScrollView, StyleSheet } from "react-native";
import { useCallback, useState } from "react";
import LogInForm from "../components/LogInForm";
import { RefreshControl } from "react-native-gesture-handler";

const logoImg = require("../assets/images/spendsense-logo.png");

export default function Index() {
  const [isLogInVisible, setLogInVisible] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Image source={logoImg} style={styles.logo} />
        <Text style={styles.welcomeText}>Welcome to SpendSense!</Text>
        {!isLogInVisible && (
          <Button title="Log In" onPress={() => setLogInVisible(true)} />
        )}
        {isLogInVisible && <LogInForm />}
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