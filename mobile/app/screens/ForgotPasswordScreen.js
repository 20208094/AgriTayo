import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function ForgotPasswordScreen({ navigation }) {
  return (
    <SafeAreaView>
      <View className="">
        <Text className="">Forgot Password</Text>
        <Text className="">Please enter your email</Text>
        <TextInput
          className=""
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text className="">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Change Password OTP")}
          className=""
        >
          <Text classname="">Confirm</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default ForgotPasswordScreen;
