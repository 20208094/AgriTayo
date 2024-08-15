import React from 'react';
import { SafeAreaView, View, Text, ScrollView, Image } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import placeholderimg from "../../../../assets/placeholder.png";

function DelistedScreen() {
  const delistedItems = [
    { id: 1, name: "Product G", reason: "Out of Stock", image: placeholderimg },
    { id: 2, name: "Product H", reason: "Discontinued", image: placeholderimg },
  ];

  return (
    <SafeAreaView className='flex-1 bg-gray-100'>
      <ScrollView className="p-4">
        {delistedItems.map((item) => (
          <View key={item.id} className="bg-white p-4 mb-4 rounded-lg shadow-lg flex-row items-center">
            <Image source={item.image} className="w-16 h-16 rounded-lg mr-4" />
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
              <Text className="text-sm text-gray-600">Reason: {item.reason}</Text>
            </View>
            <Icon name="cancel" size={24} color="#ff9800" />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default DelistedScreen;
