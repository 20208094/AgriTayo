import React from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image } from "react-native";
import placeholderimg from '../../assets/placeholder.png'; // Adjust the path as needed

const CancelledScreen = ({ navigation }) => {
  const cancelledOrders = [
    {
      id: "1",
      item: "Carrot Seeds",
      date: "2024-09-01",
      reason: "Out of stock",
      image: placeholderimg,
    },
    {
      id: "2",
      item: "Potato Seeds",
      date: "2024-09-02",
      reason: "Payment failure",
      image: placeholderimg,
    },
  ];

  return (
    <SafeAreaView>
      <ScrollView className="p-4">
        {cancelledOrders.map((cancelledOrder) => (
          <TouchableOpacity
            key={cancelledOrder.id}
            className="bg-white p-4 mb-4 rounded-lg shadow-lg flex-row items-center"
            onPress={() => navigation.navigate('Order Details', { cancelledOrder })}
          >
            <Image source={cancelledOrder.image} className="w-16 h-16 rounded-lg mr-4" />
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">{cancelledOrder.item}</Text>
              <Text className="text-sm text-gray-600">Cancelled on: {cancelledOrder.date}</Text>
              <Text className="text-sm text-red-600">Reason: {cancelledOrder.reason}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CancelledScreen;
