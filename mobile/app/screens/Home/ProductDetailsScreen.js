import React, { useState } from "react";
import { View, Image, Text, ScrollView, TouchableOpacity, Modal, Pressable } from "react-native";
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icons
import { styled } from "nativewind";
import placeholderimg from '../../assets/placeholder.png'; // Import the placeholder image
import { NotificationIcon, MessagesIcon, MarketIcon } from "../../components/SearchBarC"; // Import your custom icons

function ProductDetailsScreen({ navigation, route }) {
  const { product } = route.params; // Receive the product data
  const [quantity, setQuantity] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false); // For image full-view modal

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

  const handleAddToCart = () => {
    navigation.navigate("Cart", { product });
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

      {/* Sticky Bottom Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-[#00B251] flex-row" style={{ height: 50 }}>
        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center"
          onPress={handleMessagePress}
          style={{ paddingVertical: 5 }}
        >
          <FontAwesome name="envelope" size={25} color="white" />
          <Text className="text-white font-bold text-lg ml-3">Message</Text>
        </TouchableOpacity>

        {/* Separator */}
        <View className="w-px bg-white" />

        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center"
          onPress={handleNegotiatePress}
          style={{ paddingVertical: 5 }}
        >
          <FontAwesome name="balance-scale" size={25} color="white" />
          <Text className="text-white font-bold text-lg ml-3">Negotiate</Text>
        </TouchableOpacity>

        {/* Separator */}
        <View className="w-px bg-white" />

        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center"
          onPress={handleAddToCart}
          style={{ paddingVertical: 5 }}
        >
          <FontAwesome name="shopping-cart" size={25} color="white" />
          <Text className="text-white font-bold text-lg ml-3">Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default styled(ProductDetailsScreen);
