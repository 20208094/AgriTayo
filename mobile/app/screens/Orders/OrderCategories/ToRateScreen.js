import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Modal, TextInput, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Slider from '@react-native-community/slider'; // Import the slider component
import * as ImagePicker from 'expo-image-picker'; // Import the Expo Image Picker
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env"; // Import environment variables

const ToRateScreen = ({ orders, orderProducts }) => {
  const [toRateOrders, setToRateOrders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

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

  const handleRateProduct = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const submitRating = async () => {
    if (!selectedItem || !rating) {
        setAlertMessage("Please provide a rating");
        setAlertVisible(true);
        return;
    }

    try {
        // First submit the rating
        const ratingResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/shopRate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': REACT_NATIVE_API_KEY,
            },
            body: JSON.stringify({
                shop_id: selectedItem.orig_prod_shop_id,
                order_id: selectedItem.order_id,
                ratings: rating,
                review: reviewText,
                shop_rating: rating,
                shop_total_rating: rating
            }),
        });

        if (!ratingResponse.ok) {
            const errorData = await ratingResponse.json();
            throw new Error(errorData.error || 'Failed to submit rating');
        }

        // Then update the order status to completed (status_id: 8)
        const statusResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/orderStatus/${selectedItem.order_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': REACT_NATIVE_API_KEY,
            },
            body: JSON.stringify({
                status_id: 8, // Update to completed status
                completed_date: new Date().toISOString()
            }),
        });

        if (!statusResponse.ok) {
            throw new Error('Failed to update order status');
        }

        // Show success message
        setAlertMessage("Rating submitted successfully!");
        setAlertVisible(true);
        
        // Reset state after submission
        setRating(0);
        setReviewText('');
        setModalVisible(false);
        
        // Navigate to Completed screen
        navigation.navigate("Orders", { screen: "Completed" });
        
    } catch (error) {
        console.error("Error submitting rating:", error);
        setAlertMessage(error.message || "Failed to submit rating");
        setAlertVisible(true);
    }
  };

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
          <View key={toRateOrder.order_id} className="p-4 mb-6 bg-white border border-[#00B251] rounded-lg shadow-md">
            <View className="flex-row items-center mb-2">
              <Ionicons name="star-outline" size={24} color="#FFD700" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">Rate The Shop</Text>
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
                    <TouchableOpacity
                      className="bg-[#00B251] p-2 rounded-lg mt-2"
                      onPress={() => handleRateProduct(item)}
                    >
                      <Text className="text-white text-center">Rate Shop</Text>
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

      {/* Rating Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-11/12 max-w-md shadow-lg">
            <Text className="text-lg font-bold mb-4 text-center text-[#00B251]">
              Rate The Shop
            </Text>
            <Text className="text-md font-semibold">Rating:</Text>
            <Slider
              minimumValue={0}
              maximumValue={5}
              step={1}
              value={rating}
              onValueChange={(value) => setRating(value)}
              style={{ marginVertical: 10 }}
            />
            <Text className="text-md font-semibold text-center">Your Rating: {rating}</Text>
            <Text className="mt-4 text-md font-semibold">Review:</Text>
            <TextInput
              multiline
              numberOfLines={4}
              placeholder="Write your review here..."
              value={reviewText}
              onChangeText={setReviewText}
              className="border border-gray-300 rounded p-2 mb-4"
              style={{ height: 80 }} // Set a fixed height for better appearance
            />
            <View className="flex-row justify-end mt-4">
              <TouchableOpacity
                className="bg-green-500 p-2 rounded-lg mr-2"
                onPress={submitRating}
              >
                <Text className="text-white font-semibold">Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-gray-300 p-2 rounded-lg"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-black font-semibold">Cancel</Text>
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

export default ToRateScreen;
