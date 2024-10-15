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
} from "react-native";
import { useWindowDimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

function BiddingDetailsFarmersScreen({ route }) {
  const { bidding } = route.params;
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const [shopData, setShopData] = useState("");
  const [shopId, setShopId] = useState("");
  const [timeLeft, setTimeLeft] = useState({});
  const [activeIndex, setActiveIndex] = useState(0); // Added activeIndex state for carousel
  const [selectedImage, setSelectedImage] = useState(null); // State to manage modal image
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state

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

  useFocusEffect(
    useCallback(() => {
      getAsyncShopData();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1">
        {/* Background Image */}
        <Image
          source={{uri: bidding.bid_image}}
          className="absolute w-full h-[100%] object-cover -z-1"
          style={{ height: screenHeight * 0.7 }} // Dynamic height based on screen size
        />

        {/* Main Content */}
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Content Overlay */}
          <View className="bg-white/80 p-3 rounded-lg mx-5 mt-[45%] self-center w-[90%]">
            {/* Product Name and Details */}
            <Text className="text-center text-2xl font-bold text-gray-900">
              {bidding.bid_name}
            </Text>
            <Text className="text-center text-lg text-gray-500 mt-2">
              Sold by: {shopData.shop_name}
            </Text>

            {/* Current Highest Bid */}
            <Text className="text-center text-xl font-semibold text-green-600 mt-4">
              Current Highest Bid: ₱{bidding.bid_current_highest}
            </Text>

            {/* Timer */}
            <Text className="text-center text-xl font-semibold text-gray-900 mt-4">
              {timeLeft.expired ? (
                "Bid Expired"
              ) : (
                `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`
              )}
            </Text>

            {/* Carousel of images */}
            <FlatList
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

          {/* Product Description */}
          <View className="px-6 py-8">
            <Text className="text-lg font-semibold text-gray-900 mb-1">
              Product Details
            </Text>
            <Text className="text-base text-gray-600 leading-6">
              {bidding.bid_description}
            </Text>
          </View>
        </ScrollView>

        {/* Modal for Full-Screen Image */}
        {selectedImage && (
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="fade"
          >
            <TouchableOpacity
              className="flex-1 bg-black/90 justify-center items-center"
              onPress={() => setIsModalVisible(false)}
            >
              <Image
                source={selectedImage}
                className="w-[90%] h-[70%] object-cover"
              />
            </TouchableOpacity>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
}

export default BiddingDetailsFarmersScreen;
