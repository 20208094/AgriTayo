import React from "react";
import { SafeAreaView, View, Text, ScrollView, Image } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import placeholderimg from "../../../../assets/placeholder.png";

function ReviewingScreen() {
  const reviewingItems = [
    { id: 1, name: "Product C", status: "Under Review", image: placeholderimg },
    { id: 2, name: "Product D", status: "Under Review", image: placeholderimg },
  ];

  return (
    <SafeAreaView className='flex-1 bg-gray-100'>
      <ScrollView className="p-4">
        {reviewingItems.map((item) => (
          <View key={item.id} className="bg-white p-4 mb-4 rounded-lg shadow-lg flex-row items-center">
            <Image source={item.image} className="w-16 h-16 rounded-lg mr-4" />
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
              <Text className="text-sm text-gray-600">Status: {item.status}</Text>
            </View>
            <Icon name="timer-sand" size={24} color="#00b251" />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default ReviewingScreen;
