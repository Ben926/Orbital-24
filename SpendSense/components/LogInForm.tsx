import {TextInput, View, Button} from "react-native"
import { useState } from "react";

interface LogInFormProps {
    login: React.ReactNode;
    signup: React.ReactNode;
  }

  const LogInForm: React.FC<LogInFormProps> = ({login, signup}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    return (<View>
    <TextInput textAlign = "center" placeholderTextColor = "black" placeholder= "Username" 
    value = {username} onChangeText={setUsername} style ={{color: "black", borderColor: "gray"}}></TextInput>
    <TextInput textAlign = "center" placeholderTextColor = "black" placeholder = "Password" 
    value = {password} onChangeText={setPassword} style ={{color: "black", borderColor: "gray"}}></TextInput>
    {login}
    {signup}
    </View>
    );
}

export default LogInForm;