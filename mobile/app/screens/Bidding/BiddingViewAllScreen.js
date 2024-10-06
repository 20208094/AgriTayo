import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image, SafeAreaView, Dimensions } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const BiddingViewAllScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { category } = route.params; 

  const renderCard = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("Bidding Details", { data: item })}
      className="bg-white rounded-lg overflow-hidden shadow-lg border-[#00B251] border ml-1 mr-2 mb-4 "
      style={{
        width: (screenWidth * 0.45), 
        height: screenHeight * 0.3,  
      }}
    >
      <Image
        source={item.pic}
        className="w-full"
        style={{ height: screenHeight * 0.18 }} 
        resizeMode="cover"
      />
      <View className="p-3">
        <Text className="text-center font-semibold text-gray-900 mb-1">
          {item.name}
        </Text>
        <Text className="text-center text-green-600 text-sm mb-1">
          Highest Bid: ₱{item.currentHighestBid}
        </Text>
        <Text className="text-center text-xs text-gray-500">
          {item.time}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="mt-6 mb-4 ">
        <Text className="text-3xl font-bold text-[#00B251] italic text-center">
          {category.categoryName}
        </Text>
      </View>
      <FlatList
        data={category.subCategories} 
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: screenWidth * 0.03,  
          paddingBottom: 20,
        }}
        renderItem={renderCard}
        columnWrapperStyle={{
          justifyContent: "space-between", 
        }}
      />
    </SafeAreaView>
  );
};

export default BiddingViewAllScreen;
