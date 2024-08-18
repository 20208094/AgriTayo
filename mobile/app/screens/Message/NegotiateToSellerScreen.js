import React from "react";
import { SafeAreaView, View, Text, Image } from "react-native";
import michael from "../../assets/ehh.png";

function NegotiateToSellerScreen({ route }) {
  const { product } = route.params;
  return (
    <SafeAreaView className="">
      <View className="">
        <Image source={michael} className="w-24 h-24 rounded-full" />
        <Text className="">Seller: {product.seller.name}</Text>
      </View>
    </SafeAreaView>
  );
}

export default NegotiateToSellerScreen;
