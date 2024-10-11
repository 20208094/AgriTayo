import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ToRateScreen = ({ orders, orderProducts }) => {
  const [toRateOrders, setToRateOrders] = useState([]);
  const navigation = useNavigation();

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    return date.toLocaleTimeString(undefined, options);
  };

  // Assemble orders that are "To Rate"
  const assembleToRateOrders = () => {
    if (orders.length > 0 && orderProducts.length > 0) {
      const itemsWithOrders = orders
        .filter(order => order.status_id === 7) // Assuming status_id 7 means "Completed"
        .map(order => {
          const items = orderProducts.filter(product => product.order_id === order.order_id && !product.review_id); // Filter items without reviews
          return { ...order, items };
        });
      setToRateOrders(itemsWithOrders);
    }
  };

  useEffect(() => {
    assembleToRateOrders();
  }, [orders, orderProducts]);

  if (toRateOrders.length === 0) {
    return (
      <SafeAreaView>
        <Text className="text-center text-gray-600">No items to rate found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-gray-100">
      <ScrollView className="p-5">
        {toRateOrders.map((toRateOrder) => (
          <View key={toRateOrder.order_id} className="p-4 mb-4 bg-white border border-[#00B251] rounded-lg shadow-md">
            <View className="flex-row items-center mb-2">
              <Ionicons name="star-outline" size={24} color="#FFD700" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">Order Details</Text>
            </View>
            <Text className="text-md text-gray-600">
              Order completed on: {formatDate(toRateOrder.completed_date)} at {formatTime(toRateOrder.completed_date)}
            </Text>

            <View className="mt-2 border-t border-gray-300 pt-2">
              <Text className="text-md font-semibold text-gray-800">Items:</Text>
              {toRateOrder.items.length > 0 ? (
                toRateOrder.items.map(item => (
                  <View key={item.order_prod_id} className="mb-2">
                    <TouchableOpacity
                      className="bg-gray-50 p-4 rounded-lg shadow-sm flex-row items-center"
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
                  </View>
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

export default ToRateScreen;
