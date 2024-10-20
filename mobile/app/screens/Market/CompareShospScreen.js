import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5";
import placeholderimg from '../../assets/placeholder.png';

function CompareShopsScreen({ route }) {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header with Search and Filter */}
      <View className="p-4 pb-1 flex-row items-center space-x-3 bg-white shadow-sm">

        {/* Filter Button */}
        <TouchableOpacity
          className="flex w-10 h-10 items-center justify-center rounded-lg bg-[#00B251] shadow-md"
          onPress={() => navigation.navigate("Filter Products")}
        >
          <Icon name="filter" size={18} color="white" />
        </TouchableOpacity>

        {/* Search Bar */}
        <View className="flex-1 flex-row bg-gray-100 rounded-lg border border-gray-200 shadow-sm items-center px-2">
          <Icon name="search" size={16} color="gray" />
          <TextInput
            placeholder="Search crops..."
            className="p-2 pl-2 flex-1 text-xs text-gray-700"
          />
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView className="mt-4">
        <View className="px-4">

          {/* Featured Shops Section */}
          <Text className="text-lg font-bold text-gray-800 my-3">Featured Shops</Text>

          {/* Shop Card Example */}
          <View className="space-y-3">
            <ShopCard
              shopName="Calalo Store"
              productName="Calalo Vegetables"
              price="₱5.00/kg"
              available="540kg"
              rating="4.5⭐"
              imgSrc={placeholderimg}
            />
            <ShopCard
              shopName="Another Shop"
              productName="Tomatoes"
              price="₱10.00/kg"
              available="100kg"
              rating="4.0⭐"
              imgSrc={placeholderimg}
            />
            {/* More shop cards... */}
          </View>

          {/* Other Shops Section */}
          <Text className="text-lg font-bold text-gray-800 my-3">Other Shops</Text>
          <View className="space-y-3">
            <ShopCard
              shopName="Random Shop"
              productName="Eggplants"
              price="₱8.00/kg"
              available="200kg"
              rating="4.2⭐"
              imgSrc={placeholderimg}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const ShopCard = ({ shopName, productName, price, available, rating, imgSrc }) => {
  return (
    <View className="flex-row border p-2 rounded-md shadow-sm bg-white items-center mb-2">
      {/* Store Name and Product Info */}
      <View className="flex-1 flex-row justify-between  items-center">
        <View className="flex-row items-center ml-2">
          <View className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
            <Image source={imgSrc} className="w-full h-full" />
          </View>
          <Text className="text-base ml-3 font-semibold text-gray-700">{shopName}</Text>
        </View>
        <View className="flex-col items-end pr-3">
          <Text className="text-sm text-gray-800">{productName}</Text>
          <Text className="text-xs font-bold text-[#00B251]">{price}</Text>
          <Text className="text-xs text-gray-500">{available} Available</Text>
          <Text className="text-xs text-gray-400">{rating}</Text>
        </View>
      </View>
    </View>
  );
}

export default CompareShopsScreen;
