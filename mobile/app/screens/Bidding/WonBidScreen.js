import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";

function WonBidScreen({ navigation }) {
  const [wonBidData, setWonBidData] = useState([]);
  const [userId, setUserId] = useState(null);

  const fetchUserId = async () => {
    try {
      const storedData = await AsyncStorage.getItem("userData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData)) {
          const user = parsedData[0];
          setUserId(user.user_id);
        }
      }
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  const fetchWonBids = async () => {
    if (!userId) return;

    try {
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/userbids`,
        {
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
        }
      );

      if (!response.ok) throw new Error("Error fetching user bids");

      const userBidData = await response.json();
      const filteredUserBids = userBidData.filter(
        (userBid) => userBid.user_id === userId
      );

      const biddingResponse = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/biddings`,
        {
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
        }
      );

      if (!biddingResponse.ok) throw new Error("Error fetching biddings");

      const biddingData = await biddingResponse.json();

      // Filter to get won bids where user_id in userbids === bid_user_id in bidding
      const combinedData = filteredUserBids.map((userBid) => {
        const relatedBidding = biddingData.find(
          (bidding) => bidding.bid_id === userBid.bid_id && bidding.bid_user_id === userBid.user_id
        );
        return {
          ...userBid,
          bidding: relatedBidding || {},
        };
      }).filter((bid) => bid.bidding && bid.bidding.end_date && new Date(bid.bidding.end_date) < new Date());

      setWonBidData(combinedData);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchWonBids();
    }
  }, [userId]);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView>
        <View className="flex-row justify-between items-center px-8 py-4 bg-gray-100 border-b border-gray-300">
          <TouchableOpacity onPress={() => navigation.navigate("My Bids")}>
            <Text className="text-gray-500">Ongoing</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Past Bids")}>
            <Text className="text-gray-500">Past</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Won Bids")}>
            <Text className="text-[#00b251] font-bold border-b-2 border-[#00b251] pb-1">Won</Text>
          </TouchableOpacity>
        </View>
        <View className="p-4">
          {wonBidData.length > 0 ? (
            wonBidData.map((wonBid) => (
              <View
                className="mb-4 p-4 border border-gray-300 rounded-lg bg-white"
                key={wonBid.user_bid_id}
              >
                <View className="flex-row">
                  {wonBid.bidding && wonBid.bidding.bid_image && (
                    <Image
                      source={{ uri: wonBid.bidding.bid_image }}
                      className="w-24 h-24 rounded-lg mr-4"
                      resizeMode="cover"
                    />
                  )}
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-800">
                      Price: ₱{wonBid.price}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Date Bid: {new Date(wonBid.bid_date).toLocaleString()}
                    </Text>
                    {wonBid.bidding ? (
                      <View className="mt-2">
                        <Text className="font-bold text-[#00b251]">Bidding Info:</Text>
                        <Text className="text-gray-700">Bid Name: {wonBid.bidding.bid_name}</Text>
                        <Text className="text-gray-700">Starting Price: ₱{wonBid.bidding.bid_starting_price}</Text>
                        <Text className="text-gray-700">Current Highest Bid: ₱{wonBid.bidding.bid_current_highest}</Text>
                      </View>
                    ) : (
                      <Text className="text-red-500">No related bidding information available.</Text>
                    )}
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text className="text-center text-gray-600">No won bids found.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default WonBidScreen;
