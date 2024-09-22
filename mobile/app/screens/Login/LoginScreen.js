import React, { useState, useEffect } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from '@env';

function LoginScreen({ navigation, fetchUserSession }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(true);

  const password_regex = /^[A-Za-z\d@.#$!%*?&^]{8,30}$/;
  const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    const fetchUserSession = async () => {
      console.log("came to session...");
      try {
        console.log("Fetching user session...");
        const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/session`, {
          headers: {
            'x-api-key': REACT_NATIVE_API_KEY
          }
        });
        if (response.ok) {
          const data = await response.json();
          console.log("User session data:", data);
          if (data.user) {
            console.log("User is logged in, navigating to HomePageScreen");
            navigation.navigate('HomePageScreen');
          } else {
            console.log("No user found in session");
          }
        } else {
          console.log("Failed to fetch user session:", response.status);
        }
      } catch (error) {
        console.error('Login Error fetching user session:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSession();
  }, [navigation]);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');

    let hasError = false;

    if (!formData.email) {
      setEmailError('Enter your email');
      hasError = true;
    }
    if (!formData.password) {
      setPasswordError('Enter your password');
      hasError = true;
    }

    if (!hasError) {
      if (email_regex.test(formData.email) && password_regex.test(formData.password)) {
        try {
          console.log('Attempting to log in with:', formData);
          const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': REACT_NATIVE_API_KEY
            },
            body: JSON.stringify(formData)
          });
          console.log('Login response status:', response.status);
          
          if (!response.ok) {
            const errorData = await response.json();
            setEmailError(errorData.error || 'Login failed. Please try again.');
            console.log("Login failed:", errorData);
            return;
          }

          // Call fetchUserSession after successful login
          console.log('Login successful, fetching user session...');
          await fetchUserSession();
          // navigation.reset({
          //   index: 0,
          //   routes: [{ name: 'HomePageScreen' }],
          // });
        } catch (error) {
          console.error('Error during login:', error);
          setEmailError('An error occurred. Please try again.');
        }
      } else {
        if (!email_regex.test(formData.email)) {
          setEmailError('Invalid Email. Please try again.');
          console.log("Invalid email format");
        }
        if (!password_regex.test(formData.password)) {
          setPasswordError('Invalid Password. Please try again.');
          console.log("Invalid password format");
        }
      }
    }
  };

  if (loading) {
    return <Text>Loading...</Text>; // or your loading spinner
  }

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-3xl font-bold mb-6 text-gray-800">Login</Text>
      <TextInput
        className="w-4/5 p-3 mb-2 bg-white rounded-lg shadow-md"
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={(value) => handleInputChange('email', value)}
        value={formData.email}
      />
      {emailError ? <Text className="w-4/5 text-red-500 mb-4">{emailError}</Text> : null}

      <TextInput
        className="w-4/5 p-3 mb-2 bg-white rounded-lg shadow-md"
        placeholder="Password"
        secureTextEntry={true}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={(value) => handleInputChange('password', value)}
        value={formData.password}
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
