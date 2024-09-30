import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import logo from "../../assets/logo.png";
import ehh from "../../assets/ehh.png";
import saging from "../../assets/saging.jpg";
import potato from "../../assets/potato.jpg";
import { useNavigation } from "@react-navigation/native";
import SearchBarC from "../../components/SearchBarC";

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

const BiddingCard = ({ data }) => {
  const navigation = useNavigation();
  const initialTimeInSeconds =
    data.day * 86400 + data.hour * 3600 + data.minutes * 60 + data.seconds;

  const [remainingTime, setRemainingTime] = useState(initialTimeInSeconds);

  // useEffect to handle countdown
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

  // Function to format remaining time in d:h:m:s format
  const formatTime = (totalSeconds) => {
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Bidding Details", { data })}
      className="w-[85vw] mx-[7.5vw] bg-white rounded-[30px] border-[3px] my-5 border-[#737373] shadow-2xl shadow-black mb-8"
      style={{
        maxWidth: screenWidth * 0.9, // Ensuring it doesn't exceed screen width
        overflow: "hidden", // Ensuring nothing spills out
      }}
    >
      {/* Card Header (Image) */}
      <View className="rounded-t-[15px] overflow-hidden">
        <Image
          source={data.pic}
          className="w-full"
          style={{ 
            height: screenHeight * 0.5, 
            maxWidth: screenWidth * 0.85, // Cap width to make sure it is responsive
          }}
          resizeMode="cover" // This ensures the image scales while maintaining its aspect ratio
        />
      </View>

      {/* Card Body */}
      <View className="p-4">
        {/* Title */}
        <Text className="text-[22px] font-bold text-gray-800 mb-2 text-center">
          {data.name}
        </Text>

        {/* Shop name */}
        <Text className="text-sm text-gray-500 mb-3 text-center">
          Sold by: {data.shopName}
        </Text>

        {/* Highest Bid */}
        <Text className="text-lg text-green-600 mb-1 text-center">
          Current Highest Bid: ₱{data.currentHighestBid}
        </Text>

        {/* Countdown */}
        <Text className="text-base text-gray-600 text-center">
          {formatTime(remainingTime)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

function BiddingScreen() {
  const [searchQuery, setSearchQuery] = useState(""); // Track search query
  const [filteredData, setFilteredData] = useState(dummyData); // Track filtered data

  // Function to handle search filtering
  const handleSearch = (query) => {
    setSearchQuery(query); // Update the search query

    if (query.trim() === "") {
      setFilteredData(dummyData); // Show all data when search is cleared
    } else {
      const filtered = dummyData.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) || 
        item.shopName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered); // Update the filtered data
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#d1d5db]">
      {/* Search Bar */}
      <View className="flex bg-white shadow-md">
        {/* Pass search function and query to SearchBarC */}
        <SearchBarC value={searchQuery} onChangeText={handleSearch} />
      </View>

      {/* Bidding List */}
      <FlatList
        data={filteredData} // Use filteredData instead of dummyData
        renderItem={({ item }) => <BiddingCard data={item} />}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled // Lock cards in the middle
        snapToAlignment="center"
        decelerationRate="fast"
        snapToInterval={screenWidth * 0.85 + screenWidth * 0.075 * 2} // Width of card plus both margins
        contentContainerStyle={{ paddingHorizontal: screenWidth * 0.002 }}
      />
    </SafeAreaView>
  );
}

export default BiddingScreen;
