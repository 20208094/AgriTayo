import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const ToConfirmScreen = ({ orders, orderProducts }) => {
  const [toConfirmOrders, setToConfirmOrders] = useState([]);
  const navigation = useNavigation();

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const options = { hour: '2-digit', minute: '2-digit', hour12: true }; // 12-hour format
    return date.toLocaleTimeString(undefined, options); // Formats to a human-readable time string
  };

  // Assemble orders that are "To Confirm"
  const assembleToConfirmOrders = () => {
    if (orders.length > 0 && orderProducts.length > 0) {
      const itemsWithOrders = orders
        .filter(order => order.status_id === 1)
        .map(order => {
          const items = orderProducts.filter(product => product.order_id === order.order_id);
          return { ...order, items };
        });
      setToConfirmOrders(itemsWithOrders);
    }
  };

  useEffect(() => {
    assembleToConfirmOrders();
  }, [orders, orderProducts]);

  if (toConfirmOrders.length === 0) {
    return (
      <SafeAreaView>
        <Text className="text-center text-gray-600">No orders to confirm found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-gray-100">
      <ScrollView className="p-5">
        {toConfirmOrders.map((toConfirmOrder) => (
          <View key={toConfirmOrder.order_id} className="p-4 mb-4 bg-white border border-[#00B251] rounded-lg shadow-md">
            <View className="flex-row items-center mb-2">
              <Ionicons name="alert-circle-outline" size={24} color="#FFA500" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">Order to Confirm</Text>
            </View>
            <Text className="text-md text-gray-600">Order placed on: {formatDate(toConfirmOrder.order_date)} at {formatTime(toConfirmOrder.order_date)}</Text>
            <Text className="text-md text-gray-600">Shipping Method: {toConfirmOrder.shipping_method}</Text>
            {toConfirmOrder.shipping_method === 'Delivery' ? (
              <Text className="text-md text-gray-600">Shipping Address: {toConfirmOrder.shipping_address}</Text>
            ) : (
              <></>
            )}
            <Text className="text-md text-gray-600">Payment Method: {toConfirmOrder.payment_method}</Text>
            <Text className="text-md text-gray-600">Total Price: ₱{parseFloat(toConfirmOrder.total_price).toFixed(2)}</Text>
            <Text className="text-sm text-orange-600 mt-1">Please wait for seller to confirm your order.</Text>
            <View className="mt-2 border-t border-gray-300 pt-2">
              <Text className="text-md font-semibold text-gray-800">Items:</Text>
              {toConfirmOrder.items.length > 0 ? (
                toConfirmOrder.items.map(item => (
                  <TouchableOpacity
                    key={item.order_prod_id}
                    className="bg-gray-50 p-4 mb-2 rounded-lg shadow-sm flex-row items-center"
                    onPress={() => navigation.navigate('Order Details', { item })}
                  >
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-800">Item Name: {item.orig_prod_name}</Text>
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

export default ToConfirmScreen;
