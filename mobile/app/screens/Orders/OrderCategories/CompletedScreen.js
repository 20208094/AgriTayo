import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import PurchaseHistoryReports from "../../../components/PurchaseHistoryReports";

const CompletedScreen = ({ orders, orderProducts }) => {
  const [completedOrders, setCompletedOrders] = useState([]);
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

  // Assemble completed orders
  const assembleCompletedOrders = () => {
    if (orders.length > 0 && orderProducts.length > 0) {
      const itemsWithOrders = orders
        .filter(order => order.status_id === 8) // Assuming status_id 8 means "Completed"
        .map(order => {
          const items = orderProducts.filter(product => product.order_id === order.order_id);
          return { ...order, items };
        });
      setCompletedOrders(itemsWithOrders);
    }
  };

  useEffect(() => {
    assembleCompletedOrders();
  }, [orders, orderProducts]);

  const transformToReportData = () => {
    return completedOrders.flatMap((order) =>
      order.items.map((item) => ({
        item_name: item.item_name,
        total_price: `₱${item.order_prod_total_price}`,
        order_date: formatDate(order.order_date),
        receive_date: formatDate(order.completed_date),
        shipping_method: order.shipping_method || "N/A",
        payment_method: order.payment_method || "N/A",
      }))
    );
  };

  if (completedOrders.length === 0) {
    return (
      <SafeAreaView>
        <Text className="text-center text-gray-600">No completed orders found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-gray-100">
       <PurchaseHistoryReports purchaseHistory={transformToReportData()} />
      <ScrollView className="p-5">
        {completedOrders.map((completedOrder) => (
          <View key={completedOrder.order_id} className="p-4 mb-6 bg-white border border-[#00B251] rounded-lg shadow-md">
            <View className="flex-row items-center mb-2">
              <Ionicons name="checkmark-circle-outline" size={24} color="#00B251" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">Order Completed Successfully</Text>
            </View>
            <Text className="text-md text-gray-600">
              Order completed on: {formatDate(completedOrder.completed_date)} at {formatTime(completedOrder.completed_date)}
            </Text>

            <View className="mt-2 border-t border-gray-300 pt-2">
              <Text className="text-md font-semibold text-gray-800">Items:</Text>
              {completedOrder.items.length > 0 ? (
                completedOrder.items.map(item => (
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

export default CompletedScreen;
