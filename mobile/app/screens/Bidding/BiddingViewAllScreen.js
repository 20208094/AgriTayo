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
          {category.crop_category_name}
        </Text>
      </View>

      <FlatList
        key={'two-column-grid'}
        data={biddingData.filter(bid => 
          bid.bid_category_id === category.crop_category_id && new Date(bid.end_date) > currentTime
        )}
        keyExtractor={(item) => item.bid_id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Bidding Details", { data: item })}
            className="bg-white m-2 rounded-lg overflow-hidden shadow-md border-gray-200 border flex-1"
            style={{ 
              width: (screenWidth - 32) / 2, // Account for padding and gaps
              maxWidth: (screenWidth - 32) / 2,
            }}
          >
            <Image
              source={{ uri: item.bid_image }}
              className="w-full"
              style={{ height: screenHeight * 0.15 }}
              resizeMode="cover"
            />
            <View className="p-3">
              <Text 
                numberOfLines={2}
                className="text-[16px] font-bold text-gray-800 mb-2 text-center"
              >
                {item.bid_name}
              </Text>
              
              <TouchableOpacity 
                onPress={() => navigation.navigate("Seller Shop", { shop_id: item.shops.shop_id })}
                className="mb-2"
              >
                <Text 
                  numberOfLines={1}
                  className="text-sm text-gray-500 text-center"
                >
                  Sold by: {item.shops.shop_name}
                </Text>
              </TouchableOpacity>

              <Text 
                numberOfLines={1}
                className="text-base text-green-600 mb-1 text-center"
              >
                Current Highest Bid: ₱{item.bid_current_highest}
              </Text>

              <Text 
                numberOfLines={1}
                className="text-sm text-gray-500 mb-1 text-center"
              >
                Number of Bids: {item.number_of_bids}
              </Text>

              <Text 
                numberOfLines={2}
                className="text-sm text-gray-500 mb-1 text-center"
              >
                Ends on: {new Date(item.end_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>

              <Countdown endDate={item.end_date} />
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default BiddingViewAllScreen;
