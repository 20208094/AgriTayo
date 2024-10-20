import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const BiddingViewAllScreen = ({ route, navigation }) => {
  const { data, category, biddingData } = route.params;

  console.log(data); // For debugging purposes

  // Countdown component to show time left until the bid expires
  const Countdown = ({ endDate }) => {
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

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endDate));

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft(endDate));
      }, 1000);

      return () => clearInterval(timer);
    }, [endDate]);

    return (
      <View className="mt-2">
        {timeLeft.expired ? (
          <Text className="text-base text-red-600">Bid Expired</Text>
        ) : (
          <Text className="text-base text-gray-600">
            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </Text>
        )}
      </View>
    );
  };

  // Get current time for filtering expired bids
  const currentTime = new Date();

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="mt-6 mb-4">
        <Text className="text-3xl font-bold text-[#00B251] italic text-center">
          {category.crop_category_name} {/* Use correct category name */}
        </Text>
      </View>

      <FlatList
        data={biddingData.filter(bid => 
          bid.bid_category_id === category.crop_category_id && new Date(bid.end_date) > currentTime
        )}
        keyExtractor={(item) => item.bid_id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Bidding Details", { data: item })}
            className="bg-white m-2 rounded-lg overflow-hidden shadow-md border-gray-500 border-2"
            style={{ width: screenWidth * 0.4, height: screenHeight * 0.25 }}
          >
            <Image
              source={{ uri: item.bid_image }}
              className="w-full"
              style={{ height: screenHeight * 0.15 }}
              resizeMode="cover"
            />
            <View className="p-2">
              <Text className="text-center font-bold text-gray-800">{item.bid_name}</Text>
              <Text className="text-center font-bold text-green-500">Current Highest Bid: ₱{item.bid_current_highest}</Text>
              <Countdown endDate={item.end_date} />
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default BiddingViewAllScreen;
