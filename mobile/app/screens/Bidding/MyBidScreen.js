import React, { useState, useCallback, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import NavigationbarComponent from "../../components/NavigationbarComponent";
import LoadingAnimation from "../../components/LoadingAnimation";

function MyBidScreen({ navigation }) {
  const [myBidData, setMyBidData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [expiredBidData, setExpiredBidData] = useState([]);
  const [wonBidData, setWonBidData] = useState([]);
  const [checkedOutBidData, setCheckedOutBidData] = useState([]);
  const [currentTab, setCurrentTab] = useState("ongoing");

  const fetchUserId = async () => {
    try {
      const storedData = await AsyncStorage.getItem("userData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData)) {
          const user = parsedData[0];
          setUserId(user.user_id);
          setUserData(user);
        }
      }
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  const fetchUserBids = async () => {
    if (!userId) return;

    try {
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/userbids`,
        {
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
        }
      );

      if (!response.ok) throw new Error("Error fetching user bids");

      const biddingResponse = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/biddings`,
        {
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
        }
      );

      if (!biddingResponse.ok) throw new Error("Error fetching biddings");

      const metricResponse = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/metric_systems`,
        {
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
        }
      );

      if (!metricResponse.ok) throw new Error("Error fetching metrics");

      const shopResponse = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/shops`,
        {
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
        }
      );

      if (!shopResponse.ok) throw new Error("Error fetching shop data");


      // SAVING DATA
      const userBidData = await response.json();
      const biddingData = await biddingResponse.json();
      const metricData = await metricResponse.json();
      const shopData = await shopResponse.json();
      // sort userbids based on id
      const sortedUserBids = [...userBidData].sort((a, b) => b.user_bid_id - a.user_bid_id);
      // filter based on whose logged in
      const filteredUserBids = sortedUserBids.filter(
        (userBid) => userBid.user_id === userId
      );
      // save all bid id of filtered user bids
      const userBidIds = filteredUserBids.map(bid => bid.bid_id);
      // save bid data if user has bid on it
      const filteredBiddingData = biddingData.filter(bid => userBidIds.includes(bid.bid_id));

      // Map through each bid and fetch shop data
      const combinedDataReverse = await Promise.all(filteredBiddingData.map(async (userBidReverse) => {
        const relatedBidding = filteredUserBids.filter(
          (bidding) => userBidReverse.bid_id === bidding.bid_id
        );
        // Find the specific shop associated with the bid
        const newShop = shopData.find((shop) => shop.shop_id === userBidReverse.shop_id);
        const newMetric = metricData.find((metric) => metric.metric_system_id === userBidReverse.metric_system_id);

        return {
          ...userBidReverse,
          bidding: relatedBidding || {},
          shops: newShop || {},
          metrics: newMetric || {},
        };
      }));

      // Filter active bids based on end_date
      const activeBids = combinedDataReverse.filter((bid) => {
        if (bid && bid.end_date) {
          const now = new Date();
          const endDate = new Date(bid.end_date);
          return endDate > now;
        }
        return false;
      });

      // Filter finished bids based on end_date
      const completedBids = combinedDataReverse.filter((bid) => {
        if (bid && bid.end_date) {
          const now = new Date();
          const endDate = new Date(bid.end_date);
          return endDate < now;
        }
        return false;
      });

      // completed bids that the user won
      const wonBids = completedBids.filter((bid) =>
        bid.checked_out !== true && bid.bidding.some((biddingEntry) => biddingEntry.price === bid.bid_current_highest)
      );

      // completed bids that the user lost
      const lostBids = completedBids.filter((bid) =>
        bid.checked_out !== true && bid.bidding.some((biddingEntry) => biddingEntry.price != bid.bid_current_highest)
      );

      // completed bids that the user lost
      const checkedoutBids = completedBids.filter((bid) => bid.checked_out === true);

      setMyBidData(activeBids);
      setWonBidData(wonBids);
      setExpiredBidData(lostBids);
      setCheckedOutBidData(checkedoutBids);
    } catch (error) {
      setAlertMessage(`Error: ${error.message}`);
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserId();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const interval = setInterval(() => {
        fetchUserBids();
      }, 1000);

      return () => clearInterval(interval);
    }, [userId])
  );

  const Countdown = ({ endDate }) => {
    const calculateTimeLeft = () => {
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

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearInterval(timer);
    }, [endDate]);

    return (
      <View className="">
        {timeLeft.expired ? (
          <Text className="text-red-600 font-bold text-base">Bidding Ended</Text>
        ) : (
          <>
            <Text className="text-gray-700 mb-1">
              <Text className="font-semibold text-base">Time Left:</Text>
              <Text className="font-bold text-base text-[#00b251]"> {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{" "}{timeLeft.seconds}s</Text>
            </Text>
          </>
        )}
      </View>
    );
  };

  const handleCheckout = (product) => {
    const selectedItems = [{
      cart_crop_id: null,
      cart_id: product.bid_id,
      cart_metric_system_id: product.metric_system_id,
      cart_total_price: product.bid_current_highest,
      cart_total_quantity: 1,
      cart_user_id: product.bid_user_id,
      crop_id: null,
      crop_image_url: product.bid_image,
      crop_name: product.bid_name,
      crop_price: product.bid_current_highest,
      crop_quantity: 1,
      metric_system_name: product.metrics.metric_system_name,
      metric_system_symbol: product.metrics.metric_system_symbol,
      selected: true,
      shopName: product.shops.shop_name,
      shop_id: product.shop_id,
      crop_class: null,
      crop_description: product.bid_description,
    }];
    
    navigation.navigate("CheckOutScreen", { items: selectedItems, user: userData, order_type: 'bidding', cart_type: 'bidding' });
  };

  if (loading) {
    return (
      <LoadingAnimation />
    );
  }

  const renderBidData = () => {
    switch (currentTab) {
      case "ongoing":
        return (
          <View className="p-4">
            {myBidData.length > 0 ? (
              myBidData.map((myBid) => (
                <View
                  key={myBid.bid_id}
                  className="mb-6 p-6 border border-gray-300 rounded-lg bg-white shadow-md"
                >
                  <TouchableOpacity onPress={() => navigation.navigate('Bidding Details', { data: myBid })}>
                    {/* Bid Content */}
                    <View className="flex-row items-center mb-2">
                      {/* Display Image if Available */}
                      {myBid.bid_image && (
                        <Image
                          source={{ uri: myBid.bid_image }}
                          className="w-24 h-24 rounded-lg mr-4"
                          resizeMode="cover"
                        />
                      )}
                      <View className="flex-1">
                        <Text className="text-gray-700 mb-1">
                          <Text className="font-semibold text-base">Bid Name:</Text>
                          <Text className="font-bold text-base text-[#00b251]"> {myBid.bid_name}</Text>
                        </Text>
                        <Text className="text-gray-700 mb-1">
                          <Text className="font-semibold text-base">Starting Price:</Text>
                          <Text className="font-bold text-base text-[#00b251]"> ₱{myBid.bid_starting_price}</Text>
                        </Text>
                        <Text className="text-gray-700 mb-1">
                          <Text className="font-semibold text-base">Current Highest Bid:</Text>
                          <Text className="font-bold text-base text-[#00b251]"> ₱{myBid.bid_current_highest}</Text>
                        </Text>
                        <Countdown endDate={myBid.end_date} />
                      </View>
                    </View>
                  </TouchableOpacity>
                  {/* Add Another Bid Button */}
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Place a Bid", { data: myBid })
                    }
                    className="flex-row justify-center items-center bg-[#00b251] rounded-lg py-2 mb-2"
                  >
                    <Ionicons name="add-circle-outline" size={24} color="white" />
                    <Text className="ml-2 text-white font-semibold text-base">Add Another Bid</Text>
                  </TouchableOpacity>

                  {/* User Bids */}
                  {myBid.bidding.map((userBid) => (
                    <View
                      key={userBid.user_bid_id}
                      className="mt-1 bg-white px-4 pb-1 rounded-lg shadow-sm border border-gray-400"
                    >
                      {myBid.bid_current_highest === userBid.price ? (
                        <View className="flex-row items-center mb-1">
                          <Text className="text-lg font-extrabold text-[#00b251]">Your Bid:</Text>
                          <Text className="text-lg font-extrabold text-[#00b251] ml-1">₱{userBid.price}</Text>
                          <Text className="text-base font-semibold text-[#00b251] ml-2">(Current Highest Bid)</Text>
                        </View>
                      ) : (
                        <View className="flex-row items-center mb-1">
                          <Text className="text-base font-semibold text-gray-700">Your Bid:</Text>
                          <Text className="text-base font-semibold text-gray-700 ml-1">₱{userBid.price}</Text>
                        </View>
                      )}

                      <View className="flex-row">
                        <Ionicons name="calendar" size={18} color="gray" />
                        <Text className="text-sm text-gray-600 ml-1">Date Bid: {new Date(userBid.bid_date).toLocaleString()}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ))
            ) : (
              <Text className="text-center text-gray-600">No active bids found.</Text>
            )}
          </View>
        );

      case "past":
        return (
          <View className="p-4">
            {expiredBidData.length > 0 ? (
              expiredBidData.map((myBid) => (
                <View
                  key={myBid.bid_id}
                  className="mb-6 p-6 border border-gray-300 rounded-lg bg-white shadow-md"
                >
                  <TouchableOpacity onPress={() => navigation.navigate('Bidding Details', { data: myBid })}>
                    {/* Bid Content */}
                    <View className="flex-row items-center mb-2">
                      {/* Display Image if Available */}
                      {myBid.bid_image && (
                        <Image
                          source={{ uri: myBid.bid_image }}
                          className="w-24 h-24 rounded-lg mr-4"
                          resizeMode="cover"
                        />
                      )}
                      <View className="flex-1">
                        <Text className="text-gray-700 mb-1">
                          <Text className="font-semibold text-base">Bid Name:</Text>
                          <Text className="font-bold text-base text-[#00b251]"> {myBid.bid_name}</Text>
                        </Text>
                        <Text className="text-gray-700 mb-1">
                          <Text className="font-semibold text-base">Starting Price:</Text>
                          <Text className="font-bold text-base text-[#00b251]"> ₱{myBid.bid_starting_price}</Text>
                        </Text>
                        <Text className="text-gray-700 mb-1">
                          <Text className="font-semibold text-base">Current Highest Bid:</Text>
                          <Text className="font-bold text-base text-[#00b251]"> ₱{myBid.bid_current_highest}</Text>
                        </Text>
                        <Text className="text-gray-700 mb-1">
                          <Text className="font-bold text-base text-orange-600">Bidding closed—you didn’t win this bid.</Text>
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  {/* User Bids */}
                  {myBid.bidding.map((userBid) => (
                    <View
                      key={userBid.user_bid_id}
                      className="mt-1 bg-white px-4 pb-1 rounded-lg shadow-sm border border-gray-400"
                    >
                      {myBid.bid_current_highest === userBid.price ? (
                        <View className="flex-row items-center mb-1">
                          <Text className="text-lg font-extrabold text-[#00b251]">Your Bid:</Text>
                          <Text className="text-lg font-extrabold text-[#00b251] ml-1">₱{userBid.price}</Text>
                          <Text className="text-base font-semibold text-[#00b251] ml-2">(Current Highest Bid)</Text>
                        </View>
                      ) : (
                        <View className="flex-row items-center mb-1">
                          <Text className="text-base font-semibold text-gray-700">Your Bid:</Text>
                          <Text className="text-base font-semibold text-gray-700 ml-1">₱{userBid.price}</Text>
                        </View>
                      )}

                      <View className="flex-row">
                        <Ionicons name="calendar" size={18} color="gray" />
                        <Text className="text-sm text-gray-600 ml-1">Date Bid: {new Date(userBid.bid_date).toLocaleString()}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ))
            ) : (
              <Text className="text-center text-gray-600">No active bids found.</Text>
            )}
          </View>
        );

      case "won":
        return (
          <View className="p-4">
            {wonBidData.length > 0 ? (
              wonBidData.map((myBid) => (
                <View
                  key={myBid.bid_id}
                  className="mb-6 p-6 border border-gray-300 rounded-lg bg-white shadow-md"
                >
                  <TouchableOpacity onPress={() => navigation.navigate('Bidding Details', { data: myBid })}>
                    {/* Bid Content */}
                    <View className="flex-row items-center mb-2">
                      {/* Display Image if Available */}
                      {myBid.bid_image && (
                        <Image
                          source={{ uri: myBid.bid_image }}
                          className="w-24 h-24 rounded-lg mr-4"
                          resizeMode="cover"
                        />
                      )}
                      <View className="flex-1">
                        <Text className="text-gray-700 mb-1">
                          <Text className="font-semibold text-base">Bid Name:</Text>
                          <Text className="font-bold text-base text-[#00b251]"> {myBid.bid_name}</Text>
                        </Text>
                        <Text className="text-gray-700 mb-1">
                          <Text className="font-semibold text-base">Highest Bid:</Text>
                          <Text className="font-bold text-base text-[#00b251]"> ₱{myBid.bid_current_highest}</Text>
                        </Text>
                        <Text className="text-gray-700 mb-1">
                          <Text className="font-bold text-base text-orange-600">NOTE: Please check out your bid.</Text>
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  {/* Add Another Bid Button */}
                  <TouchableOpacity
                    onPress={() => handleCheckout(myBid)}
                    className="flex-row justify-center items-center bg-[#00b251] rounded-lg py-2 mb-2"
                  >
                    <Text className="ml-2 text-white font-semibold text-base">Proceed to Checkout</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text className="text-center text-gray-600">No active bids found.</Text>
            )}
          </View>
        );

      case "checkedout":
        return (
          <View className="p-4">
            {checkedOutBidData.length > 0 ? (
              checkedOutBidData.map((myBid) => (
                <View
                  key={myBid.bid_id}
                  className="mb-6 p-6 border border-gray-300 rounded-lg bg-white shadow-md"
                >
                  <TouchableOpacity onPress={() => navigation.navigate('Bidding Details', { data: myBid })}>
                    {/* Bid Content */}
                    <View className="flex-row items-center mb-2">
                      {/* Display Image if Available */}
                      {myBid.bid_image && (
                        <Image
                          source={{ uri: myBid.bid_image }}
                          className="w-24 h-24 rounded-lg mr-4"
                          resizeMode="cover"
                        />
                      )}
                      <View className="flex-1">
                        <Text className="text-gray-700 mb-1">
                          <Text className="font-semibold text-base">Bid Name:</Text>
                          <Text className="font-bold text-base text-[#00b251]"> {myBid.bid_name}</Text>
                        </Text>
                        <Text className="text-gray-700 mb-1">
                          <Text className="font-semibold text-base">Highest Bid:</Text>
                          <Text className="font-bold text-base text-[#00b251]"> ₱{myBid.bid_current_highest}</Text>
                        </Text>
                        <Text className="text-gray-700 mb-1">
                          <Text className="font-bold text-base text-green-600">This bid has already been checked out.</Text>
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text className="text-center text-gray-600">No checkedout bids found.</Text>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="flex-row justify-between items-center px-6 py-4 bg-gray-100 border-b border-gray-300">
          <TouchableOpacity onPress={() => setCurrentTab("ongoing")}>
            <Text
              className={
                currentTab === "ongoing"
                  ? "text-[#00b251] font-bold border-b-2 border-[#00b251] pb-1 text-base"
                  : "text-gray-500 font-medium text-base"
              }
            >
              Ongoing
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentTab("won")}>
            <Text
              className={
                currentTab === "won"
                  ? "text-[#00b251] font-bold border-b-2 border-[#00b251] pb-1 text-base"
                  : "text-gray-500 font-medium text-base"
              }
            >
              Won Bids
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentTab("past")}>
            <Text
              className={
                currentTab === "past"
                  ? "text-[#00b251] font-bold border-b-2 border-[#00b251] pb-1 text-base"
                  : "text-gray-500 font-medium text-base"
              }
            >
              Lost Bids
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentTab("checkedout")}>
            <Text
              className={
                currentTab === "checkedout"
                  ? "text-[#00b251] font-bold border-b-2 border-[#00b251] pb-1 text-base"
                  : "text-gray-500 font-medium text-base"
              }
            >
              Checked Out
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView>


          {renderBidData()}

        </ScrollView>
        {/* Alert Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={alertVisible}
          onRequestClose={() => setAlertVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50 bg-opacity-50">
            <View className="bg-white p-6 rounded-lg shadow-lg w-3/4">
              <Text className="text-lg font-semibold text-gray-900 mb-4">
                {alertMessage}
              </Text>
              <TouchableOpacity
                className="mt-4 p-2 bg-[#00B251] rounded-lg flex-row justify-center items-center"
                onPress={() => setAlertVisible(false)}
              >
                <Ionicons name="checkmark-circle-outline" size={24} color="white" />
                <Text className="text-lg text-white ml-2">OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
      <NavigationbarComponent />
    </>
  );
}

export default MyBidScreen;
