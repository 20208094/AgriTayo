import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';

function ToReplyScreen() {
  const shops = [
    { id: 1, comment: "Comment A", rating: 4 },
    { id: 2, comment: "Comment B", rating: 3 },
    { id: 3, comment: "Comment C", rating: 5 },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      {shops.map((shop) => (
        <View key={shop.id} className="border-b border-gray-200 py-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-800">{shop.comment}</Text>
            <View className="flex-row">
              {[...Array(shop.rating)].map((_, i) => (
                <Text key={i} className="text-yellow-500 text-lg">
                  ★
                </Text>
              ))}
            </View>
          </View>
        </View>
      ))}
    </SafeAreaView>
  );
}

export default ToReplyScreen;
