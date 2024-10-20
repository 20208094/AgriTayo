import React, { useState, useCallback, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";

function MyBidScreen({ navigation }) {
  const [myBidData, setMyBidData] = useState([]);
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

  const fetchUserBids = async () => {
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

      const combinedData = filteredUserBids.map((userBid) => {
        const relatedBidding = biddingData.find(
          (bidding) => bidding.bid_id === userBid.bid_id
        );
        return {
          ...userBid,
          bidding: relatedBidding || {},
        };
      });

      const activeBids = combinedData.filter((bid) => {
        if (bid.bidding && bid.bidding.end_date) {
          const now = new Date();
          const endDate = new Date(bid.bidding.end_date);
          return endDate > now;
        }
        return false;
      });

      setMyBidData(activeBids);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserId();
    }, [])
  );

  useEffect(() => {
    if (userId) {
      fetchUserBids();
    }
  }, [userId]);

  const Countdown = ({ endDate }) => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const end = new Date(endDate);
      const difference = end - now;

      let timeLeft = {};

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      } else {
        timeLeft = { expired: true };
      }

      return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearInterval(timer);
    }, [endDate]);

    return (
      <View className="mt-2">
        {timeLeft.expired ? (
          <Text className="text-red-600 font-bold">Bidding Ended</Text>
        ) : (
          <Text className="text-[#00b251] font-bold">
            Time Left: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{" "}
            {timeLeft.seconds}s
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView>
        <View className="flex-row justify-between items-center px-8 py-4 bg-gray-100 border-b border-gray-300">
          <TouchableOpacity onPress={() =>navigation.navigate('My Bids')}>
            <Text className="text-[#00b251] font-bold border-b-2 border-[#00b251] pb-1">
              Ongoing
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Past Bids")}>
            <Text className="text-gray-500">Past</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Won Bids")}>
            <Text className="text-gray-500">Won</Text>
          </TouchableOpacity>
        </View>
        <View className="p-4">
          {myBidData.length > 0 ? (
            myBidData.map((myBid) => (
              <View
                className="mb-4 p-4 border border-gray-300 rounded-lg bg-white"
                key={myBid.user_bid_id}
              >
                {/* Bid Content */}
                <View className="flex-row">
                  {/* Display image if available */}
                  {myBid.bidding && myBid.bidding.bid_image && (
                    <Image
                      source={{ uri: myBid.bidding.bid_image }}
                      className="w-24 h-24 rounded-lg mr-4"
                      resizeMode="cover"
                    />
                  )}

                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-800">
                      Price: ₱{myBid.price}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Date Bid: {new Date(myBid.bid_date).toLocaleString()}
                    </Text>

                    {/* Bidding Info */}
                    {myBid.bidding ? (
                      <View className="mt-2">
                        <Text className="font-bold text-[#00b251]">
                          Bidding Info:
                        </Text>
                        <Text className="text-gray-700">
                          Bid Name: {myBid.bidding.bid_name}
                        </Text>
                        <Text className="text-gray-700">
                          Starting Price: ₱{myBid.bidding.bid_starting_price}
                        </Text>
                        <Text className="text-gray-700">
                          Current Highest Bid: ₱
                          {myBid.bidding.bid_current_highest}
                        </Text>

                        {/* Countdown Timer */}
                        <Countdown endDate={myBid.bidding.end_date} />
                      </View>
                    ) : (
                      <Text className="text-red-500">
                        No related bidding information available.
                      </Text>
                      
                    )}
                  </View>
                </View>

                {/* Icon for updating */}
                <TouchableOpacity className="mt-4 flex-row justify-end">
                  <Ionicons name="add-circle-outline" size={32} color="#00b251" />
                </TouchableOpacity>
              </View>
            ))
            
          ) : (
            <Text className="text-center text-gray-600">
              No active bids found.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default MyBidScreen;
