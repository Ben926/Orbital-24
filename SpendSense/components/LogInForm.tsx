import {TextInput, View, StyleSheet} from "react-native"
import { useState } from "react";

interface LogInFormProps {
    login: React.ReactNode;
    signup: React.ReactNode;
  }

  const LogInForm: React.FC<LogInFormProps> = ({login, signup}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    return (<View style = {styles.container}>
    <TextInput textAlign = "center" placeholderTextColor = "black" placeholder= "Username" 
    value = {username} onChangeText={setUsername} style ={styles.input}></TextInput>
    <TextInput textAlign = "center" placeholderTextColor = "black" placeholder = "Password" 
    value = {password} onChangeText={setPassword} style ={styles.input}></TextInput>
    {login}
    {signup}
    </View>
    );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 16,
    color: 'black',
  },
});

export default LogInForm;