import React from "react";
import { View, Text, ScrollView } from "react-native";
import { styled } from "nativewind";

function NotificationDetailsScreen({ route }) {
  const { notification } = route.params;

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <View className="bg-white p-4 rounded-lg shadow-md">
        <Text className="text-2xl font-bold text-black-900 mb-2">{notification.title}</Text>
        <Text className="text-base text-black-700">{notification.message}</Text>
      </View>
    </ScrollView>
  );
}

export default styled(NotificationDetailsScreen);
