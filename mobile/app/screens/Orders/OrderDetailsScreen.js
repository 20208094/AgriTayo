import React from "react";
import { SafeAreaView, View, Text, Image } from "react-native";

function OrderDetailsScreen({ route }) {
  const { item } = route.params;

  const productName = item.orig_prod_name || "Product Name";
  const shopName = item.orig_prod_shop_name || "Shop Name";
  const pricePerQuantity = item.orig_prod_price || "0.00";
  const quantity = item.order_prod_total_weight || "0";
  const metricSymbol = item.orig_prod_metric_symbol || "";
  const totalPrice = item.order_prod_total_price || "0.00";
  const description =
    item.orig_prod_description || "Description not available.";
  const imageUrl = item.orig_prod_image_url || null;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="h-[10%] bg-gradient-to-b from-[#00B251]/90 to-[#00B251]/70 rounded-b-[35px]">
        <View className="px-6 pt-6 pb-4">
          <Text className="text-sm text-white/80 mb-1">Product Details</Text>
          <Text className="text-2xl font-bold text-white" numberOfLines={2}>
            {productName}
          </Text>
          <Text className="text-base text-white/90 mt-2">{shopName}</Text>
        </View>
      </View>

      <View className="flex-1 px-6">
        {imageUrl && (
          <View className="items-center -mt-16 mb-6">
            <View className="bg-white p-3 rounded-2xl shadow-xl">
              <Image
                source={{ uri: imageUrl }}
                className="h-56 w-56 rounded-xl"
                resizeMode="cover"
              />
            </View>
            <Text className="text-xl font-bold text-gray-800 mt-4 text-center">
              {productName}
            </Text>
            <Text className="text-base text-gray-600 mt-1 text-center">
              {shopName}
            </Text>
          </View>
        )}

        <View className="bg-white rounded-3xl shadow-md border border-gray-100 p-5 mb-4">
          <View className="flex-row items-center mb-3">
            <View className="w-1 h-5 bg-[#00B251] rounded-full mr-3" />
            <Text className="text-lg font-semibold text-gray-800">
              Description
            </Text>
          </View>
          <Text className="text-gray-600 leading-relaxed" numberOfLines={3}>
            {description}
          </Text>
        </View>

        <View className="flex-row space-x-4 mb-4">
          <View className="flex-1 bg-gray-50 rounded-2xl p-4">
            <Text className="text-sm text-gray-500 mb-1">Price per Unit</Text>
            <Text className="text-xl font-bold text-[#00B251]">
              ₱{pricePerQuantity} {metricSymbol}
            </Text>
          </View>
          <View className="flex-1 bg-gray-50 rounded-2xl p-4">
            <Text className="text-sm text-gray-500 mb-1">Quantity</Text>
            <Text className="text-xl font-bold text-gray-800">
              {quantity} {metricSymbol}
            </Text>
          </View>
        </View>

        <View className="bg-[#00B251]/10 rounded-2xl p-5">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-sm text-gray-600 mb-1">Total Amount</Text>
              <Text className="text-3xl font-bold text-[#00B251]">
                ₱{totalPrice}
              </Text>
            </View>
            <View className="bg-[#00B251] px-4 py-2 rounded-full">
              <Text className="text-sm font-medium text-white">
                Final Price
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default OrderDetailsScreen;
