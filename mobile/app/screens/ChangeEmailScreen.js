import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

function ChangeEmailScreen({ navigation }) {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 justify-center items-center px-5">
        <View className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <Text className="text-2xl font-bold text-green-700 mb-4 text-center">
            Change Email Address
          </Text>
          <Text className="text-base text-gray-600 mb-4 text-center">
            Please enter your new email and current password
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
            placeholder="New Email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-2 mb-6"
            placeholder="Password"
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="bg-gray-300 px-4 py-2 rounded-lg"
            >
              <Text className="text-gray-700 font-bold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="bg-green-600 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-bold">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default styled(ChangeEmailScreen);
