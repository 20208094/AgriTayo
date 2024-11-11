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
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const fetchUserId = async () => {
    try {
      const storedData = await AsyncStorage.getItem("userData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData)) {
          const user = parsedData[0];
          setUserId(user.user_id);
        }
      }
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  const fetchUserBids = async () => {
    if (!userId) return;
    setLoading(true)

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

      const userBidData = await response.json();

      const sortedUserBids = [...userBidData].sort((a, b) => b.user_bid_id - a.user_bid_id);

      const filteredUserBids = sortedUserBids.filter(
        (userBid) => userBid.user_id === userId
      );

      const userBidIds = filteredUserBids.map(bid => bid.bid_id);

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

      const filteredBiddingData = biddingData.filter(bid => userBidIds.includes(bid.bid_id));

      const combinedDataReverse = filteredBiddingData.map((userBidReverse) => {
        const relatedBidding = filteredUserBids.filter(
          (bidding) => userBidReverse.bid_id === bidding.bid_id
        );

        return {
          ...userBidReverse,
          bidding: relatedBidding || {},
        };
      });

      const activeBids = combinedDataReverse.filter((bid) => {
        if (bid && bid.end_date) {
          const now = new Date();
          const endDate = new Date(bid.end_date);
          return endDate > now;
        }
        return false;
      });

      setMyBidData(activeBids);
    } catch (error) {
      setAlertMessage(`Error: ${error.message}`);
      setAlertVisible(true);
    } finally {
      setLoading(false)
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserId();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      fetchUserBids();
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

  if (loading) {
    return (
      <LoadingAnimation />
    );
  }

  return (
    <>
      <SafeAreaView className="flex-1 bg-gray-100">
        <ScrollView>
          {/* Header Section */}
          <View className="flex-row justify-between items-center px-6 py-4 bg-gray-100 border-b border-gray-300">
            <TouchableOpacity onPress={() => navigation.navigate("My Bids")}>
              <Text className="text-[#00b251] font-bold border-b-2 border-[#00b251] pb-1">
                Ongoing
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Past Bids")}>
              <Text className="text-gray-500 font-medium">Past</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Won Bids")}>
              <Text className="text-gray-500 font-medium">Won</Text>
            </TouchableOpacity>
          </View>

          {/* Bids Section */}
          <View className="p-4">
            {myBidData.length > 0 ? (
              myBidData.map((myBid) => (
                <View
                  key={myBid.bid_id}
                  className="mb-6 p-6 border border-gray-300 rounded-lg bg-white shadow-md"
                >
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

                  {/* Add Another Bid Button */}
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Add Another Bid", { myBidId: myBid.bid_id })
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
                      className="mt-1 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-400"
                    >
                      {myBid.bid_current_highest === userBid.price ? (
                        <View className="flex-row items-center mb-2">
                          <Text className="text-lg font-extrabold text-[#00b251]">Your Bid:</Text>
                          <Text className="text-lg font-extrabold text-[#00b251] ml-2">₱{userBid.price}</Text>
                          <Text className="text-sm font-semibold text-[#00b251] ml-2">(Current Highest Bid)</Text>
                        </View>
                      ) : (
                        <View className="flex-row items-center mb-2">
                          <Text className="text-lg font-semibold text-gray-800">Your Bid:</Text>
                          <Text className="text-lg font-semibold text-gray-800 ml-2">₱{userBid.price}</Text>
                        </View>
                      )}

                      <View className="flex-row">
                        <Ionicons name="calendar" size={20} color="gray" />
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
              <Text className="text-lg font-semibold text-gray-900 mb-4">{alertMessage}</Text>
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
