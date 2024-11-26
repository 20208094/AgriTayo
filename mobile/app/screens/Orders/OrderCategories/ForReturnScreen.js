import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Modal, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from '@env';

const ForReturnScreen = ({ orders, orderProducts }) => {
  const [forReturnOrders, setForReturnOrders] = useState([]);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [proceedToRateOrder, setProceedToRateOrder] = useState(null); // For tracking the order for rating confirmation
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

  // Assemble orders that are "For Return"
  const assembleForReturnOrders = () => {
    if (orders.length > 0 && orderProducts.length > 0) {
      const itemsWithOrders = orders
        .filter(order => order.status_id === 5) // Assuming status_id 5 means "For Return"
        .map(order => {
          const items = orderProducts.filter(product => product.order_id === order.order_id);
          return { ...order, items };
        });
      setForReturnOrders(itemsWithOrders);
    }
  };

  useEffect(() => {
    assembleForReturnOrders();
  }, [orders, orderProducts]);

  const handleConfirmReturn = async (order) => {
    setSelectedOrder(order);
    setConfirmationVisible(true);
  };

  const handleConfirmedReturn = async () => {
    if (selectedOrder) {
      let updatedOrder = { ...selectedOrder, buyer_is_received: true };
      await handleUpdateOrder(updatedOrder, () => {
        setConfirmationVisible(false);
      });
    }
  };

  const handleUpdateOrder = async (order, onSuccess) => {
    if (order) {
      const bodyData = {
        status_id: order.status_id,
        allow_return: order.allow_return,
        buyer_is_received: order.buyer_is_received,
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

  const handleProceedToRate = (order) => {
    setProceedToRateOrder(order); // Set the selected order for rating
    setConfirmationVisible(true); // Show confirmation modal
  };

  const handleConfirmedProceedToRate = async () => {
    setConfirmationVisible(false);
    if (proceedToRateOrder) {
      let updatedOrder = { ...proceedToRateOrder, status_id: 7 }; // Update status_id to 7
      await handleUpdateOrder(updatedOrder, () => {
        navigation.navigate("Orders", { screen: "To Rate" }); // Navigate to the To Rate screen
      });
    } else {
      console.error("proceedToRateOrder is undefined");
    }
  };

  if (forReturnOrders.length === 0) {
    return (
      <SafeAreaView>
        <Text className="text-center text-gray-600">No orders for return found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-gray-100">
      <ScrollView className="p-5">
        {forReturnOrders.map((forReturnOrder) => (
          <View key={forReturnOrder.order_id} className="p-4 mb-6 bg-white border border-[#00B251] rounded-lg shadow-md">
            <View className="flex-row items-center mb-2">
              <Ionicons name="return-up-back-outline" size={24} color="#FF5B5B" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">For Return</Text>
            </View>
            <Text className="text-md text-gray-600">Order placed on: {formatDate(forReturnOrder.order_date)} at {formatTime(forReturnOrder.order_date)}</Text>
            <Text className="text-md text-gray-600 mt-1">Reason for return:  
              <Text className="text-md text-red-600 mt-1 ml-1/4"> {forReturnOrder.return_reason}</Text>
            </Text>

            {/* Conditional rendering based on allow_return and buyer_return_is_received */}
            {forReturnOrder.allow_return === null && (
              <Text className="text-sm text-green-700 mt-1">
                Waiting for the seller to confirm if they want to allow the return.
              </Text>
            )}

            {forReturnOrder.allow_return === false && (
              <View className="mt-4">
                <Text className="text-sm text-red-600">
                  Seller did not allow the return for this product.
                </Text>
                <TouchableOpacity
                  className="bg-[#00B251] p-2 rounded-lg mt-2"
                  onPress={() => handleProceedToRate(forReturnOrder)} // Proceed to rate order
                >
                  <Text className="text-white text-center">Proceed to rate the product</Text>
                </TouchableOpacity>
              </View>
            )}

            {forReturnOrder.allow_return === true && (
              <View className="mt-4">
                {forReturnOrder.buyer_is_received === false ? (
                  <>
                    <Text className="text-sm text-red-600">
                      Have you returned the item to the seller?
                    </Text>
                    <TouchableOpacity
                      className="bg-[#00B251] p-2 rounded-lg mt-2"
                      onPress={() => handleConfirmReturn(forReturnOrder)}
                    >
                      <Text className="text-white text-center">Yes</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <Text className="text-sm text-green-700 mt-2">
                    Please wait for the seller to confirm if they already received the returned item.
                  </Text>
                )}
              </View>
            )}

            <View className="mt-2 border-t border-gray-300 pt-2">
              <Text className="text-md font-semibold text-gray-800">Items:</Text>
              {forReturnOrder.items.length > 0 ? (
                forReturnOrder.items.map(item => (
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

      {/* Confirmation Modal for return */}
      <Modal
        visible={confirmationVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setConfirmationVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg">
            <Text className="text-lg font-semibold mb-4">Confirm Action</Text>
            <Text>Are you sure you want to proceed to rate this product?</Text>
            <View className="flex-row justify-end mt-4">
              <TouchableOpacity
                className="bg-green-500 p-2 rounded-lg mr-2"
                onPress={handleConfirmedProceedToRate} // Confirm proceeding to rate
              >
                <Text className="text-white">Yes, Proceed</Text>
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
      {/* Alert Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={alertVisible}
        onRequestClose={() => setAlertVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
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

export default ForReturnScreen;
