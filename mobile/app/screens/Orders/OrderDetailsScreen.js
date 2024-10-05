import React from "react";
import { SafeAreaView, View, Text, Image } from "react-native";

function OrderDetailsScreen({ route }) {
  const { item } = route.params;

  const productName = item.product_name || "Product Name";
  const shopName = item.orig_prod_shop_name || "Shop Name";
  const pricePerQuantity = item.price_per_quantity || "0.00";
  const quantityBought = item.quantity || "0";
  const totalPrice = (pricePerQuantity * quantityBought).toFixed(2); // Calculate total price
  const description = item.description || "Description not available."; // Product description

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-800">{productName}</Text>
        <Text className="text-md text-gray-600">{shopName}</Text>
        <Image
          source={{ uri: item.image_url }} // Assuming image_url is part of item
          className="h-48 w-full rounded-lg mt-4"
          resizeMode="cover"
        />
        <View className="mt-4">
          <Text className="text-lg font-semibold text-gray-800">Details</Text>
          <Text className="text-sm text-gray-600 mt-2">{description}</Text>
        </View>
        <View className="mt-4 flex-row justify-between border-t border-gray-300 pt-4">
          <View>
            <Text className="text-sm text-gray-600">Price per Quantity:</Text>
            <Text className="text-lg font-semibold text-gray-800">₱{pricePerQuantity}</Text>
          </View>
          <View>
            <Text className="text-sm text-gray-600">Quantity Bought:</Text>
            <Text className="text-lg font-semibold text-gray-800">{quantityBought}</Text>
          </View>
        </View>
        <View className="mt-4 border-t border-gray-300 pt-4">
          <Text className="text-sm text-gray-600">Total Price:</Text>
          <Text className="text-lg font-semibold text-gray-800">₱{totalPrice}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default OrderDetailsScreen;
