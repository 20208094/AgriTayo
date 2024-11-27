import React, { useState, useCallback, useEffect } from "react";
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
import { useFocusEffect } from "@react-navigation/native";
import LoadingAnimation from "../../components/LoadingAnimation";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";

function BiddingDetailsScreen({ route, navigation }) {
  const { data } = route.params;
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [timeLeft, setTimeLeft] = useState({});
  const [loading, setLoading] = useState(true);
  const [bidData, setBidData] = useState([]);

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

  const fetchUserBids = async () => {
    if (!data) return;

    try {
      const biddingResponse = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/biddings`,
        {
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
        }
      );

      if (!biddingResponse.ok) throw new Error("Error fetching biddings");

      // SAVING DATA
      const biddingData = await biddingResponse.json();

      // Map through each bid and fetch shop data
      const combinedDataReverse = await Promise.all(biddingData.map(async (userBidReverse) => {
        // Fetch shop data for each bid
        const shopResponse = await fetch(
          `${REACT_NATIVE_API_BASE_URL}/api/shops`,
          {
            headers: {
              "x-api-key": REACT_NATIVE_API_KEY,
            },
          }
        );

        if (!shopResponse.ok) throw new Error("Error fetching shop data");

        const shopData = await shopResponse.json();

        // Find the specific shop associated with the bid
        const newShop = shopData.find((shop) => shop.shop_id === userBidReverse.shop_id);

        return {
          ...userBidReverse,
          shops: newShop || {},
        };
      }));

      const bidSelected = combinedDataReverse.find((bid) => bid.bid_id === data.bid_id);

      setBidData(bidSelected);
    } catch (error) {
      setAlertMessage(`Error: ${error.message}`);
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const interval = setInterval(() => {
        fetchUserBids();
      }, 1000);

      return () => clearInterval(interval);
    }, [data])
  );

  const carouselImages = [
    { uri: bidData.bid_image },
    { uri: bidData.bid_image },
    { uri: bidData.bid_image },
  ];


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
  }, [bidData.end_date]);


  if (loading) {
    return (
      <LoadingAnimation />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1">
        {/* Background Image */}
        <Image
          source={{ uri: bidData.bid_image }}
          className="absolute w-full h-[100%] object-cover -z-1"
          style={{ height: screenHeight * 0.7 }} // Dynamic height based on screen size
        />

        {/* Main Content */}
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Content Overlay */}
          <View className="bg-white/80 p-3 rounded-lg mx-5 mt-[45%] self-center w-[90%]">
            {/* Product Name and Details */}
            <Text className="text-[20px] font-bold text-gray-800 mb-2 text-center">
              {bidData.bid_name}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Seller Shop", { shop_id: bidData.shops.shop_id })}>
              <Text className="text-sm text-gray-500 mb-3 text-center">
                Sold by: {bidData.shops.shop_name}
              </Text>
            </TouchableOpacity>
            <Text className="text-lg text-green-600 mb-1 text-center">
              Current Highest Bid: ₱{bidData.bid_current_highest}
            </Text>
            <Text className="text-sm text-gray-500 mb-1 text-center">
              Number of Bids: {bidData.number_of_bids}
            </Text>
            <Text className="text-sm text-gray-500 mb-1 text-center">
              Ends on: {new Date(bidData.end_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
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
                  className={`h-2 w-2 rounded-full mx-1 ${index === activeIndex ? "bg-green-600" : "bg-gray-300"
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
              {bidData.bid_description}
            </Text>

            {/* Read More Button */}
            {bidData.bid_description.length > 100 && (
              <TouchableOpacity onPress={() => setShowFullDescription(true)}>
                <Text className="text-green-600 text-base mt-1">Read More</Text>
              </TouchableOpacity>
            )}

            {/* Place a Bid Button */}
            {/* Bid User List */}
            <View className="mt-6">
              <Text className="text-lg font-semibold text-gray-900 mb-3">Current Bids</Text>
              <ScrollView className="max-h-[200px] mb-4">
                {bidData.bid_users && bidData.bid_users
                  .sort((a, b) => b.bid_current_highest - a.bid_current_highest)
                  .map((user, index) => (
                    <View key={index} className="flex-row justify-between items-center py-3 border-b border-gray-200">
                      <Text className="text-base">User #{user.bid_user_id}</Text>
                      <Text className="text-base font-semibold">₱{user.bid_current_highest.toLocaleString()}</Text>
                    </View>
                  ))
                }
              </ScrollView>

              {/* Place Bid Button (not floating) */}
              <TouchableOpacity
                className="bg-[#00b251] py-4 rounded-lg w-full mt-2"
                onPress={() => navigation.navigate('Place a Bid', { data: bidData })}
              >
                <Text className="text-lg font-bold text-white text-center">
                  Place a Bid
                </Text>
              </TouchableOpacity>
            </View>
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
                  {bidData.bid_description}
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
