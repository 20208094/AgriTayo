import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, ScrollView, View, TouchableOpacity, Image } from "react-native";
import logo from "../../../../assets/logo.png";
import ehh from "../../../../assets/ehh.png";

const dummyData = [
  {
    id: 1,
    name: "Potato",
    currentHighestBid: 1000,
    price: 500,
    description: "Lorem ipsum dolor sit amet.",
    day: 1,
    hour: 2,
    minutes: 3,
    seconds: 10,
    pic: logo,
    michael: ehh,
  },
  {
    id: 2,
    name: "Patatas",
    currentHighestBid: 2000,
    price: 600,
    description: "Lorem ipsum dolor sit amet.",
    day: 4,
    hour: 5,
    minutes: 6,
    seconds: 0,
    pic: logo,
    michael: ehh,
  },
  // More items...
];

function BiddingScreen({navigation}) {
  const [times, setTimes] = useState(
    dummyData.map(item => {
      const totalSeconds =
        item.day * 86400 + item.hour * 3600 + item.minutes * 60 + item.seconds;
      return { id: item.id, remainingTime: totalSeconds };
    })
  );

  // useEffect to handle countdown for each item
  useEffect(() => {
    const interval = setInterval(() => {
      setTimes(prevTimes =>
        prevTimes.map(time => {
          if (time.remainingTime <= 0) return { ...time, remainingTime: 0 };
          return { ...time, remainingTime: time.remainingTime - 1 };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Function to format remaining time in d:h:m:s format
  const formatTime = totalSeconds => {
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <SafeAreaView className="flex-1 p-4 bg-gray-200">
      {/* Header Section */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold text-gray-800">My Bids</Text>
        <TouchableOpacity
          className="bg-[#00b251] rounded-lg px-4 py-2"
          onPress={() => navigation.navigate('Add Bid')}
        >
          <Text className="text-white text-base">Add Bid</Text>
        </TouchableOpacity>
      </View>
      
      {/* Bidding Items */}
      <ScrollView>
        <View className="flex-col">
          {dummyData.map(item => {
            const itemTime = times.find(time => time.id === item.id)?.remainingTime;

            return (
              <TouchableOpacity
                key={item.id}
                className="bg-white rounded-lg shadow-md flex-row items-start p-4 mb-4 border border-gray-300"
                onPress={() => navigation.navigate('Shop Bidding Details', { item })}
                style={{ elevation: 3 }}
                activeOpacity={0.8}
              >
                <Image
                  source={item.pic}
                  className="w-24 h-24 rounded-lg mr-4"
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-800 mb-1">
                    {item.name}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {item.description}
                  </Text>
                  <Text className="text-sm text-green-500">
                    Current Highest Bid: ₱{item.currentHighestBid}
                  </Text>
                  <Text className="text-base text-gray-600">
                    {itemTime !== undefined ? formatTime(itemTime) : "Loading..."}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default BiddingScreen;
