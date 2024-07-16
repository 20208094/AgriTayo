import React from "react";
import { View, ScrollView, Text, TouchableOpacity, Image } from "react-native";
import SearchBarC from "../components/SearchBarC";
import logo from "../assets/logo.png";
import HomeCard from "../components/HomeCard";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { styled } from "nativewind";

const products = [
  {
    id: 1,
    title: "kamote",
    price: 5.0,
    image: logo,
    rating: 4.8,
    description: "Kamote Masarap",
    discount: 10,
    address: "Baguio",
  },
  {
    id: 2,
    title: "Patatas",
    price: 10,
    image: logo,
    rating: 5.0,
    description: "Patatas Masarap",
    discount: 5,
    address: "Trinidad",
  },
  {
    id: 3,
    title: "Patatas",
    price: 10,
    image: logo,
    rating: 5.0,
    description: "Patatas Masarap",
    discount: 5,
    address: "Trinidad",
  },
  {
    id: 4,
    title: "Patatas",
    price: 10,
    image: logo,
    rating: 5.0,
    description: "Patatas Masarap",
    discount: 5,
    address: "Trinidad",
  },
];

function HomePageScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView className="flex-1 bg-gray-100 pt-5">
      <View className="flex-row justify-between items-center px-4 pt-8">
        <Text className="text-green-700 text-3xl font-bold">Hi Paeng!</Text>
        <View className="flex-row">
          <Icon
            name="notifications-outline"
            type="ionicon"
            size={30}
            color="green"
            onPress={() => navigation.navigate("Notifications")}
            className="ml-4"
          />
          <Icon
            name="mail-outline"
            type="ionicon"
            size={30}
            color="green"
            onPress={() => navigation.navigate("Messages")}
            className="ml-4"
          />
        </View>
      </View>
      <Text className="px-4 text-base text-gray-600 mt-2">Enjoy our services!</Text>
      <View className="mt-4 px-4">
        <SearchBarC />
      </View>
      <View className="bg-green-200 p-4 rounded-lg mt-4 mx-4">
        <View className="ml-4">
          <Text className="text-2xl font-bold">AgriTutorial</Text>
          <Text>Want to know how AgriTayo Works? </Text>
          <TouchableOpacity className="bg-green-600 px-3 py-1.5 rounded mt-2 self-start">
            <Text className="text-white font-bold text-sm">Click Here</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="mt-4 px-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-2xl font-bold">Featured Products</Text>
          <TouchableOpacity>
            <Text className="text-blue-500">See All</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row flex-wrap justify-between">
          {products.map((product) => (
            <HomeCard key={product.id} product={product} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

export default styled(HomePageScreen);
