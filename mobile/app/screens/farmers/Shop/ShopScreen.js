import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import logo from "../../../assets/logo.png";

const dummyNegotiation = [
  {
    id: 1,
    productImage: logo,
    productName: "Patatas",
    productDescription:
      "Patatas masarap asd Patatas masarap asdPatatas masarap asdPatatas masarap asdPatatas masarap asdPatatas masarap asdPatatas masarap asdPatatas masarap asdPatatas masarap asdPatatas masarap asdPatatas masarap asdPatatas masarap asdPatatas masarap asdPatatas masarap asdPatatas masarap asdPatatas masarap asdPatatas masarap asd",
    productPrice: 10.0,
    status: "Negotiating",
    openOrCloseNegotiation: "open",
  },
  {
    id: 2,
    productImage: logo,
    productName: "Tomato",
    productDescription: "Tomato masarap",
    productPrice: 5.0,
    status: "Approved",
    openOrCloseNegotiation: "close",
  },
  {
    id: 3,
    productImage: logo,
    productName: "Banana",
    productDescription: "Banana masarap",
    productPrice: 5.0,
    status: "Declined",
    openOrCloseNegotiation: "open",
  },
  {
    id: 4,
    productImage: logo,
    productName: "Saging",
    productDescription: "Saging masarap",
    productPrice: 5.0,
    status: "Completed",
    openOrCloseNegotiation: "close",
  },
];

function ShopScreen({ navigation }) {
  const [shopData, setShopData] = useState(null); // Correct placement of useState
  const [loading, setLoading] = useState(true); // Added loading state

  const getAsyncShopData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("shopData");

      if (storedData) {
        const parsedData = JSON.parse(storedData); // Parse storedData

        if (Array.isArray(parsedData)) {
          const shop = parsedData[0]; // Assuming shop data is the first element of the array
          setShopData(shop); // Set shopData state to the shop object
        } else {
          setShopData(parsedData); // If it's not an array, directly set parsed data
        }
      }
    } catch (error) {
      console.error("Failed to load shop data:", error);
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

  // Sample negotiation data (this should come from somewhere like state or props)
  const negotiationData = {
    price: "10.00",
    amount: "1",
    total: "10.00",
  };

  // Chat Support logic from LearnAndHelpScreen.js
  const handleChatSupportClick = () => {
    const adminId = 1;
    const adminName = "Admin"; // Assuming the admin's name is 'Admin', modify if needed
    navigation.navigate("ChatScreen", { receiverId: adminId, receiverName: adminName });
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
          <Image
            source={{ uri: shopData.shop_image_url }}
            className="w-12 h-12 rounded-full"
          />
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

      {/* Modified Grid Section */}
      <View className="px-4 mt-4">
        <View className="bg-white rounded-lg shadow p-4 space-y-4">
          {[
            { label: "  My Products", icon: "box", screen: "My Products" },
            { label: " Negotiation", icon: "hands-helping", screen: "Seller Negotiation List" },
            { label: "  Shop Performance", icon: "chart-line", screen: "Shop Performance" },
            { label: "    Bidding", icon: "file-contract", screen: "Bidding" },
            { label: "  Seller FAQ", icon: "question-circle", screen: "Seller FAQ" }, // Added Seller FAQ
            { label: " Chat Support", icon: "comments", action: handleChatSupportClick }, // Added Chat Support
          ].map(({ label, icon, screen, action }) => (
            <TouchableOpacity
              key={label}
              className="flex-row items-center justify-between"
              onPress={() => {
                if (label === "Negotiation") {
                  // Pass the dummyNegotiation and negotiationData only for the Negotiation screen
                  navigation.navigate(screen, { dummyNegotiation, negotiationData });
                } else if (action) {
                  action(); // Call the specific action for Chat Support
                } else {
                  navigation.navigate(screen, { information });
                }
              }}
            >
              <View className="flex-row items-center">
                <FontAwesome5 name={icon} size={20} color="#00B251" />
                <Text className="text-gray-800 font-semibold ml-4">{label}</Text>
              </View>
              <FontAwesome5 name="chevron-right" size={20} color="gray" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

export default ShopScreen;
