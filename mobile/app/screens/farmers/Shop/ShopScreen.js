import React from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import michael from "../../../assets/ehh.png";

const dummyNegotiation = [
    {
        id: 1,
        productName: 'Patatas',
        productDescription: 'Patatas masarap',
        productPrice: 10.00,
    },
    {
        id: 2,
        productName: 'Tomato',
        productDescription: 'Tomato masarap',
        productPrice: 5.00,
    }
];

function ShopScreen({ navigation }) {
  const information = {
    id: 1,
    name: "Michael",
    followers: 0,
    verify: "Verified",
  };

  // Sample negotiation data (this should come from somewhere like state or props)
  const negotiationData = {
      price: '10.00',
      amount: '1',
      total: '10.00'
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      {/* Header Section */}
      <View className="flex-row items-center justify-between p-4">
        <View className="flex-row items-center">
          <Image source={michael} className="w-12 h-12 rounded-full" />
          <View className="ml-3">
            <Text className="text-lg font-semibold">{information.name}</Text>
            <Text className="text-gray-500 text-sm">AgriTayo/{information.name.toLowerCase()}</Text>
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
        {["To Ship", "Cancelled", "Return", "Review"].map((status) => (
          <TouchableOpacity
            key={status}
            className="items-center"
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
          { label: "Negotiation", icon: "hands-helping", screen: "Seller Negotiation List" },
          { label: "Shop Performance", icon: "chart-line", screen: "Shop Performance" },
          { label: "Bidding", icon: "file-contract", screen: "Bidding" },
          { label: "Learn and Help", icon: "info-circle", screen: "Learn and Help" },
        ].map(({ label, icon, screen }) => (
          <TouchableOpacity
            key={label}
            className="w-[30%] items-center my-2"
            onPress={() => {
              if (label === "Negotiation") {
                // Pass the dummyNegotiation and negotiationData only for the Negotiation screen
                navigation.navigate(screen, { dummyNegotiation, negotiationData });
              } else {
                navigation.navigate(screen, { information });
              }
            }}
          >
            <View className="h-12 w-12 justify-center items-center bg-gray-200 rounded-full mb-2">
              <FontAwesome5 name={icon} size={24} color="#00B251" />
            </View>
            <Text className="text-center text-sm text-gray-600">{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

export default ShopScreen;
