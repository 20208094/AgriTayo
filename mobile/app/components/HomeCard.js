import React from "react";
import { Text, TouchableOpacity, Image, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styled } from "nativewind";

const HomeCard = ({ product }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("Product Details", { product });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="bg-white rounded-lg shadow m-2 w-[44%] mb-5"
    >
      <View className="rounded-t-lg overflow-hidden">
        <Image source={product.image} className="w-full h-28" />
      </View>
      <View className="p-2.5">
        <Text className="text-base font-bold mb-1.5">{product.title}</Text>
        <Text className="text-green-700 mb-1.5">₱ {product.price}</Text>
        <Text className="text-gray-700 mb-1.5">⭐ {product.rating}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default styled(HomeCard);
