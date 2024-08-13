import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Alert } from "react-native";

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const password_regex = /^[A-Za-z\d@.#$!%*?&^]{8,30}$/;
  const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = () => {
    setEmailError('');
    setPasswordError('');
  
    let hasError = false;
  
    if (!email) {
      setEmailError('Enter your email');
      hasError = true;
    }
    if (!password) {
      setPasswordError('Enter your password');
      hasError = true;
    }
  
    if (!hasError) {
      if (email_regex.test(email) && password_regex.test(password)) {
        navigation.navigate('NavigationBar');
      } else {
        if (!email_regex.test(email)) {
          setEmailError('Invalid Email. Please try again.');
        }
        if (!password_regex.test(password)) {
          setPasswordError('Invalid Password. Please try again.');
        }
      }
    }
  };
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-3xl font-bold mb-6 text-gray-800">Login</Text>
      <TextInput
        className="w-4/5 p-3 mb-2 bg-white rounded-lg shadow-md"
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={setEmail}
        value={email}
      />
      {emailError ? <Text className="w-4/5 text-red-500 mb-4">{emailError}</Text> : null}

      <TextInput
        className="w-4/5 p-3 mb-2 bg-white rounded-lg shadow-md"
        placeholder="Password"
        secureTextEntry={true}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={setPassword}
        value={password}
      />
      {passwordError ? <Text className="w-4/5 text-red-500 mb-4">{passwordError}</Text> : null}
      <TouchableOpacity
        onPress={handleLogin}
        className="w-4/5 p-3 mb-4 bg-[#00B251] rounded-lg shadow-md"
      >
        <Text className="text-white text-center text-lg">Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}
        className="w-4/5 p-3 bg-gray-300 rounded-lg shadow-md"
      >
        <Text className="text-gray-800 text-center text-lg">Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Forgot Password')}>
        <Text className="text-green-500 mt-4">Forgot Password? Click Here</Text>
      </TouchableOpacity>
    </View>
  );
}

export default LoginScreen;
