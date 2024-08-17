import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';

function AllScreen() {
  const shops = [
    { id: 1, rating: "0.00" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      {shops.map((shop) => (
        <View key={shop.id} className="border-b border-gray-200 py-4">
          <Text className="text-xl font-bold text-gray-800">{shop.rating}</Text>
          <Text className="text-yellow-500 text-lg mt-1">
            ★★★★★
          </Text>
        </View>
      ))}
    </SafeAreaView>
  );
}

export default AllScreen;
