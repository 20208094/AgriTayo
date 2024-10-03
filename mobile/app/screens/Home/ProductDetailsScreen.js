import React, { useState } from "react";
import { View, Image, Text, ScrollView, TouchableOpacity, Modal, Pressable } from "react-native";
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icons
import { styled } from "nativewind";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import placeholderimg from '../../assets/placeholder.png'; // Import the placeholder image
import { NotificationIcon, MessagesIcon, MarketIcon } from "../../components/SearchBarC"; // Import your custom icons
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";

function ProductDetailsScreen({ navigation, route }) {
  const { product } = route.params; // Receive the product data
  const [quantity, setQuantity] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userData, setUserData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAsyncUserData = async () => {
    setLoading(true); // Set loading to true before starting data fetching
    try {
      const storedData = await AsyncStorage.getItem('userData');

      if (storedData) {
        const parsedData = JSON.parse(storedData); // Parse storedData

        if (Array.isArray(parsedData)) {
          const user = parsedData[0];  // Assuming user data is the first element of the array
          setUserData(user); // Set userData state to the user object
          setUserId(user.user_id); // Set userId
        } else {
          setUserData(parsedData); // If it's not an array, directly set parsed data
          setUserId(parsedData.user_id); // Ensure userId is set if available
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getAsyncUserData();
    }, [])
  );

  const shopInfo = product.seller || {
    shopName: 'Unknown Shop',
    shop_image_url: null, // Default to null if no image is provided
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", marginRight: 15 }}>
          <MarketIcon onPress={() => navigation.navigate("CartScreen")} />
          <NotificationIcon onPress={() => navigation.navigate("Notifications")} />
          <MessagesIcon onPress={() => navigation.navigate("ChatListScreen")} />
        </View>
      ),
    });
  }, [navigation]);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const handleShopPress = () => {
    if (shopInfo.shopName !== 'Unknown Shop') {
      navigation.navigate('Seller Shop', { product });
    } else {
      alert("No seller information available for this product.");
    }
  };

  const handleNegotiatePress = () => {
    navigation.navigate('Buyer Negotiation');
  };

  const handleMessagePress = () => {
    navigation.navigate('Message Seller', { product });
  };

  const handleAddToCart = async () => {
    const cart_total_price = quantity * product.crop_price;
    const cart_total_quantity = quantity;
    const cart_user_id = userId;
    const cart_crop_id = product.crop_id;
    const cart_metric_system_id = product.metric_system_id;
  
    const formData = {
      cart_total_price,
      cart_total_quantity,
      cart_user_id,
      cart_crop_id,
      cart_metric_system_id,
    };
  
    try {
      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/carts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': REACT_NATIVE_API_KEY, 
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }
  
      navigation.navigate('CartScreen');
  
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };
  

  // Toggle Modal visibility
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View className="flex-1">
      {/* Main content area */}
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }} className="bg-white p-2.5">
        {/* Modal for full image view */}
        <Modal visible={isModalVisible} transparent={true} animationType="fade">
          <Pressable className="flex-1 bg-black bg-opacity-90 justify-center items-center" onPress={toggleModal}>
            <Image
              source={product.crop_image_url ? { uri: product.crop_image_url } : placeholderimg}
              className="w-full h-full"
              resizeMode="contain"
            />
          </Pressable>
        </Modal>

        {/* Main product image with click-to-open functionality */}
        <TouchableOpacity onPress={toggleModal}>
          <Image
            source={product.crop_image_url ? { uri: product.crop_image_url } : placeholderimg}
            className="w-full h-80 rounded-lg mb-2.5"
          />
        </TouchableOpacity>

        <View className="px-2.5">
          <View className="flex-row justify-between items-center mb-2.5">
            <Text className="text-xl font-bold">{product.crop_name}</Text>
            <Text className="text-lg text-[#00B251] font-bold">₱ {product.crop_price}</Text>
          </View>
          <Text className="text-base text-[#00B251] mb-2.5 font-bold">Available in stock</Text>
          <View className="flex-row justify-between items-center mb-2.5">
            <Text className="text-base text-gray-700">⭐ {product.crop_rating} (192)</Text>
            <View className="flex-row items-center mb-2.5">
              <TouchableOpacity
                className="border border-green-600 bg-white p-2.5 rounded-lg"
                onPress={decreaseQuantity}
              >
                <Text className="text-lg font-bold text-green-600">-</Text>
              </TouchableOpacity>
              <Text className="text-lg mx-2.5">{quantity} pcs</Text>
              <TouchableOpacity
                className="border border-green-600 bg-white p-2.5 rounded-lg"
                onPress={increaseQuantity}
              >
                <Text className="text-lg font-bold text-green-600">+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text className="text-lg font-bold mb-2.5">Description</Text>
          <Text className="text-base text-gray-700 mb-5">{product.crop_description}</Text>

          <View className="border border-green-600 flex-row items-center justify-between border p-3 rounded-lg mb-5">
            <View className="flex-row items-center">
              <TouchableOpacity onPress={handleShopPress}>
                <Image
                  source={shopInfo.shop_image_url ? { uri: shopInfo.shop_image_url } : placeholderimg}
                  className="w-20 h-20 rounded-full"
                  resizeMode="cover"
                />
              </TouchableOpacity>
              <View className="ml-3">
                <TouchableOpacity onPress={handleShopPress}>
                  <Text className="text-lg font-bold">{shopInfo.shopName}</Text>
                </TouchableOpacity>
                <Text className="text-gray-500 text-sm">Active 3 Minutes Ago</Text>
              </View>
            </View>

            <View className="flex grid grid-cols-1 grid-rows-2 gap-4 ">
              <TouchableOpacity
                className="border border-green-600 bg-white px-3 py-1 rounded-md items-center flex-row justify-center mr-2"
                onPress={handleNegotiatePress}
              >
                <FontAwesome name="balance-scale" size={16} color="#00B251" />
                <Text className="text-green-600 font-bold text-base ml-2">Negotiate</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="border border-green-600 bg-white px-3 py-1 rounded-md items-center flex-row justify-center mr-2"
                onPress={handleMessagePress}
              >
                <FontAwesome name="envelope" size={16} color="#00B251" />
                <Text className="text-green-600 font-bold text-base ml-2">Message</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mb-5">
            <Text className="text-lg font-bold mb-2.5">Related Products</Text>
            {/* Add related product items here */}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5">
            {/* Replace with dynamic image items */}
            <View className="h-50 w-40 bg-gray-200 justify-center items-center rounded-lg mr-2.5">
              <Text className="text-gray-400 text-lg">Your Image Here</Text>
            </View>
            <View className="h-50 w-40 bg-gray-200 justify-center items-center rounded-lg mr-2.5">
              <Text className="text-gray-400 text-lg">Your Image Here</Text>
            </View>
            <View className="h-50 w-40 bg-gray-200 justify-center items-center rounded-lg mr-2.5">
              <Text className="text-gray-400 text-lg">Your Image Here</Text>
            </View>
            <View className="h-50 w-40 bg-gray-200 justify-center items-center rounded-lg mr-2.5">
              <Text className="text-gray-400 text-lg">Your Image Here</Text>
            </View>
            {/* Add more placeholder items as needed */}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Enhanced Sticky Bottom Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white flex-row" style={{ height: 60 }}>
        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center border border-green-600 "
          onPress={handleMessagePress}
          style={{ paddingVertical: 10, minWidth: 50 }}
        >
          <FontAwesome name="envelope" size={24} color="#00B251" />
          <Text className="text-[#00B251] font-bold text-lg ml-1.5">Message</Text>
        </TouchableOpacity>

        {/* Separator */}
        <View className="w-0.5 bg-white" />

        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center border border-green-600"
          onPress={handleNegotiatePress}
          style={{ paddingVertical: 10, minWidth: 50 }}
        >
          <FontAwesome name="balance-scale" size={24} color="#00B251" />
          <Text className="text-[#00B251] font-bold text-lg ml-1.5">Negotiate</Text>
        </TouchableOpacity>

        {/* Separator */}
        <View className="w-0.5 bg-white" />

        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center border border-green-600 bg-green-600"
          onPress={handleAddToCart}
          style={{ paddingVertical: 10, minWidth: 200 }}
        >
          <FontAwesome name="shopping-cart" size={24} color="white" />
          <Text className="text-white font-bold text-lg ml-2.5">Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default styled(ProductDetailsScreen);
