import React from 'react';
import { SafeAreaView, View, Text, ScrollView, Image } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import placeholderimg from "../../../../assets/placeholder.png";

function SoldOutScreen() {
  const soldOutItems = [
    { id: 1, name: "Product A", date: "2024-08-10", image: placeholderimg },
    { id: 2, name: "Product B", date: "2024-08-11", image: placeholderimg },
  ];

  return (
    <SafeAreaView className='flex-1 bg-gray-100'>
      <ScrollView className="p-4">
        {soldOutItems.map((item) => (
          <View key={item.id} className="bg-white p-4 mb-4 rounded-lg shadow-lg flex-row items-center">
            <Image source={item.image} className="w-16 h-16 rounded-lg mr-4" />
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
              <Text className="text-sm text-gray-600">Sold Out on: {item.date}</Text>
            </View>
            <Icon name="check-circle" size={24} color="#00b251" />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default SoldOutScreen;
