import React, { useState, useCallback, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";

function CompletedBidScreen({ navigation }) {
  const [completedBiddingData, setCompletedBiddingData] = useState([]);

  const fetchCompletedBiddings = async () => {
    try {
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/biddings`,
        {
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();

      // Filter for bids with a valid bid_user_id
      const filteredBids = data.filter((bidding) => bidding.bid_user_id !== null && bidding.bid_user_id !== undefined);

      // Set filtered data to state
      setCompletedBiddingData(filteredBids);
    } catch (error) {
      alert(`Error fetching completed biddings: ${error.message}`);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCompletedBiddings();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 p-4 bg-gray-100">
      {/* Header Section */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold text-gray-800">My Bids</Text>
        <TouchableOpacity
          className="bg-[#00b251] rounded-lg px-4 py-2"
          onPress={() => navigation.navigate("Add Bid")}
        >
          <Text className="text-white text-base">+ Add Bid</Text>
        </TouchableOpacity>
      </View>

      {/* Ongoing and Completed Bids Section */}
      <View className="flex-row justify-between mb-4">
        <TouchableOpacity
          className="rounded-lg px-4 py-2"
          onPress={() => navigation.navigate("Bidding")}
        >
          <Text className="text-gray-500 ">Ongoing Bids</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="rounded-lg px-4 py-2"
          onPress={() => navigation.navigate("Completed Bids")}
        >
          <Text className="text-[#00b251] font-bold border-b-2 border-[#00b251] pb-1">
            Completed Bids
          </Text>
        </TouchableOpacity>
      </View>

      {/* Completed Bidding Items */}
      <ScrollView>
        <View className="flex-col">
          {completedBiddingData.map((bidding) => (
            <TouchableOpacity
              key={bidding.bid_id}
              className="bg-white rounded-lg shadow-md flex-row items-start p-4 mb-4 border border-gray-300"
              onPress={() => navigation.navigate("Shop Bidding Details", { bidding })}
              style={{ elevation: 3 }}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: bidding.bid_image }}
                className="w-24 h-24 rounded-lg mr-4"
                resizeMode="cover"
              />
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800 mb-1">
                  {bidding.bid_name}
                </Text>
                <Text className="text-sm text-gray-600">{bidding.bid_description}</Text>
                <Text className="text-sm text-green-500">
                  Current Highest Bid: ₱{bidding.bid_current_highest}
                </Text>
                <Text className="text-sm text-gray-600">
                  Bid User ID: {bidding.bid_user_id}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default CompletedBidScreen;
