import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image, // Import Image for displaying images
} from "react-native";
import placeholderimg from '../../assets/placeholder.png'; // Ensure correct path for image

const ToPayScreen = ({ navigation }) => {
  const toPayOrders = [
    { id: "1", item: "Corn Seeds", total: "₱120", dueDate: "2024-09-10", image: placeholderimg },
    { id: "2", item: "Pumpkin Seeds", total: "₱230", dueDate: "2024-09-11", image: placeholderimg },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="p-4">
        {toPayOrders.map((toPayOrder) => (
          <TouchableOpacity
            key={toPayOrder.id} 
            className="bg-white p-4 mb-4 rounded-lg shadow-lg flex-row items-center" 
            onPress={() => navigation.navigate("Order Details", { toPayOrder })}
          >
            <Image source={toPayOrder.image} className="w-16 h-16 rounded-lg mr-4" /> 
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">{toPayOrder.item}</Text>
              <Text className="text-sm text-green-600">Total: {toPayOrder.total}</Text>
              <Text className="text-sm text-green-600">Due by: {toPayOrder.dueDate}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ToPayScreen;
