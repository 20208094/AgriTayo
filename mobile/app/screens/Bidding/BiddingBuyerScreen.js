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
        className="mt-6 mx-auto bg-white rounded-2xl border-2 border-green-600 shadow-2xl shadow-black"
      >
        <View className="rounded-t-xl overflow-hidden">
          <Image
            source={{ uri: data.bid_image }}
            className="w-full"
            style={{
              height: screenHeight * 0.25,
            }}
            resizeMode="cover"
          />
        </View>
        <View className="pt-1 pb-3 px-4">
          {/* NAME */}
          <Text className="text-2xl font-bold text-gray-800 text-center ">
            {data.bid_name}
          </Text>
          {/* PRESSABLE SHOP */}
          <TouchableOpacity
            className="flex-row items-center justify-center border-2 border-green-400 rounded-md my-1 p-1 px-2"
            onPress={() => navigation.navigate("Seller Shop", { shop_id: data.shops.shop_id })}
          >
            <View className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
              <Image source={data.shops.shop_image_url ? { uri: data.shops.shop_image_url } : placeholderimg} className="w-full h-full" />
            </View>
            <Text className="text-base text-center ml-2 font-semibold text-gray-700">{data.shops.shop_name}</Text>
          </TouchableOpacity>
          {/* OTHER INFORMATIONS */}
          <View className="flex-row items-center">
            <Text className="text-sm text-green-700 ">
              Current Highest Bid:
            </Text>
            <Text className="text-base text-gray-700 ml-1">
              ₱{parseFloat(data.bid_current_highest).toFixed(2)}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-sm text-green-700">
              Number of Bids:
            </Text>
            <Text className="text-base text-gray-700 ml-1">
              {data.number_of_bids} Bids
            </Text>
          </View>
          <Text className="text-sm text-green-700">
            Ends On:
          </Text>
          <Text className="text-gray-700 text-center text-base">
            {new Date(data.end_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
          <View className="flex-col border border-white">
            <Text className="text-sm text-green-700">
              Time Left:
            </Text>
            <View className="text-base text-gray-700 items-center ml-1">
              <Countdown endDate={data.end_date} />
            </View>
          </View>
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
    <View className="">
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
        contentContainerStyle={{
          paddingHorizontal: 16, // Add padding on both sides
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Bidding Details", { data: item })
            }
            className="bg-white m-2 rounded-lg overflow-hidden shadow-md border-gray-500 border-2"
          >
            <Image
              source={{ uri: item.bid_image }}
              className="w-full"
              style={{ height: screenHeight * 0.15 }}
              resizeMode="cover"
            />
            <View className="p-4">
              {/* NAME */}
              <Text className="text-2xl font-bold text-gray-800 text-center ">
                {item.bid_name}
              </Text>
              {/* PRESSABLE SHOP */}
              <TouchableOpacity
                className="flex-row items-center justify-center border-2 border-green-400 rounded-md my-1 p-1 px-2"
                onPress={() => navigation.navigate("Seller Shop", { shop_id: item.shops.shop_id })}
              >
                <View className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
                  <Image source={item.shops.shop_image_url ? { uri: item.shops.shop_image_url } : placeholderimg} className="w-full h-full" />
                </View>
                <Text className="text-base text-center ml-2 font-semibold text-gray-700">{item.shops.shop_name}</Text>
              </TouchableOpacity>
              {/* OTHER INFORMATIONS */}
              <View className="flex-row items-center">
                <Text className="text-sm text-green-700 ">
                  Current Highest Bid:
                </Text>
                <Text className="text-base text-gray-700 ml-1">
                  ₱{parseFloat(item.bid_current_highest).toFixed(2)}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-sm text-green-700">
                  Number of Bids:
                </Text>
                <Text className="text-base text-gray-700 ml-1">
                  {item.number_of_bids} Bids
                </Text>
              </View>
              <Text className="text-sm text-green-700">
                Ends On:
              </Text>
              <Text className="text-gray-700 text-center text-base">
                {new Date(item.end_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
              <View className="flex-col border border-white">
                <Text className="text-sm text-green-700">
                  Time Left:
                </Text>
                <View className="text-base text-gray-700 items-center ml-1">
                  <Countdown endDate={item.end_date} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default BiddingBuyerScreen;
