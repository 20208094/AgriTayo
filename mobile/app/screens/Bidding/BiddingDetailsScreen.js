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
  Dimensions
} from "react-native";
import { useWindowDimensions } from 'react-native';

function BiddingDetailsScreen({ route }) {
  const { data } = route.params;
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const initialTimeInSeconds = data.day * 86400 + data.hour * 3600 + data.minutes * 60;
  const [remainingTime, setRemainingTime] = useState(initialTimeInSeconds);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

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

  const carouselImages = [data.pic, data.pic, data.pic];

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

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1">
        {/* Background Image */}
        <Image
          source={data.pic}
          className="absolute w-full h-[100%] object-cover -z-1"
          style={{ height: screenHeight * 0.7 }} // Dynamic height based on screen size
        />

        {/* Main Content */}
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Content Overlay */}
          <View className="bg-white/80 p-3 rounded-lg mx-5 mt-[45%] self-center w-[90%]">
            {/* Product Name and Details */}
            <Text className="text-center text-2xl font-bold text-gray-900">
              {data.name}
            </Text>
            <Text className="text-center text-lg text-gray-500 mt-2">
              Sold by: {data.shopName}
            </Text>

            {/* Current Highest Bid */}
            <Text className="text-center text-xl font-semibold text-green-600 mt-4">
              Current Highest Bid: ₱{data.currentHighestBid}
            </Text>

            {/* Timer */}
            <Text className="text-center text-xl font-semibold text-gray-900 mt-4">
              {formatTime(remainingTime)}
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
              contentContainerStyle={{ justifyContent: 'center' }}
            />

            {/* Pagination */}
            <View className="flex-row justify-center mt-4">
              {carouselImages.map((_, index) => (
                <View
                  key={index}
                  className={`h-2 w-2 rounded-full mx-1 ${
                    index === activeIndex ? 'bg-green-600' : 'bg-gray-300'
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
              {data.description}
            </Text>

            {/* Read More Button */}
            {data.description.length > 100 && (
              <TouchableOpacity onPress={() => setShowFullDescription(true)}>
                <Text className="text-green-600 text-base mt-1">Read More</Text>
              </TouchableOpacity>
            )}

            {/* Place a Bid Button */}
            <TouchableOpacity className="bg-green-600 py-4 rounded-lg mt-6">
              <Text className="text-lg font-bold text-white text-center">
                Place a Bid
              </Text>
            </TouchableOpacity>
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
                  {data.description}
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

export default BiddingDetailsScreen;