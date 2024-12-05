import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const PreparingScreen = ({ orders, orderProducts }) => {
  const [preparingOrders, setPreparingOrders] = useState([]);
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

  // Assemble orders that are "Preparing"
  const assemblePreparingOrders = () => {
    if (orders.length > 0 && orderProducts.length > 0) {
      const itemsWithOrders = orders
        .filter(order => order.status_id === 2) // Assuming status_id 2 means "Preparing"
        .map(order => {
          const items = orderProducts.filter(product => product.order_id === order.order_id);
          return { ...order, items };
        });
      setPreparingOrders(itemsWithOrders);
    }
  };

  useEffect(() => {
    assemblePreparingOrders();
  }, [orders, orderProducts]);

  if (preparingOrders.length === 0) {
    return (
      <SafeAreaView>
        <Text className="text-center text-gray-600">No orders currently being prepared.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-gray-100">
      <ScrollView className="p-5">
        {preparingOrders.map((preparingOrder) => (
          <View key={preparingOrder.order_id} className="p-4 mb-6 bg-white border border-[#00B251] rounded-lg shadow-md">
            <View className="flex-row items-center mb-2">
              <Ionicons name="cart-outline" size={24} color="#FFD700" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">Order Being Prepared</Text>
            </View>
            <Text className="text-md text-gray-600">Order placed on: {formatDate(preparingOrder.order_date)} at {formatTime(preparingOrder.order_date)}</Text>
            <Text className="text-md text-gray-600">Shipping Method: {preparingOrder.shipping_method}</Text>
            {preparingOrder.shipping_method === 'Delivery' ? (
              <Text className="text-md text-gray-600">Shipping Address: {preparingOrder.shipping_address}</Text>
            ) : (
              <></>
            )}
            <Text className="text-md text-gray-600">Payment Method: {preparingOrder.payment_method}</Text>
            <Text className="text-md text-gray-600">Total Price: ₱{parseFloat(preparingOrder.total_price).toFixed(2)}</Text>
            <Text className="text-sm text-yellow-600 mt-1">Seller is preparing your order</Text>
            <View className="mt-2 border-t border-gray-300 pt-2">
              <Text className="text-md font-semibold text-gray-800">Items:</Text>
              {preparingOrder.items.length > 0 ? (
                preparingOrder.items.map(item => (
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

export default PreparingScreen;
