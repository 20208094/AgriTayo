import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  Animated,
} from "react-native";
import { useWindowDimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import LoadingAnimation from "../../../../components/LoadingAnimation";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

function BiddingDetailsFarmersScreen({ route, navigation }) {
  const { bidding } = route.params;
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const [shopData, setShopData] = useState("");
  const [shopId, setShopId] = useState("");
  const [timeLeft, setTimeLeft] = useState({});
  const [activeIndex, setActiveIndex] = useState(0); // Added activeIndex state for carousel
  const [selectedImage, setSelectedImage] = useState(null); // State to manage modal image
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userBids, setUserBids] = useState([]);

  const carouselImages = [{uri: bidding.bid_image}, {uri: bidding.bid_image}, {uri: bidding.bid_image}]; // Replace with actual image list

  const onViewRef = React.useRef((viewableItems) => {
    if (viewableItems?.changed?.length > 0) {
      setActiveIndex(viewableItems.changed[0].index); // Update active index when swiping
    }
  });
  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });

  const openImageModal = (image) => {
    setSelectedImage(image);
    setIsModalVisible(true);
  };

  const getAsyncShopData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("shopData");

      if (storedData) {
        const parsedData = JSON.parse(storedData);

        if (Array.isArray(parsedData)) {
          const shop = parsedData[0];
          setShopData(shop);
          setShopId(shop.shop_id);
        } else {
          setUserData(parsedData);
        }
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };

  // Function to calculate the time left until the bid expires
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(bidding.end_date));
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer on component unmount
  }, [bidding.end_date]);

  // Add fetchUserBids function
  const fetchUserBids = async () => {
    try {
      const userBidsResponse = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/userbids`,
        {
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
        }
      );

      if (!userBidsResponse.ok) throw new Error("Error fetching user bids");
      const userBidsData = await userBidsResponse.json();

      // Filter user bids for current bidding
      const relevantUserBids = userBidsData
        .filter(bid => bid.bid_id === bidding.bid_id)
        .sort((a, b) => b.price - a.price);

      setUserBids(relevantUserBids);
    } catch (error) {
      console.error("Error fetching user bids:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update useFocusEffect
  useFocusEffect(
    useCallback(() => {
      getAsyncShopData();
      const interval = setInterval(() => {
        fetchUserBids();
      }, 1000);

      return () => clearInterval(interval);
    }, [bidding])
  );

  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, 100);
  const translateY = diffClamp.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -100],
  });

  const renderMainContent = () => (
    <>
      {/* Content Overlay */}
      <View className="bg-white/80 p-3 rounded-lg mx-5 mt-[25%] self-center w-[90%]">
        <Text className="text-[20px] font-bold text-gray-800 mb-2 text-center">
          {bidding.bid_name}
        </Text>
        <Text className="text-sm text-gray-500 mb-3 text-center">
          Sold by: {shopData.shop_name}
        </Text>
        <Text className="text-lg text-green-600 mb-1 text-center">
          Current Highest Bid: ₱{bidding.bid_current_highest}
        </Text>
        <Text className="text-sm text-gray-500 mb-1 text-center">
          Number of Bids: {userBids.length}
        </Text>
        <Text className="text-sm text-gray-500 mb-1 text-center">
          Ends on: {new Date(bidding.end_date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Manila'
          })}
        </Text>

        {/* Timer */}
        <Text className="text-center text-xl font-semibold text-gray-900 mt-4">
          {timeLeft.expired ? (
            <Text className="text-xl text-red-600">Bid Expired</Text>
          ) : (
            `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`
          )}
        </Text>

        {/* Carousel of images */}
        <AnimatedFlatList
          data={carouselImages}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openImageModal(item)}>
              <Image
                source={item}
                className="w-[200px] h-[200px] rounded-lg mx-2 object-cover"
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          className="mt-4 self-center"
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
          contentContainerStyle={{ justifyContent: "center" }}
        />

        {/* Pagination */}
        <View className="flex-row justify-center mt-4">
          {carouselImages.map((_, index) => (
            <View
              key={index}
              className={`h-2 w-2 rounded-full mx-1 ${
                index === activeIndex ? "bg-green-600" : "bg-gray-300"
              }`}
            />
          ))}
        </View>
      </View>

      {/* Product Details and Description */}
      <View className="px-6 py-8">
        <View className="bg-white/80 rounded-lg p-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-1">
            Product Details
          </Text>
          <Text className="text-base text-gray-600 leading-6" numberOfLines={2}>
            {bidding.bid_description}
          </Text>
          {bidding.bid_description.length > 100 && (
            <TouchableOpacity onPress={() => setShowFullDescription(true)}>
              <Text className="text-green-600 text-base mt-1">Read More</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Current Bids section */}
        <View className="mt-6 bg-white/80 rounded-lg p-4 shadow-sm">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-900">Current Bids</Text>
            <Text className="text-sm text-gray-500">
              Total Bids: {userBids.length}
            </Text>
          </View>
          
          {/* Add the bids list component here */}
          {/* ... copy the bids list code from BiddingDetailsScreen ... */}
        </View>
      </View>
    </>
  );

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1">
        {/* Background Image */}
        <Image
          source={{ uri: bidding.bid_image }}
          className="absolute w-full h-[100%] object-cover -z-1"
          style={{ height: screenHeight * 0.9 }}
        />

        {/* Main Content */}
        <AnimatedFlatList
          data={[{ key: 'main' }]}
          renderItem={() => renderMainContent()}
          contentContainerStyle={{ paddingBottom: 80 }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        />

        {/* Add the modals */}
        {/* ... existing image modal code ... */}

        {/* Full Description Modal */}
        <Modal visible={showFullDescription} transparent={true} animationType="slide">
          <View className="flex-1 justify-center items-center bg-black/70">
            <View className="bg-white rounded-lg p-5 w-[90%] max-h-[80%]">
              <Text className="text-lg font-semibold mb-2">Full Description</Text>
              <ScrollView>
                <Text className="text-base text-gray-600 leading-6">
                  {bidding.bid_description}
                </Text>
              </ScrollView>
              <TouchableOpacity onPress={() => setShowFullDescription(false)} className="mt-5">
                <Text className="text-green-600 text-base text-center">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

export default BiddingDetailsFarmersScreen;
