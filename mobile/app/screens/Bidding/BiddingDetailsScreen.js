import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
  Modal,
} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

function BiddingDetailsScreen({ route }) {
  const { data } = route.params;

  // Convert initial time to seconds
  const initialTimeInSeconds = data.day * 86400 + data.hour * 3600 + data.minutes * 60;

  // State to store remaining time in seconds
  const [remainingTime, setRemainingTime] = useState(initialTimeInSeconds);

  // State to manage active carousel image
  const [activeIndex, setActiveIndex] = useState(0);

  // State to control image modal visibility
  const [isModalVisible, setIsModalVisible] = useState(false);

  // State to store selected image for full screen view
  const [selectedImage, setSelectedImage] = useState(null);

  // useEffect to handle countdown logic
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(interval); // Stop the timer when it reaches zero
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Clear the interval on component unmount
  }, []);

  // Function to format time in days, hours, and minutes
  const formatTime = (totalSeconds) => {
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  // Dummy carousel images (replace with actual data)
  const carouselImages = [data.pic, data.pic, data.pic]; // Replace with actual image list

  // Pagination for carousel images
  const onViewRef = React.useRef((viewableItems) => {
    if (viewableItems?.changed?.length > 0) {
      setActiveIndex(viewableItems.changed[0].index); // Update active index when swiping
    }
  });
  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });

  // Function to open modal with selected image
  const openImageModal = (image) => {
    setSelectedImage(image);
    setIsModalVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Product Image in the background */}
        <View style={{ position: 'relative', height: screenHeight * 0.55 }}>
          <Image
            source={data.pic}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'cover',
              borderBottomLeftRadius: 40,
              borderBottomRightRadius: 40,
            }}
          />
        </View>

        {/* Content overlay over image */}
        <View
          style={{
            position: 'absolute',
            top: screenHeight * 0.23,
            left: 20,
            right: 20,
            padding: 15,
            borderRadius: 15,
            backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent background
          }}
        >
          {/* Product name and details */}
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#333', textAlign: 'center' }}>
            {data.name}
          </Text>
          <Text style={{ fontSize: 16, color: '#888', textAlign: 'center', marginTop: 5 }}>
            Sold by: {data.shopName}
          </Text>
	  {/* CHB */}
	  <Text style={{ fontSize: 20, fontWeight: '600', color: '#00B251', textAlign: 'center', marginTop: 15 }}>
             Current Highest Bid: ₱{data.currentHighestBid}
          </Text>
          {/* Timer */}
          <Text style={{ fontSize: 20, fontWeight: '600', color: '#333', textAlign: 'center', marginTop: 15 }}>
            {formatTime(remainingTime)}
          </Text>

          {/* Carousel of images */}
          <FlatList
            data={carouselImages}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => openImageModal(item)}>
                <Image
                  source={item}
                  style={{
                    width: screenWidth * 0.5, // Adjust width to display images bigger
                    height: screenWidth * 0.5, // Aspect ratio height
                    borderRadius: 10,
                    marginHorizontal: 5,
                    resizeMode: 'cover',
                  }}
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 5, alignSelf: 'center' }}
            onViewableItemsChanged={onViewRef.current}
            viewabilityConfig={viewConfigRef.current}
            contentContainerStyle={{ justifyContent: 'center' }}
          />

          {/* Pagination indicator */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
            {carouselImages.map((_, index) => (
              <View
                key={index}
                style={{
                  height: 8,
                  width: 8,
                  borderRadius: 4,
                  backgroundColor: index === activeIndex ? '#00B251' : '#ccc',
                  marginHorizontal: 4,
                }}
              />
            ))}
          </View>
        </View>

        {/* Bottom Section - Place a Bid button */}
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            marginBottom: 30,
            marginTop: 50,
            paddingHorizontal: 20,
          }}
        >
          {/* Product Description */}
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 10 }}>
            Product Details
          </Text>
          <Text style={{ fontSize: 14, color: '#666', lineHeight: 20 }}>
            {data.description}
          </Text>

          {/* Place a Bid button */}
          <TouchableOpacity
            style={{
              backgroundColor: '#00B251',
              padding: 15,
              borderRadius: 10,
              marginTop: 20,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: '700', color: '#f9fafb', textAlign: 'center' }}
            >
              Place a Bid
            </Text>
          </TouchableOpacity>
        </View>

        {/* Modal for Full-Screen Image */}
        {selectedImage && (
          <Modal visible={isModalVisible} transparent={true} animationType="fade">
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => setIsModalVisible(false)} //pindot sa gedli para mag close
            >
              <Image
                source={selectedImage}
                style={{
                  width: screenWidth * 0.9,
                  height: screenHeight * 0.7,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </Modal>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default BiddingDetailsScreen;
