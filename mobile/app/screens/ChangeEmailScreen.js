import React from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";

function ChangeEmailScreen({ navigation }) {
  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <Text className="text-3xl font-bold mb-6 text-gray-800">Change Email Address</Text>

      <TextInput
        className="w-4/5 p-3 mb-4 bg-white rounded-lg shadow-md"
        placeholder="New Email"
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
        onPress={() => navigation.goBack()}
        className="w-4/5 p-3 mb-4 bg-[#00B251] rounded-lg shadow-md"
      >
        <Text className="text-white text-center text-lg">Submit</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="w-4/5 p-3 bg-gray-300 rounded-lg shadow-md"
      >
        <Text className="text-gray-800 text-center text-lg">Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ChangeEmailScreen;
