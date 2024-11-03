import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Modal, TextInput, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from '@env';

const PickupScreen = ({ orders, orderProducts }) => {
  const [pickupOrders, setPickupOrders] = useState([]);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [returnDetailsVisible, setReturnDetailsVisible] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

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

  // Assemble orders that are "Pickup"
  const assemblePickupOrders = () => {
    if (orders.length > 0 && orderProducts.length > 0) {
      const itemsWithOrders = orders
        .filter(order => order.status_id === 4) // Assuming status_id 4 means "Pickup"
        .map(order => {
          const items = orderProducts.filter(product => product.order_id === order.order_id);
          return { ...order, items };
        });
      setPickupOrders(itemsWithOrders);
    }
  };

  useEffect(() => {
    assemblePickupOrders();
  }, [orders, orderProducts]);

  const handleConfirmPickup = (order) => {
    setSelectedOrder(order);
    setConfirmationVisible(true);
  };

  const handleConfirmedPickup = async () => {
    setConfirmationVisible(false);
    if (selectedOrder) {
      let updatedOrder = { ...selectedOrder, "status_id": 7 };
      await handleUpdateOrder(updatedOrder, () => {
        navigation.navigate("Orders", { screen: "To Rate" });
      });
    } else {
      console.error("selectedOrder is undefined");
    }
  };

  const handleReturnItem = (order) => {
    setSelectedOrder(order);
    setReturnDetailsVisible(true);
  };

  const submitReturnReason = async () => {
    setReturnDetailsVisible(false);

    if (selectedOrder) {
      let updatedOrder = { 
        ...selectedOrder, 
        "status_id": 5,
        "return_reason": returnReason 
      };
      await handleUpdateOrder(updatedOrder, () => {
        navigation.navigate("Orders", { screen: "For Return" });
      });
    } else {
      console.error("selectedOrder is undefined");
    }
    setReturnReason("");
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
          if (onSuccess) {
            onSuccess();
          }
        } else {
          console.error("Failed to update order:", response.statusText);
          setAlertMessage('Failed to update order. Please try again.');
          setAlertVisible(true);
        }
        
      } catch (error) {
        console.error('Error updating order:', error);
        setAlertMessage('Network request failed. Please check your connection.');
        setAlertVisible(true);
      }
    } else {
      setAlertMessage('Order data is required for the update.');
      setAlertVisible(true);
    }
  };

  if (pickupOrders.length === 0) {
    return (
      <SafeAreaView>
        <Text className="text-center text-gray-600">No orders currently available for pickup.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-gray-100">
      <ScrollView className="p-5">
        {pickupOrders.map((pickupOrder) => (
          <View key={pickupOrder.order_id} className="p-4 mb-4 bg-white border border-[#00B251] rounded-lg shadow-md">
            <View className="flex-row items-center mb-2">
              <Ionicons name="basket-outline" size={24} color="#FFA500" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">Ready for Pickup</Text>
            </View>
            <Text className="text-md text-gray-600">Order placed on: {formatDate(pickupOrder.order_date)} at {formatTime(pickupOrder.order_date)}</Text>
            <Text className="text-sm text-orange-600 mt-1">Your order is ready for pickup</Text>

            {/* Buttons for confirming or returning item */}
            <View className="mt-4">
              <Text className="text-md text-gray-800">Have you picked up your order?</Text>
              <View className="flex-row mt-2">
                <TouchableOpacity
                  className="bg-[#00B251] p-2 rounded-lg mr-2 w-1/2 items-center"
                  onPress={() => handleConfirmPickup(pickupOrder)}
                >
                  <Text className="text-white">Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-red-600 p-2 rounded-lg w-1/2 items-center"
                  onPress={() => handleReturnItem(pickupOrder)}
                >
                  <Text className="text-white">Return Item</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="mt-2 border-t border-gray-300 pt-2">
              <Text className="text-md font-semibold text-gray-800">Items:</Text>
              {pickupOrder.items.length > 0 ? (
                pickupOrder.items.map(item => (
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

      {/* Confirmation Modal for pickup */}
      <Modal
        visible={confirmationVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setConfirmationVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg">
            <Text className="text-lg font-semibold mb-4">Confirm Pickup</Text>
            <Text>Have you picked up your order?</Text>
            <View className="flex-row justify-end mt-4">
              <TouchableOpacity
                className="bg-green-500 p-2 rounded-lg mr-2"
                onPress={handleConfirmedPickup}
              >
                <Text className="text-white">Yes, I Picked Up</Text>
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

      {/* Return Item Modal */}
      <Modal
        visible={returnDetailsVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setReturnDetailsVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg">
            <Text className="text-lg font-semibold mb-4">Return Item</Text>
            <Text>Why do you want to return the item?</Text>
            <TextInput
              className="border border-gray-300 p-2 rounded-lg mt-2"
              placeholder="Enter reason for return"
              value={returnReason}
              onChangeText={setReturnReason}
            />
            <View className="flex-row justify-end mt-4">
              <TouchableOpacity
                className="bg-red-500 p-2 rounded-lg mr-2"
                onPress={submitReturnReason}
              >
                <Text className="text-white">Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-gray-300 p-2 rounded-lg"
                onPress={() => setReturnDetailsVisible(false)}
              >
                <Text className="text-black">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Alert Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={alertVisible}
        onRequestClose={() => setAlertVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 bg-opacity-50">
          <View className="bg-white p-6 rounded-lg shadow-lg w-3/4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">{alertMessage}</Text>
            <TouchableOpacity
              className="mt-4 p-2 bg-[#00B251] rounded-lg flex-row justify-center items-center"
              onPress={() => setAlertVisible(false)}
            >
              <Ionicons name="checkmark-circle-outline" size={24} color="white" />
              <Text className="text-lg text-white ml-2">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PickupScreen;
