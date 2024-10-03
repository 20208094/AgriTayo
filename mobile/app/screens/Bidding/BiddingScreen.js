import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
  FlatList,
  Dimensions,
} from "react-native";
import logo from "../../assets/logo.png";
import ehh from "../../assets/ehh.png";
import saging from "../../assets/saging.jpg";
import potato from "../../assets/potato.jpg";
import { useNavigation } from "@react-navigation/native";

// Get screen dimensions for responsive design
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const dummyData = [
  {
    id: 1,
    name: "Potato",
    currentHighestBid: 1000,
    price: 500,
    description:
      "Lorem ipsum dolor sit amet. In veritatis consequatur eos veritatis nihil eum magni dignissimos in delectus praesentium.",
    day: 1,
    hour: 2,
    minutes: 3,
    seconds: 10,
    pic: potato,
    michael: ehh,
    shopName: "Michael Shop",
  },
  {
    id: 2,
    name: "Patatas",
    currentHighestBid: 2000,
    price: 600,
    description:
      "Lorem ipsum dolor sit amet. In veritatis consequatur eos veritatis nihil eum magni dignissimos.",
    day: 4,
    hour: 5,
    minutes: 6,
    seconds: 0,
    pic: logo,
    michael: ehh,
    shopName: "Michael Shop",
  },
  {
    id: 3,
    name: "Banana",
    currentHighestBid: 4000,
    price: 700,
    description:
      "Lorem ipsum dolor sit amet. In veritatis consequatur eos veritatis nihil eum magni dignissimos in delectus praesentium.",
    day: 1,
    hour: 2,
    minutes: 3,
    seconds: 10,
    pic: ehh,
    michael: ehh,
    shopName: "Michael Shop",
  },
  {
    id: 4,
    name: "Saging",
    currentHighestBid: 6000,
    price: 800,
    description:
      "Lorem ipsum dolor sit amet. In veritatis consequatur eos veritatis nihil eum magni dignissimos.Lorem ipsum dolor sit amet. In veritatis consequatur eos veritatis nihil eum magni dignissimos.Lorem ipsum dolor sit amet. ",
    day: 4,
    hour: 5,
    minutes: 6,
    seconds: 0,
    pic: saging,
    michael: ehh,
    shopName: "Michael Shop",
  },
];

const BiddingCard = ({ data, scale, opacity }) => {
  const navigation = useNavigation();
  const initialTimeInSeconds =
    data.day * 86400 + data.hour * 3600 + data.minutes * 60 + data.seconds;

  const [remainingTime, setRemainingTime] = useState(initialTimeInSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds) => {
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale }],
        opacity,
        marginHorizontal: 10,
        width: screenWidth * 0.6,
        height: screenHeight * 0.5,
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate("Bidding Details", { data })}
        className="mt-6 mx-auto bg-white rounded-[20px] border-[3px] border-[#737373] shadow-2xl shadow-black"
      >
        <View className="rounded-t-[15px] overflow-hidden">
          <Image
            source={data.pic}
            className="w-full"
            style={{
              height: screenHeight * 0.3, // Image height adjusted
            }}
            resizeMode="cover"
          />
        </View>
        <View className="p-4">
          <Text className="text-[20px] font-bold text-gray-800 mb-2 text-center">
            {data.name}
          </Text>
          <Text className="text-sm text-gray-500 mb-3 text-center">
            Sold by: {data.shopName}
          </Text>
          <Text className="text-lg text-green-600 mb-1 text-center">
            Current Highest Bid: ₱{data.currentHighestBid}
          </Text>
          <Text className="text-base text-gray-600 text-center">
            {formatTime(remainingTime)}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

function BiddingScreen() {
  const [filteredData, setFilteredData] = useState(dummyData);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);


  // Circular pattern logic
  const handleScrollEnd = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / (screenWidth * 0.6));
    setCurrentIndex(index % filteredData.length); // Set the current index
  };

  // Handle snapping to the center
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: currentIndex,
        animated: true,
        viewPosition: 0.5, // Center the item
      });
    }
  }, [currentIndex]);

  return (
    <SafeAreaView className="flex-1 bg-[#d1d5db]">

      <Animated.FlatList
        ref={flatListRef}
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: screenWidth * 0.2, // Padding to center the carousel
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={handleScrollEnd} // Ensure cards lock in place
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * screenWidth * 0.6,
            index * screenWidth * 0.6,
            (index + 1) * screenWidth * 0.6,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.6, 1, 0.6],
            extrapolate: "clamp",
          });

          return <BiddingCard data={item} scale={scale} opacity={opacity} />;
        }}
        snapToInterval={screenWidth * 0.6} // Set snapping to the width of the card
        decelerationRate="fast"
      />

    </SafeAreaView>
  );
}

export default BiddingScreen;