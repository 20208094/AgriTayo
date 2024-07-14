import React from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";

function LoginScreen({ navigation }) {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-3xl font-bold mb-6 text-gray-800">Login</Text>
      
      <TextInput
        className="w-4/5 p-3 mb-4 bg-white rounded-lg shadow-md"
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      <TextInput
        className="w-4/5 p-3 mb-6 bg-white rounded-lg shadow-md"
        placeholder="Password"
        secureTextEntry={true}
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      <TouchableOpacity
        onPress={() => navigation.navigate("NavigationBar")}
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
    </View>
  );
}

export default LoginScreen;
