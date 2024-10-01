import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import michael from "../../../assets/ehh.png";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect  } from "@react-navigation/native";

function ShopScreen({ navigation }) {
  const [shopData, setShopData] = useState(null);  // Correct placement of useState
  const [loading, setLoading] = useState(true); // Added loading state

  const getAsyncShopData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('shopData');
      
      if (storedData) {
        const parsedData = JSON.parse(storedData); // Parse storedData
        
        if (Array.isArray(parsedData)) {
          const shop = parsedData[0];  // Assuming shop data is the first element of the array
          setShopData(shop); // Set shopData state to the shop object
        } else {
          setShopData(parsedData); // If it's not an array, directly set parsed data
        }
      }
    } catch (error) {
      console.error('Failed to load shop data:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getAsyncShopData();
    }, [])
  );

  const information = {
    id: 1,
    name: "Michael",
    followers: 0,
    verify: "Verified",
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-white flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white flex-1">
      {/* Header Section */}
      <View className="flex-row items-center justify-between p-4">
        <View className="flex-row items-center">
          <Image source={{uri: shopData.shop_image_url}} className="w-12 h-12 rounded-full" />
          <View className="ml-3">
            <Text className="text-lg font-semibold">{shopData.shop_name}</Text>
          </View>
        </View>
        <TouchableOpacity
          className="px-4 py-1 border border-[#00B251] rounded-full"
          onPress={() => navigation.navigate("View Shop", { information })}
        >
          <Text className="text-[#00B251]">View Shop</Text>
        </TouchableOpacity>
      </View>

      {/* Banner Placeholder */}
      <View className="bg-[#00B251] w-full h-20 mt-2 mb-4" />

      {/* Order Status Section */}
      <View className="flex-row justify-between px-6">
        <Text className="text-lg font-semibold">Order Status</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Sales History", { screen: "Completed" })
          }
        >
          <Text className="text-lg text-[#00B251]">View Sales History</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-around mt-4 px-6">
        {["To Confirm", "To Ship", "Complete"].map((status) => (
          <TouchableOpacity
            key={status}
            className="items-center w-1/3"
            onPress={() =>
              navigation.navigate("Sales History", { screen: status })
            }
          >
            <Text className="text-lg font-bold">0</Text>
            <Text className="text-gray-500">{status}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="flex-row justify-around mt-4 px-6 text-center">
        {["Review", "Cancelled", "Return"].map((status) => (
          <TouchableOpacity
            key={status}
            className="items-center w-1/3"
            onPress={() =>
              navigation.navigate("Sales History", { screen: status })
            }
          >
            <Text className="text-lg font-bold">0</Text>
            <Text className="text-gray-500">{status}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Grid Section */}
      <View className="mt-6 px-6 flex-wrap flex-row justify-between">
        {[
          { label: "My Products", icon: "box", screen: "My Products" },
          { label: "Shop Performance", icon: "chart-line", screen: "Shop Performance" },
          { label: "Bidding", icon: "file-contract", screen: "Bidding" },
          { label: "Learn and Help", icon: "info-circle", screen: "Learn and Help" },
        ].map(({ label, icon, screen }) => (
          <TouchableOpacity
            key={label}
            className="w-[100%] my-2"
            onPress={() => navigation.navigate(screen, { information })}
          >
            <View className="flex-row h-16 w-content items-center pl-10 bg-gray-200 rounded-full mb-2">
              <View className="w-10" >

              <FontAwesome5 name={icon} size={30} color="#00B251" />
              </View>
              
            <Text className="pl-5 text-base text-black">{label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

export default ShopScreen;
