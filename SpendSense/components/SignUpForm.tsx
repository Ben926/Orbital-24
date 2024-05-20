import {TextInput, View, Button} from "react-native"
import { useState } from "react";

interface SignUpFormProps {
    login: React.ReactNode;
    signup: React.ReactNode;
  }

const SignUpForm: React.FC<SignUpFormProps> = ({login, signup}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    return (<View>
    <TextInput textAlign = "center" placeholderTextColor = "black" placeholder= "Username" 
    value = {username} onChangeText={setUsername} style ={{color: "black", borderColor: "gray"}}></TextInput>
    <TextInput textAlign = "center" placeholderTextColor = "black" placeholder = "Password" 
    value = {password} onChangeText={setPassword} style ={{color: "black", borderColor: "gray"}}></TextInput>
    <TextInput textAlign = "center" placeholderTextColor = "black" placeholder = "Confirm Password" 
    value = {confirmPassword} onChangeText={setConfirmPassword} style ={{color: "black", borderColor: "gray"}}></TextInput>
    {login}
    {signup}
    </View>
    );
}

export default SignUpForm;