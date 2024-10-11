import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from '@env';

const ForReturnScreen = ({ orders, orderProducts }) => {
  const [forReturnOrders, setForReturnOrders] = useState([]);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [receivedConfirmationVisible, setReceivedConfirmationVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionType, setActionType] = useState(null); // To determine if we are accepting or rejecting a return

  const navigation = useNavigation();

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const options = { hour: "2-digit", minute: "2-digit", hour12: true };
    return date.toLocaleTimeString(undefined, options);
  };

  // Assemble orders that are "For Return"
  const assembleForReturnOrders = () => {
    if (orders.length > 0 && orderProducts.length > 0) {
      const itemsWithOrders = orders
        .filter((order) => order.status_id === 5) // Assuming status_id 5 means "For Return"
        .map((order) => {
          const items = orderProducts.filter(
            (product) => product.order_id === order.order_id
          );
          return { ...order, items };
        });
      setForReturnOrders(itemsWithOrders);
    }
  };

  useEffect(() => {
    assembleForReturnOrders();
  }, [orders, orderProducts]);

  const handleConfirmReturn = (order, action) => {
    setSelectedOrder(order);
    setActionType(action); // Set the action type (accept/reject)
    setConfirmationVisible(true); // Show confirmation modal
  };

  const handleConfirmReceipt = (order) => {
    setSelectedOrder(order);
    setReceivedConfirmationVisible(true);
  };

  const handleUpdateOrder = async (order, onSuccess) => {
    if (order) {
      const bodyData = {
        status_id: order.status_id,
        allow_return: order.allow_return,
        buyer_is_received: order.buyer_is_received,
      };

      try {
        const response = await fetch(
          `${REACT_NATIVE_API_BASE_URL}/api/orderStatus/${order.order_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": REACT_NATIVE_API_KEY,
            },
            body: JSON.stringify(bodyData),
          }
        );

        if (response.ok) {
          if (onSuccess) {
            onSuccess();
          }
        } else {
          console.error("Failed to update order:", response.statusText);
          Alert.alert("Error", "Failed to update order. Please try again.");
        }
      } catch (error) {
        console.error("Error updating order:", error);
        Alert.alert("Error", "Network request failed. Please check your connection.");
      }
    } else {
      Alert.alert("Error", "Order data is required for the update.");
    }
  };

  const handleConfirmedReturn = async (accept) => {
    setConfirmationVisible(false);
    if (selectedOrder) {
      let updatedOrder = { ...selectedOrder };
      updatedOrder.allow_return = accept;

      await handleUpdateOrder(updatedOrder, () => {
        // Optionally navigate or show success message
        Alert.alert("Success", `Return has been ${accept ? "accepted" : "rejected"}.`);
        assembleForReturnOrders(); // Refresh the orders
      });
    } else {
      console.error("selectedOrder is undefined");
    }
  };

  const handleReceivedItem = async () => {
    setReceivedConfirmationVisible(false);
    if (selectedOrder) {
      let updatedOrder = { ...selectedOrder, status_id: 6 };
      
      await handleUpdateOrder(updatedOrder, () => {
        Alert.alert("Success", "The item has been marked as received.");
        navigation.navigate("Sales History", { screen: "Returned" });
      });
    } else {
      console.error("selectedOrder is undefined");
    }
  };

  if (forReturnOrders.length === 0) {
    return (
      <SafeAreaView>
        <Text className="text-center text-gray-600">
          No orders for return found.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-gray-100">
      <ScrollView className="p-5">
        {forReturnOrders.map((forReturnOrder) => (
          <View
            key={forReturnOrder.order_id}
            className="p-4 mb-4 bg-white border border-[#00B251] rounded-lg shadow-md"
          >
            <View className="flex-row items-center mb-2">
              <Ionicons
                name="return-up-back-outline"
                size={24}
                color="#FF5B5B"
              />
              <Text className="text-lg font-semibold text-gray-800 ml-2">
                For Return
              </Text>
            </View>
            <Text className="text-md text-gray-600">
              Order placed on: {formatDate(forReturnOrder.order_date)} at {formatTime(forReturnOrder.order_date)}
            </Text>
            <Text className="text-md text-gray-600 mt-1">
              Reason for return:
              <Text className="text-md text-red-600 mt-1 ml-1/4">
                {" "}{forReturnOrder.return_reason}
              </Text>
            </Text>
            {/* Conditional rendering based on allow_return and buyer_return_is_received */}
            {forReturnOrder.allow_return === null && (
              <View className="mt-4">
                <Text className="text-md text-gray-800">
                  Buyer wants to return the order. Do you accept it?
                </Text>
                <TouchableOpacity
                  className="bg-green-500 p-2 rounded-lg mt-2"
                  onPress={() => handleConfirmReturn(forReturnOrder, true)} // Accept the return
                >
                  <Text className="text-white text-center">Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-red-500 p-2 rounded-lg mt-2"
                  onPress={() => handleConfirmReturn(forReturnOrder, false)} // Reject the return
                >
                  <Text className="text-white text-center">No</Text>
                </TouchableOpacity>
              </View>
            )}

            {forReturnOrder.allow_return === false && (
              <Text className="text-sm text-red-600 mt-4">
                Waiting for the buyer to rate the product.
              </Text>
            )}

            {forReturnOrder.allow_return === true && (
              <View className="mt-4">
                {forReturnOrder.buyer_is_received === false ? (
                  <>
                    <Text className="text-md text-gray-800">
                      Have you received the returned item?
                    </Text>
                    <TouchableOpacity
                      className="bg-green-500 p-2 rounded-lg mt-2"
                      onPress={() => handleConfirmReceipt(forReturnOrder)} // Open confirmation modal for received item
                    >
                      <Text className="text-white text-center">Yes</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                  <Text className="text-sm text-green-700 mt-2">
                    Buyer said they already returned the item. Please confirm the receipt.
                  </Text>
                    <Text className="text-md text-gray-800">
                      Have you received the returned item?
                    </Text>
                    <TouchableOpacity
                      className="bg-green-500 p-2 rounded-lg mt-2"
                      onPress={() => handleConfirmReceipt(forReturnOrder)} // Open confirmation modal for received item
                    >
                      <Text className="text-white text-center">Yes</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}

            <View className="mt-2 border-t border-gray-300 pt-2">
              <Text className="text-md font-semibold text-gray-800">Items:</Text>
              {forReturnOrder.items.length > 0 ? (
                forReturnOrder.items.map((item) => (
                  <TouchableOpacity
                    key={item.order_prod_id}
                    className="bg-gray-50 p-4 mb-2 rounded-lg shadow-sm flex-row items-center"
                    onPress={() => navigation.navigate("Order Details", { item })}
                  >
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-800">
                        Item Name: {item.item_name}
                      </Text>
                      <View className="flex-row mt-2">
                        <Text className="w-1/3 text-sm text-gray-600">Total Quantity:</Text>
                        <Text className="text-sm text-gray-600">
                          {item.order_prod_total_weight} {item.orig_prod_metric_symbol}
                        </Text>
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

      {/* Confirmation Modal for return action */}
      <Modal
        visible={confirmationVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setConfirmationVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg">
            <Text className="text-lg font-semibold mb-4">
              Confirm {actionType ? "Accept" : "Reject"} Return
            </Text>
            <Text>
              Are you sure you want to {actionType ? "accept" : "reject"} the return?
            </Text>
            <View className="flex-row justify-end mt-4">
              <TouchableOpacity
                className="bg-green-500 p-2 rounded-lg mr-2"
                onPress={() => handleConfirmedReturn(actionType)} // Confirm action
              >
                <Text className="text-white">
                  Yes, {actionType ? "Accept" : "Reject"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-gray-300 p-2 rounded-lg"
                onPress={() => setConfirmationVisible(false)} // Cancel action
              >
                <Text className="text-black">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal for received item */}
      <Modal
        visible={receivedConfirmationVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setReceivedConfirmationVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg">
            <Text className="text-lg font-semibold mb-4">
              Confirm Receipt of Returned Item
            </Text>
            <Text>
              Are you sure you have received the returned item?
            </Text>
            <View className="flex-row justify-end mt-4">
              <TouchableOpacity
                className="bg-green-500 p-2 rounded-lg mr-2"
                onPress={handleReceivedItem}
              >
                <Text className="text-white">Yes, Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-gray-300 p-2 rounded-lg"
                onPress={() => setReceivedConfirmationVisible(false)} // Cancel action
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

export default ForReturnScreen;
