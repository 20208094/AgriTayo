import React from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image } from "react-native";
import placeholderimg from '../../assets/placeholder.png'; // Ensure the correct path for the placeholder image

const ToReceiveScreen = ({ navigation }) => {  
  const toReceiveOrders = [
    { id: "1", item: "Rice Seeds", expectedDate: "2024-09-15", image: placeholderimg },
    { id: "2", item: "Wheat Seeds", expectedDate: "2024-09-17", image: placeholderimg },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="p-4">
        {toReceiveOrders.map((toReceiveOrder) => (
          <TouchableOpacity
            key={toReceiveOrder.id}  
            className="bg-white p-4 mb-4 rounded-lg shadow-lg flex-row items-center"
            onPress={() => navigation.navigate('Order Details', { toReceiveOrder })}  
          >
            <Image source={toReceiveOrder.image} className="w-16 h-16 rounded-lg mr-4" /> 
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">{toReceiveOrder.item}</Text>
              <Text className="text-sm text-green-600">Expected by: {toReceiveOrder.expectedDate}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ToReceiveScreen;
