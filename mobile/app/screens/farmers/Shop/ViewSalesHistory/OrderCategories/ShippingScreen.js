import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Modal, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from '@env';
import { useNavigation } from "@react-navigation/native";

const ShippingScreen = ({ orders, orderProducts }) => {
  const [shippingOrders, setShippingOrders] = useState([]);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [cancelOrderVisible, setCancelOrderVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
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

  // Assemble orders that are "Shipping"
  const assembleShippingOrders = () => {
    if (orders.length > 0 && orderProducts.length > 0) {
      const itemsWithOrders = orders
        .filter(order => order.status_id === 3) // Assuming status_id 3 means "Shipping"
        .map(order => {
          const items = orderProducts.filter(product => product.order_id === order.order_id);
          return { ...order, items };
        });
      setShippingOrders(itemsWithOrders);
    }
  };

  useEffect(() => {
    assembleShippingOrders();
  }, [orders, orderProducts]);

  const handleConfirmReceipt = (order) => {
    setSelectedOrder(order);
    setConfirmationVisible(true);
  };

  const handleConfirmedUpdate = (selectedOrder) => {
    setConfirmationVisible(false);
    if (selectedOrder) {
      let updatedOrder = { ...selectedOrder, seller_is_received: true };
      handleUpdateOrder(updatedOrder);
    } else {
      console.error("selectedOrder is undefined");
    }
  };

  const handleCancelOrder = (order) => {
    setSelectedOrder(order);
    setCancelOrderVisible(true);
  };

  const submitRejectOrder = () => {
    setCancelOrderVisible(false);
    if (selectedOrder) {
      let updatedOrder = { ...selectedOrder, reject_reason: rejectReason, status_id: 9};
      handleUpdateOrder(updatedOrder, () => {
        navigation.navigate("Sales History", { screen: "Rejected" });
      });
    } else {
      console.error("selectedOrder is undefined");
    }
    setRejectReason("");
  };

  const handleUpdateOrder = async (order, onSuccess) => {
    if (order) {
      const bodyData = {
        status_id: order.status_id,
        seller_is_received: order.seller_is_received,
        buyer_is_received: order.buyer_is_received,
        allow_return: order.allow_return,
        reject_reason: order.reject_reason,
        return_reason: order.return_reason,
        reject_date: order.reject_date,
        order_received_date: order.order_received_date,
        return_date: order.return_date,
        completed_date: order.completed_date,
      };
  
      try {
        const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/orderStatus/${order.order_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            "x-api-key": REACT_NATIVE_API_KEY,
          },
          body: JSON.stringify(bodyData),
        });
  
        if (response.ok) {
          // Execute the onSuccess callback if provided
          if (onSuccess) {
            onSuccess();
          }
        } else {
          console.error("Failed to update order:", response.statusText);
        }
        
      } catch (error) {
        console.error('Error updating order:', error);
        Alert.alert('Error', 'Network request failed. Please check your connection.');
      }
    } else {
      Alert.alert('Error', 'Message or image is required.');
    }
  };

  if (shippingOrders.length === 0) {
    return (
      <SafeAreaView>
        <Text className="text-center text-gray-600">No orders currently being shipped.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-gray-100">
      <ScrollView className="p-5">
        {shippingOrders.map((shippingOrder) => (
          <View key={shippingOrder.order_id} className="p-4 mb-4 bg-white border border-[#00B251] rounded-lg shadow-md">
            <View className="flex-row items-center mb-2">
              <Ionicons name="airplane-outline" size={24} color="#32CD32" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">Order On The Way</Text>
            </View>
            <Text className="text-md text-gray-600">Order placed on: {formatDate(shippingOrder.order_date)} at {formatTime(shippingOrder.order_date)}</Text>

            {/* Check if seller has marked the item as received */}
            {shippingOrder.seller_is_received ? (
              <View>
                <Text className="text-sm text-green-600 mt-2">Waiting for Buyer to confirm that they received the order.</Text>
                <View className="mt-4">
                  <TouchableOpacity
                    className="bg-red-600 p-2 rounded-lg items-center"
                    onPress={() => handleCancelOrder(shippingOrder)}
                  >
                    <Text className="text-white">Cancel Order</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View className="mt-4">
                <Text className="text-md text-gray-800">Did the buyer already receive their order?</Text>
                <View className="flex-row mt-2">
                  <TouchableOpacity
                    className="bg-[#00B251] p-2 rounded-lg mr-2 w-1/2 items-center"
                    onPress={() => handleConfirmReceipt(shippingOrder)}
                  >
                    <Text className="text-white">Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-red-600 p-2 rounded-lg w-1/2 items-center"
                    onPress={() => handleCancelOrder(shippingOrder)}
                  >
                    <Text className="text-white">Cancel Order</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View className="mt-2 border-t border-gray-300 pt-2">
              <Text className="text-md font-semibold text-gray-800">Items:</Text>
              {shippingOrder.items.length > 0 ? (
                shippingOrder.items.map(item => (
                  <TouchableOpacity
                    key={item.order_prod_id}
                    className="bg-gray-50 p-4 mb-2 rounded-lg shadow-sm flex-row items-center"
                    onPress={() => navigation.navigate("Order Details", { item })}
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

      {/* Confirmation Modal for confirming receipt */}
      <Modal
        visible={confirmationVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setConfirmationVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg">
            <Text className="text-lg font-semibold mb-4">Confirm Receipt</Text>
            <Text>Are you sure the buyer already recieved their order?</Text>
            <View className="flex-row justify-end mt-4">
              <TouchableOpacity
                className="bg-green-500 p-2 rounded-lg mr-2"
                onPress={() => handleConfirmedUpdate(selectedOrder)}
              >
                <Text className="text-white">Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-gray-300 p-2 rounded-lg"
                onPress={() => setConfirmationVisible(false)}
              >
                <Text className="text-black">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Cancel Order Modal */}
      <Modal
        visible={cancelOrderVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCancelOrderVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg">
            <Text className="text-lg font-semibold mb-4">Cancel Order</Text>
            <Text>Why are you cancelling this order?</Text>
            <TextInput
              className="border border-gray-300 p-2 rounded-lg mt-2"
              placeholder="Enter reason for cancellation"
              value={rejectReason}
              onChangeText={setRejectReason}
            />
            <View className="flex-row justify-end mt-4">
              <TouchableOpacity
                className="bg-red-500 p-2 rounded-lg mr-2"
                onPress={submitRejectOrder}
              >
                <Text className="text-white">Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-gray-300 p-2 rounded-lg"
                onPress={() => setCancelOrderVisible(false)}
              >
                <Text className="text-black">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ShippingScreen;
