import React, { useState } from "react";
import { View, Image, Text, ScrollView, TouchableOpacity } from "react-native";
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icons
import { styled } from "nativewind";

function ProductDetailsScreen({ navigation, route }) {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  return (
    <ScrollView className="flex-1 bg-white p-2.5">
      <Image source={product.image} className="w-full h-50 rounded-lg mb-2.5" />
      <View className="px-2.5">
        <View className="flex-row justify-between items-center mb-2.5">
          <Text className="text-xl font-bold">{product.title}</Text>
          <Text className="text-lg text-[#00B251] font-bold">₱ {product.price}</Text>
        </View>
        <Text className="text-base text-[#00B251] mb-2.5 font-bold">Available in stock</Text>
        <View className="flex-row justify-between items-center mb-2.5">
          <Text className="text-base text-gray-700">⭐ {product.rating} (192)</Text>
          <View className="flex-row items-center">
            <TouchableOpacity className="bg-[#00B251] p-2.5 rounded-lg" onPress={decreaseQuantity}>
              <Text className="text-lg font-bold text-white">-</Text>
            </TouchableOpacity>
            <Text className="text-lg mx-2.5">{quantity} pcs</Text>
            <TouchableOpacity className="bg-[#00B251] p-2.5 rounded-lg" onPress={increaseQuantity}>
              <Text className="text-lg font-bold text-white">+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text className="text-lg font-bold mb-2.5">Description</Text>
        <Text className="text-base text-gray-700 mb-5">{product.description}</Text>

        {/* New Buttons */}
        <View className="flex-row justify-between mb-5">
          <TouchableOpacity className="bg-[#00B251] p-3.5 rounded-lg items-center flex-1 mr-2.5 flex-row justify-center"
          onPress={() => navigation.navigate('Seller Shop', {product})}
          >
            <FontAwesome name="shopping-bag" size={20} color="white" className="mr-2" />
            <Text className="text-gray-700 font-bold text-base"></Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-[#00B251] p-3.5 rounded-lg items-center flex-1 mr-2.5 flex-row justify-center"
            onPress={() => navigation.navigate("Negotiate To Seller", {product})}
          >
            <FontAwesome name="balance-scale" size={20} color="white" className="mr-2" />
            <Text className="text-white font-bold text-base"></Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-[#00B251] p-3.5 rounded-lg items-center flex-1 flex-row justify-center"
            onPress={() => navigation.navigate("Message Seller", {product})}
          >
            <FontAwesome name="envelope" size={20} color="white" className="mr-2" />
            <Text className="text-white font-bold text-base"></Text>
          </TouchableOpacity>
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
        <TouchableOpacity className="bg-[#00B251] p-3.5 rounded-lg items-center mb-5" onPress={() => navigation.navigate("Cart")}>
          <Text className="text-white font-bold text-base">Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default styled(ProductDetailsScreen);
