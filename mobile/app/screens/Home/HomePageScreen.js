import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import SearchBarC, {
  NotificationIcon,
  MessagesIcon,
  MarketIcon,
} from "../../components/SearchBarC";
import logo from "../../assets/logo.png";
import HomeCard from "../../components/HomeCard";
import { useNavigation } from "@react-navigation/native";
import { styled } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

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
    seller: {
      id: 1,
      name: "Michael",
      shopName: "Michael Shop",
      followers: 1,
      categories: {
        category: [
          {
            id: 1,
            name: "Vegetables",
            subCategories: [
              {
                id: 1,
                name: "Tomato",
              },
              {
                id: 2,
                name: "Potato",
              },
            ],
          },
          {
            id: 2,
            name: "Fruits",
            subCategories: [
              {
                id: 1,
                name: "Apple",
              },
              {
                id: 2,
                name: "Banana",
              },
            ],
          },
        ],
      },
    },
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
    seller: {
      id: 2,
      name: "Joshua",
      shopName: "Joshua Shop",
      followers: 2,
      categories: {
        category: [
          {
            id: 1,
            name: "Spices",
            subCategories: [
              {
                id: 1,
                name: "Turmeric",
              },
              {
                id: 2,
                name: "Cumin",
              },
            ],
          },
          {
            id: 2,
            name: "Seedlings",
            subCategories: [
              {
                id: 1,
                name: "Tomato Seedlings",
              },
              {
                id: 2,
                name: "Basil Seedlings",
              },
            ],
          },
        ],
      },
    },
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
    seller: {
      id: 3,
      name: "Calalo",
      shopName: "Calalo Shop",
      followers: 3,
      categories: {
        category: [
          {
            id: 1,
            name: "Plants",
            subCategories: [
              {
                id: 1,
                name: "Spider Plant",
              },
              {
                id: 2,
                name: "Aloe Vera",
              },
            ],
          },
          {
            id: 2,
            name: "Flowers",
            subCategories: [
              {
                id: 1,
                name: "Rose",
              },
              {
                id: 2,
                name: "Tulip",
              },
            ],
          },
        ],
      },
    },
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
    seller: {
      id: 4,
      name: "Pogi",
      shopName: "Pogi Shop",
      followers: 4,
      categories: {
        category: [
          {
            id: 1,
            name: "Sabon",
            subCategories: [
              {
                id: 1,
                name: "Sabon Panlaba",
              },
              {
                id: 2,
                name: "Sabon Pankatawan",
              },
            ],
          },
          {
            id: 2,
            name: "Lotion",
            subCategories: [
              {
                id: 1,
                name: "Lotion ng Mukha",
              },
              {
                id: 2,
                name: "Lotion ng Katawan",
              },
            ],
          },
        ],
      },
    },
  },
];

function HomePageScreen() {
  const navigation = useNavigation();
  const [showAgriTutorial, setShowAgriTutorial] = useState(true);
  const [userData, setUserData] = useState('')

  const getAsyncUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("userData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData)) {
          const user = parsedData[0];
          setUserData(user);
        } else {
          setUserData(parsedData);
        }
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };

    // Use useFocusEffect to re-fetch data when the screen is focused (navigated back)
    useFocusEffect(
      React.useCallback(() => {
        getAsyncUserData();
      }, [])
    );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Sticky Header */}
      <View className="bg-gray-100 shadow-md sticky top-0 z-10">
        <View className="flex-row justify-between items-center px-4 pt-8">
          <Text className="text-green-600 text-3xl font-bold">Hi {userData.firstname}!</Text>
          <View className="flex-row">
            <MarketIcon onPress={() => navigation.navigate("CartScreen")} />
            <NotificationIcon
              onPress={() => navigation.navigate("Notifications")}
            />
            <MessagesIcon
              onPress={() => navigation.navigate("ChatListScreen")}
            />
          </View>
        </View>
        <Text className="px-4 text-base text-gray-600 mt-2">
          Enjoy our services!
        </Text>
        <View className="mt-4 px-4 mb-4">
          <SearchBarC />
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView>
        {/* AgriTutorial Section */}
        {showAgriTutorial && (
          <View className="bg-green-200 p-4 rounded-lg mt-4 mx-4 relative">
            <TouchableOpacity
              className="absolute top-2 right-2 p-2"
              onPress={() => setShowAgriTutorial(false)}
            >
              <Text className="text-green-600 font-bold">X</Text>
            </TouchableOpacity>
            <View className="ml-4">
              <Text className="text-2xl font-bold">AgriTutorial</Text>
              <Text>Want to know how AgriTayo Works? </Text>
              <TouchableOpacity className="bg-green-600 px-3 py-1.5 rounded mt-2 self-start">
                <Text className="text-white font-bold text-sm">Click Here</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Featured Products Section */}
        <View className="mt-4 px-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-2xl font-bold">Featured Products</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Product List")}
            >
              <Text className="text-green-600">See All</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row flex-wrap justify-between">
            {products.map((product) => (
              <HomeCard key={product.id} product={product} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default styled(HomePageScreen);
