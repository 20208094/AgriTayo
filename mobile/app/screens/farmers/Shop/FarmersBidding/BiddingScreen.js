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
import Ionicons from "react-native-vector-icons/Ionicons";
import NavigationbarComponent from "../../../../components/NavigationbarComponent";

function BiddingScreen({ navigation }) {
  const [biddingData, setBiddingData] = useState([]);

  const fetchBiddings = async () => {
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

      // Get the current date and time
      const now = new Date();

      // Filter for only available bids
      const availableBids = data.filter(
        (bidding) => new Date(bidding.end_date) > now
      );

      // Set filtered data to state
      setBiddingData(availableBids);
    } catch (error) {
      alert(`Error fetching bidding systems: ${error.message}`);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBiddings();
    }, [])
  );

  return (
    <>
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
          <Text className="text-[#00b251] font-bold border-b-2 border-[#00b251] pb-1">
            Ongoing Bids
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="rounded-lg px-4 py-2"
          onPress={() => navigation.navigate("Completed Bids")}
        >
          <Text className="text-gray-500">Completed Bids</Text>
        </TouchableOpacity>
      </View>

      {/* Bidding Items */}
      <ScrollView>
        <View className="flex-col">
          {biddingData.map((bidding) => (
            <BidItem
              key={bidding.bid_id}
              bidding={bidding}
              navigation={navigation}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
    <NavigationbarComponent/>
    </>
  );
}

// Component for rendering a single bid item
const BidItem = ({ bidding, navigation }) => {
  const calculateTimeLeft = (endDate) => {
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

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(bidding.end_date));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(bidding.end_date));
    }, 1000);

    return () => clearInterval(timer);
  }, [bidding.end_date]);

  return (
    <TouchableOpacity
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
        {timeLeft.expired ? (
          <Text className="text-base text-red-600">Bid Expired</Text>
        ) : (
          <Text className="text-base text-gray-600">
            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{" "}
            {timeLeft.seconds}s
          </Text>
        )}
      </View>

      {/* Conditional Button */}
      {bidding.number_of_bids === null && (
        <TouchableOpacity
          className="ml-4"
          onPress={() => {
            /* Define action when icon is pressed */
          }}
        >
          <Ionicons name="create-outline" size={24} color="#00b251" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default BiddingScreen;
