import React from "react";
import { View, Text } from "react-native";

function Header({ firstname }) {
  return (
    <View className="flex-row justify-between items-center px-4 pt-4">
      <Text className="text-green-700 text-3xl font-bold">Hi {firstname}!</Text>
    </View>
  );
}

export default Header;
