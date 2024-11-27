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
  useWindowDimensions,
  Animated,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import LoadingAnimation from "../../components/LoadingAnimation";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

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
  const [userBids, setUserBids] = useState([]);

  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, 100);
  const translateY = diffClamp.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -100],
  });

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
      // Fetch bidding data
      const biddingResponse = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/biddings`,
        {
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
        }
      );

      if (!biddingResponse.ok) throw new Error("Error fetching biddings");
      const biddingData = await biddingResponse.json();

      // Fetch user bids
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
        .filter(bid => bid.bid_id === data.bid_id)
        .sort((a, b) => b.price - a.price); // Sort by price descending

      setUserBids(relevantUserBids);

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

  const renderMainContent = () => (
    <>
      {/* Content Overlay */}
      <View className="bg-white/80 p-3 rounded-lg mx-5 mt-[25%] self-center w-[90%]">
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
            {bidData.bid_description}
          </Text>
          {bidData.bid_description.length > 100 && (
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
          
          <View style={{ maxHeight: 300 }}> 
            <ScrollView 
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
            >
              <View>
                {userBids.map((item, index) => (
                  <View
                    key={index}
                    className={`flex-row justify-between items-center py-4 px-5`}
                    style={{
                      backgroundColor: index === 0 ? '#f0fdf4' : 'transparent',
                      borderBottomWidth: index !== userBids.length - 1 ? 1 : 0,
                      borderBottomColor: '#f3f4f6'
                    }}
                  >
                    <View className="flex-row items-center">
                      <View 
                        className="w-8 h-8 rounded-full items-center justify-center mr-3"
                        style={{
                          backgroundColor: index === 0 ? '#dcfce7' : '#f3f4f6'
                        }}
                      >
                        <Text 
                          style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: index === 0 ? '#15803d' : '#4b5563'
                          }}
                        >
                          {index + 1}
                        </Text>
                      </View>
                      <View>
                        <Text 
                          style={{
                            fontSize: 16,
                            fontWeight: index === 0 ? '700' : '400',
                            color: index === 0 ? '#111827' : '#374151'
                          }}
                        >
                          User #{item.user_id}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          {new Date(item.bid_date).toLocaleString()}
                        </Text>
                      </View>
                    </View>
                    <Text 
                      style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: index === 0 ? '#16a34a' : '#111827'
                      }}
                    >
                      ₱{item.price.toLocaleString()}
                    </Text>
                  </View>
                ))}
                
                {userBids.length === 0 && (
                  <View className="py-8 items-center">
                    <Text className="text-gray-500">No bids yet</Text>
                    <Text className="text-sm text-gray-400 mt-1">
                      Be the first to place a bid!
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </>
  );

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

        {/* Floating Place Bid Button */}
        <Animated.View
          className="absolute bottom-0 left-0 right-0 bg-transparent px-4 py-3"
          style={{
            transform: [{ translateY }],
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        >
          <TouchableOpacity
            className="bg-[#00b251] py-4 rounded-lg w-full"
            onPress={() => navigation.navigate('Place a Bid', { data: bidData })}
          >
            <Text className="text-lg font-bold text-white text-center">
              Place a Bid
            </Text>
          </TouchableOpacity>
        </Animated.View>

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
