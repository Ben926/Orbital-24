import {TextInput, View, Button} from "react-native"
import { useState } from "react";

const LogInForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    return (<View>
    <TextInput textAlign = "center" placeholderTextColor = "black" placeholder= "Username" 
    value = {username} onChangeText={setUsername} style ={{color: "black", borderColor: "gray"}}></TextInput>
    <TextInput textAlign = "center" placeholderTextColor = "black" placeholder = "Password" 
    value = {password} onChangeText={setPassword} style ={{color: "black", borderColor: "gray"}}></TextInput>
    <Button title = "Log In"/>
    </View>
    );
}

export default LogInForm;