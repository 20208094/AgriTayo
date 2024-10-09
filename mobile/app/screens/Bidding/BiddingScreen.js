import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
  FlatList,
  ScrollView,
  Dimensions,
  TouchableOpacityComponent,
} from "react-native";
import logo from "../../assets/logo.png";
import ehh from "../../assets/ehh.png";
import saging from "../../assets/saging.jpg";
import potato from "../../assets/potato.jpg";
import { useNavigation } from "@react-navigation/native";

// Get screen dimensions for responsive design
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const dummyData = [
  // Dummy data for stacked card carousel
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
    pic: potato,
    michael: ehh,
    shopName: "Michael Shop",
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
    shopName: "Michael Shop",
  },
  {
    id: 3,
    name: "Banana",
    currentHighestBid: 4000,
    price: 700,
    description: "Lorem ipsum dolor sit amet.",
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

// Updated cropCategories with additional data
const cropCategories = [
  {
    categoryName: "Vegetables",
    subCategories: [
      {
        id: 1,
        name: "Carrot",
        currentHighestBid: 500,
        time: "1d 3h",
        day: 1,
        hour: 2,
        minutes: 3,
        seconds: 10,
        price: 200,
        description: "Fresh Carrots from local farms.",
        michael: ehh,
        shopName: "Michael Shop",
        pic: logo,
      },
      {
        id: 2,
        name: "Lettuce",
        currentHighestBid: 600,
        time: "2d 4h",
        day: 2,
        hour: 3,
        minutes: 15,
        seconds: 30,
        price: 150,
        description: "Crispy Lettuce, perfect for salads.",
        michael: ehh,
        shopName: "Michael Shop",
        pic: ehh,
      },
      {
        id: 3,
        name: "Tomato",
        currentHighestBid: 700,
        time: "3d 5h",
        day: 3,
        hour: 5,
        minutes: 25,
        seconds: 45,
        price: 300,
        description: "Juicy Tomatoes full of flavor.",
        michael: ehh,
        shopName: "Michael Shop",
        pic: saging,
      },
    ],
  },
  {
    categoryName: "Fruits",
    subCategories: [
      {
        id: 1,
        name: "Apple",
        currentHighestBid: 1000,
        time: "1d 2h",
        day: 1,
        hour: 2,
        minutes: 10,
        seconds: 20,
        price: 500,
        description: "Crisp and sweet apples.",
        michael: ehh,
        shopName: "Michael Shop",
        pic: potato,
      },
      {
        id: 2,
        name: "Orange",
        currentHighestBid: 1100,
        time: "2d 3h",
        day: 2,
        hour: 3,
        minutes: 45,
        seconds: 50,
        price: 600,
        description: "Sweet and tangy oranges.",
        michael: ehh,
        shopName: "Michael Shop",
        pic: saging,
      },
      {
        id: 3,
        name: "Banana",
        currentHighestBid: 1200,
        time: "3d 4h",
        day: 3,
        hour: 4,
        minutes: 55,
        seconds: 40,
        price: 700,
        description: "Fresh bananas from the tropics.",
        michael: ehh,
        shopName: "Michael Shop",
        pic: ehh,
      },
    ],
  },
  {
    categoryName: "Spices",
    subCategories: [
      {
        id: 1,
        name: "Pepper",
        currentHighestBid: 900,
        time: "1d 3h",
        day: 1,
        hour: 3,
        minutes: 15,
        seconds: 50,
        price: 250,
        description: "Fresh pepper for a spicy kick.",
        michael: ehh,
        shopName: "Michael Shop",
        pic: logo,
      },
      {
        id: 2,
        name: "Ginger",
        currentHighestBid: 800,
        time: "2d 5h",
        day: 2,
        hour: 5,
        minutes: 30,
        seconds: 10,
        price: 300,
        description: "Organic ginger with intense flavor.",
        michael: ehh,
        shopName: "Michael Shop",
        pic: ehh,
      },
    ],
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
        marginHorizontal: 5,
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
              height: screenHeight * 0.3,
              width: screenWidth * 0.6
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

const CategorySection = ({ category }) => {
  const navigation = useNavigation();

  return (
    <View className="mt-5">
      <View className="flex-row justify-between items-center px-4">
        <Text className="text-xl font-bold text-gray-800">{category.categoryName}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Bidding View All",{category})}
        >
          <Text className="flex-1 text-[#00B251] p-1 rounded-2xl italic">View All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={category.subCategories}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Bidding Details", { data: item })}
            className="bg-white m-2 rounded-lg overflow-hidden shadow-md border-gray-500 border-2"
            style={{ width: screenWidth * 0.4, height: screenHeight * 0.25 }}
          >
            <Image
              source={item.pic}
              className="w-full"
              style={{ height: screenHeight * 0.15 }}
              resizeMode="cover"
            />
            <View className="p-2">
              <Text className="text-center font-bold text-gray-800">{item.name}</Text>
              <Text className="text-center text-sm text-green-600">
                Highest Bid: ₱{item.currentHighestBid}
              </Text>
              <Text className="text-center text-xs text-gray-500">{item.time}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

function BiddingScreen() {
  const [filteredData, setFilteredData] = useState(dummyData);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScrollEnd = (event) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / (screenWidth * 0.6)
    );
    setCurrentIndex(index % filteredData.length);
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: currentIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }
  }, [currentIndex]);

  return (
    <SafeAreaView className="flex-1 bg-[#d1d5db]">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={{ height: screenHeight * 0.60 }}>
          {/* Added fixed height for the carousel to prevent overlap */}
          <Animated.FlatList
            ref={flatListRef}
            data={filteredData}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: screenWidth * 0.2,
            }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true }
            )}
            onMomentumScrollEnd={handleScrollEnd}
            scrollEventThrottle={16}
            renderItem={({ item, index }) => {
              const inputRange = [
                (index - 1) * screenWidth * 0.6,
                index * screenWidth * 0.6,
                (index + 1) * screenWidth * 0.6,
              ];

              const scale = scrollX.interpolate({
                inputRange,
                outputRange: [0.85, 1, 0.85],
                extrapolate: "clamp",
              });

              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.7, 1, 0.7],
                extrapolate: "clamp",
              });

              return <BiddingCard data={item} scale={scale} opacity={opacity} />;
            }}
            snapToInterval={screenWidth * 0.6}
            decelerationRate="fast"
          />
        </View>

        {cropCategories.map((category) => (
          <CategorySection key={category.categoryName} category={category} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default BiddingScreen;
