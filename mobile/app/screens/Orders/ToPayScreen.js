import React from "react";
import { View, Text, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const ToPayScreen = () => {
  const orders = [
    { id: "1", item: "Corn Seeds", total: "₱120", dueDate: "2024-09-10" },
    { id: "2", item: "Pumpkin Seeds", total: "₱230", dueDate: "2024-09-11" },
  ];

  return (
    <ScrollView className="p-4">
      {orders.map((order) => (
        <View
          key={order.id}
          className="bg-gray-200 p-4 mb-4 rounded-lg flex-row items-center justify-between"
        >
          <View>
            <Text className="text-lg font-bold">{order.item}</Text>
            <Text className="text-gray-600">Total: {order.total}</Text>
            <Text className="text-green-600">Due by: {order.dueDate}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default ToPayScreen;
