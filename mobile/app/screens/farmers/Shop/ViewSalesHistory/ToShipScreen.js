import React from "react";
import { SafeAreaView, ScrollView } from "react-native";
import OrderItem from "./OrderItem"; // Assuming OrderItem is in the same directory
import Reports from "../../../../components/Reports";

function ToShipScreen() {
  const orders = [
    {
      title: "Order #1234",
      description: "2 items",
      date: "2024-08-15",
      action: "Ship Now",
    },
    {
      title: "Order #1235",
      description: "1 item",
      date: "2024-08-14",
      action: "Ship Now",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Reports orders={orders} />
      <ScrollView className="p-4">
        {orders.map((order, index) => (
          <OrderItem key={index} order={order} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default ToShipScreen;
