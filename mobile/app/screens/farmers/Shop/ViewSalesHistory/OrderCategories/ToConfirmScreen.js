import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Modal, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from '@env';

const ToConfirmScreen = ({ orders, orderProducts }) => {
  const [toConfirmOrders, setToConfirmOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [rejectReasonVisible, setRejectReasonVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
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

  const handleAcceptOrder = (order) => {
    setSelectedOrder(order);
    setConfirmationVisible(true); // Show confirmation modal
  };

  const confirmAcceptOrder = () => {
    handleUpdateOrder({ ...selectedOrder, status_id: 2 }, () => {
      setConfirmationVisible(false);
      navigation.navigate("Sales History", { screen: "Preparing" });
    });
  };

  const handleRejectOrder = (order) => {
    setSelectedOrder(order);
    setRejectReasonVisible(true);
  };

  const submitRejectOrder = () => {
    if (rejectReason.trim() === "") {
      setAlertMessage("Please enter a rejection reason.");
      setAlertVisible(true);
      return;
    }
    const updatedOrder = { ...selectedOrder, status_id: 9, reject_reason: rejectReason };
    handleUpdateOrder(updatedOrder, () => {
      setRejectReasonVisible(false);
      setRejectReason("");
      navigation.navigate("Sales History", { screen: "Rejected" });
    });
  };

  const handleUpdateOrder = async (order, onSuccess) => {
    if (order) {
      const bodyData = {
        status_id: order.status_id,
        seller_is_received: order.seller_is_received,
        buyer_is_received: order.buyer_is_received,
        allow_return: order.allow_return,
        reject_reason: order.reject_reason,  // Added reject reason
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
        }
      } catch (error) {
        console.error('Error updating order:', error);
      }
    }
  };

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
            <Text className="text-md text-gray-600">Delivery Method: {toConfirmOrder.delivery_method}</Text>

            {/* New Section: Confirmation message and buttons */}
            <View className="mt-4">
              <Text className="text-md text-gray-800">Do you want to accept this order?</Text>
              <View className="flex-row mt-2">
                <TouchableOpacity
                  className="bg-[#00B251] p-2 rounded-lg mr-2 w-1/2 items-center"
                  onPress={() => handleAcceptOrder(toConfirmOrder)}
                >
                  <Text className="text-white">Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-red-600 p-2 rounded-lg w-1/2 items-center"
                  onPress={() => handleRejectOrder(toConfirmOrder)}
                >
                  <Text className="text-white">Reject</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Items Section */}
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

      {/* Confirmation Modal for Accepting Order */}
      <Modal
        visible={confirmationVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setConfirmationVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg">
            <Text className="text-lg font-semibold mb-4">Confirm Accept</Text>
            <Text>Are you sure you want to accept this order?</Text>
            <View className="flex-row justify-end mt-4">
              <TouchableOpacity
                className="bg-[#00B251] p-2 rounded-lg mr-2"
                onPress={confirmAcceptOrder}
              >
                <Text className="text-white">Yes, Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-gray-300 p-2 rounded-lg"
                onPress={() => setConfirmationVisible(false)}
              >
                <Text className="text-gray-800">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Rejection Reason Modal */}
      <Modal
        visible={rejectReasonVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setRejectReasonVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg">
            <Text className="text-lg font-semibold mb-4">Reject Order</Text>
            <Text>Why are you rejecting this order?</Text>
            <TextInput
              className="border border-gray-300 p-2 mt-2 rounded-lg w-full"
              placeholder="Enter reason for rejection"
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
                onPress={() => setRejectReasonVisible(false)}
              >
                <Text className="text-gray-800">Cancel</Text>
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

export default ToConfirmScreen;
