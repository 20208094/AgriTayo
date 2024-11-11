import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  SafeAreaView,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Animated,
  FlatList,
  Dimensions,
  Modal,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import NavigationbarComponent from "../../components/NavigationbarComponent";

// Get screen dimensions for responsive design
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

function BiddingBuyerScreen({ navigation }) {
  const [biddingData, setBiddingData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

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
      const shopResponse = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/shops`,
        {
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
        }
      );

      const cropCategoriesResponse = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/crop_categories`,
        {
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");
      if (!shopResponse.ok) throw new Error("Network response was not ok");
      if (!cropCategoriesResponse.ok)
        throw new Error("Network response was not ok");

      const data = await response.json();
      const shopData = await shopResponse.json();
      const cropCategoriesData = await cropCategoriesResponse.json();

      // Filter out expired bids
      const currentTime = new Date();
      const validBids = data.filter(
        (bid) => new Date(bid.end_date) > currentTime
      );

      const filteredCropCategoriesData = cropCategoriesData.filter(
        (category) => {
          return validBids.some(
            (bidding) => bidding.bid_category_id === category.crop_category_id
          );
        }
      );

      // Ensure data and shopData are arrays
      if (Array.isArray(validBids) && Array.isArray(shopData)) {
        const biddingMap = validBids.map((bid) => {
          const newShop = shopData.find((shop) => shop.shop_id === bid.shop_id);

          return {
            ...bid,
            shops: newShop || {},
          };
        });
        setBiddingData(biddingMap);
        setCategoryData(filteredCropCategoriesData);
      } else {
        throw new Error("Invalid data structure from API");
      }
    } catch (error) {
      console.log(`Error fetching bidding systems: ${error.message}`);
      alert(`Error fetching bidding systems: ${error.message}`);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBiddings();
    }, [])
  );

  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScrollEnd = (event) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / (screenWidth * 0.6)
    );
    setCurrentIndex(index % biddingData.length);
  };

  useEffect(() => {
    if (flatListRef.current && biddingData.length > 0) {
      flatListRef.current.scrollToIndex({
        index: currentIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }
  }, [currentIndex, biddingData]);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Bidding Carousel */}
        <View style={{ height: screenHeight * 0.6 }}>
          <Animated.FlatList
            ref={flatListRef}
            data={biddingData}
            keyExtractor={(item) => item.bid_id.toString()}
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

              return (
                <BiddingCard
                  data={item}
                  scale={scale}
                  opacity={opacity}
                  navigation={navigation}
                />
              );
            }}
            snapToInterval={screenWidth * 0.6}
            decelerationRate="fast"
          />
        </View>

        {/* Category Sections */}
        {categoryData.map((category) => (
          <CategorySection
            key={category.crop_category_id}
            category={category}
            biddingData={biddingData}
            navigation={navigation}
          />
        ))}
      </ScrollView>
      
    </SafeAreaView>
  );
}

// Component for each bidding card in the carousel
const BiddingCard = ({ data, scale, opacity, navigation }) => {
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
            source={{ uri: data.bid_image }}
            className="w-full"
            style={{
              height: screenHeight * 0.3,
              width: screenWidth * 0.6,
            }}
            resizeMode="cover"
          />
        </View>
        <View className="p-4">
          <Text className="text-[20px] font-bold text-gray-800 mb-2 text-center">
            {data.bid_name}
          </Text>
          <Text className="text-sm text-gray-500 mb-3 text-center">
            Sold by: {data.shops.shop_name}
          </Text>
          <Text className="text-lg text-green-600 mb-1 text-center">
            Current Highest Bid: ₱{data.bid_current_highest}
          </Text>
          <Countdown endDate={data.end_date} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

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
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{" "}
          {timeLeft.seconds}s
        </Text>
      )}
    </View>
  );
};

// Component for rendering a category section with bids
const CategorySection = ({ data, category, biddingData, navigation }) => {
  const currentTime = new Date();

  return (
    <View className="mt-5">
      <View className="flex-row justify-between items-center px-4">
        <Text className="text-xl font-bold text-gray-800">
          {category.crop_category_name}
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Bidding View All", {
              category,
              biddingData,
              data,
            })
          }
        >
          <Text className="flex-1 text-[#00B251] p-1 rounded-2xl italic">
            View All
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={biddingData.filter(
          (bid) =>
            bid.bid_category_id === category.crop_category_id &&
            new Date(bid.end_date) > currentTime
        )}
        keyExtractor={(item) => item.bid_id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Bidding Details", { data: item })
            }
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
              <Text className="text-center font-bold text-gray-800">
                {item.bid_name}
              </Text>
              <Text className="text-center font-bold text-green-500">
                Current Highest Bid: ₱{item.bid_current_highest}
              </Text>
              <Countdown endDate={item.end_date} />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default BiddingBuyerScreen;
