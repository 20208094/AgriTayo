import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const RejectedScreen = ({ orders, orderProducts }) => {
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const navigation = useNavigation();

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  // Function to format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const options = { hour: '2-digit', minute: '2-digit', hour12: true }; // 12-hour format
    return date.toLocaleTimeString(undefined, options); // Formats to a human-readable time string
  };

  // Assemble cancelled orders with their products
  const assembleCancelledOrders = () => {
    if (orders.length > 0 && orderProducts.length > 0) {
      const itemsWithOrders = orders
        .filter(order => order.status_id === 9) // Assuming status_id 9 means "Cancelled"
        .map(order => {
          const items = orderProducts.filter(product => product.order_id === order.order_id);
          return { ...order, items };
        });
      setCancelledOrders(itemsWithOrders);
    }
  };

  useEffect(() => {
    assembleCancelledOrders();
  }, [orders, orderProducts]);

  if (cancelledOrders.length === 0) {
    return (
      <SafeAreaView>
        <Text className="text-center text-gray-600">No rejected orders found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-gray-100">
      <ScrollView className="p-5">
        {cancelledOrders.map((cancelledOrder) => (
          <View key={cancelledOrder.order_id} className="p-4 mb-4 bg-white border border-[#00B251] rounded-lg shadow-md">
            <View className="flex-row items-center mb-2">
              <Ionicons name="close-circle-outline" size={24} color="#FF5B5B" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">Cancelled Order</Text>
            </View>
            <Text className="text-md text-gray-600">Cancelled on: {formatDate(cancelledOrder.reject_date)} at {formatTime(cancelledOrder.reject_date)}</Text>
            <Text className="text-sm text-red-600 mt-1">Reason: {cancelledOrder.reject_reason}</Text>
            <View className="mt-2 border-t border-gray-300 pt-2">
              <Text className="text-md font-semibold text-gray-800">Items:</Text>
              {cancelledOrder.items.length > 0 ? (
                cancelledOrder.items.map(item => (
                  <TouchableOpacity
                    key={item.order_prod_id}
                    className="bg-gray-50 p-4 mb-2 rounded-lg shadow-sm flex-row items-center"
                    onPress={() => navigation.navigate('Order Details', { item })}
                  >
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-800">Item Name: {item.item_name}</Text>
                      <View className="flex-row mt-2">
                        <Text className="w-1/3 text-sm text-gray-600">Total Quantity:</Text>
                        <Text className="text-sm text-gray-600">{item.order_prod_total_weight} {item.orig_prod_metric_symbol}</Text>
                      </View>
                      <View className="flex-row mt-1">
                        <Text className="w-1/3 text-sm text-gray-600">Total Price:</Text>
                        <Text className="text-sm text-gray-600">₱{item.order_prod_total_price}</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="gray" />
                  </TouchableOpacity>
                ))
              ) : (
                <Text className="text-gray-600">No items found for this order.</Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default RejectedScreen;
