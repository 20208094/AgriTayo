import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  Dimensions,
} from "react-native";
import { useWindowDimensions } from "react-native";

function MyBidDetailsScreen({ route, navigation}) {
  const { data } = route.params;
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [timeLeft, setTimeLeft] = useState({}); // State for timer

  const carouselImages = [
    { uri: data.bid_image },
    { uri: data.bid_image },
    { uri: data.bid_image },
  ];

  const onViewRef = React.useRef((viewableItems) => {
    if (viewableItems?.changed?.length > 0) {
      setActiveIndex(viewableItems.changed[0].index);
    }
  });
  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });

  const openImageModal = (image) => {
    setSelectedImage(image);
    setIsModalVisible(true);
  };

  // Function to calculate time left
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
      setTimeLeft(calculateTimeLeft(data.end_date)); // Update based on your data structure
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer on component unmount
  }, [data.end_date]);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1">
        {/* Background Image */}
        <Image
          source={{ uri: data.bid_image }}
          className="absolute w-full h-[100%] object-cover -z-1"
          style={{ height: screenHeight * 0.7 }} // Dynamic height based on screen size
        />

        {/* Main Content */}
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Content Overlay */}
          <View className="bg-white/80 p-3 rounded-lg mx-5 mt-[45%] self-center w-[90%]">
            {/* Product Name and Details */}
            <Text className="text-center text-2xl font-bold text-gray-900">
              {data.bid_name}
            </Text>
            <Text className="text-center text-lg text-gray-500 mt-2">
              Sold by: {data.shops.shop_name}
            </Text>

            {/* Current Highest Bid */}
            <Text className="text-center text-xl font-semibold text-green-600 mt-4">
              Current Highest Bid: ₱{data.bid_current_highest}
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

          {/* Product Details, Description, and Button at the Bottom */}
          <View className="px-6 py-8">
            {/* Product Description */}
            <Text className="text-lg font-semibold text-gray-900 mb-1">
              Product Details
            </Text>
            {/* Always truncate the description on the main screen */}
            <Text className="text-base text-gray-600 leading-6" numberOfLines={2}>
              {data.bid_description}
            </Text>

            {/* Read More Button */}
            {data.bid_description.length > 100 && (
              <TouchableOpacity onPress={() => setShowFullDescription(true)}>
                <Text className="text-green-600 text-base mt-1">Read More</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        {/* Modal for Full-Screen Image */}
        {selectedImage && (
          <Modal visible={isModalVisible} transparent={true} animationType="fade">
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

        {/* Modal for Full Description */}
        <Modal visible={showFullDescription} transparent={true} animationType="slide">
          <View className="flex-1 justify-center items-center bg-black/70">
            <View className="bg-white rounded-lg p-5 w-[90%] max-h-[80%]">
              <Text className="text-lg font-semibold mb-2">Full Description</Text>
              <ScrollView>
                <Text className="text-base text-gray-600 leading-6">
                  {data.bid_description}
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

export default MyBidDetailsScreen;
