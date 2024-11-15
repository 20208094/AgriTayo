import React, { useState, useCallback, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Alert
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import Ionicons from "react-native-vector-icons/Ionicons";
import NavigationbarComponent from "../../../../components/NavigationbarComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";

function BiddingScreen({ navigation }) {
  const [biddingData, setBiddingData] = useState([]);
  const [completedBiddingData, setCompletedBiddingData] = useState([]);
  const [currentTab, setCurrentTab] = useState("ongoing");
  const [shopId, setShopId] = useState(null);

  // Function to fetch shop data
  const getAsyncShopData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("shopData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const shop = Array.isArray(parsedData) ? parsedData[0] : parsedData;
        setShopId(shop.shop_id);
      }
    } catch (error) {
      console.error("Error fetching shops:", error);
    } finally {
      setLoading(false);
    }
  };

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
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();

      // Get the current date and time
      const now = new Date();

      // Filter for only available bids
      const availableBids = data.filter(
        (bidding) => new Date(bidding.end_date) > now
      );

      const shopBids = availableBids.filter((bidding) => bidding.shop_id === shopId);

      // Set filtered data to state
      setBiddingData(shopBids);
    } catch (error) {
      alert(`Error fetching bidding systems: ${error.message}`);
    }
  };

  const fetchCompletedBiddings = async () => {
    try {
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/biddings`,
        {
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();

      // Filter for bids with a valid bid_user_id
      const filteredBids = data.filter(
        (bidding) =>
          bidding.bid_user_id !== null && bidding.bid_user_id !== undefined
      );
      const shopBids = filteredBids.filter((bidding) => bidding.shop_id === shopId);

      // Set filtered data to state
      setCompletedBiddingData(shopBids);
    } catch (error) {
      alert(`Error fetching completed biddings: ${error.message}`);
    }
  };

  const deleteBidding = async (bidId) => {
    try {
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/biddings/${bidId}`,
        {
          method: "DELETE",
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to delete the bid");

      // Update state to reflect the deletion
      setBiddingData((prevData) =>
        prevData.filter((bidding) => bidding.bid_id !== bidId)
      );
      Alert.alert("Success", "Bid deleted successfully.");
    } catch (error) {
      alert(`Error deleting the bid: ${error.message}`);
    }
  };

  const handleDeleteConfirmation = (bidId) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this bid?",
      [
        {
          text: "No",
          onPress: () => console.log("Deletion canceled"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => deleteBidding(bidId),
        },
      ],
      { cancelable: true }
    );
  };

  useFocusEffect(
    useCallback(() => {
      getAsyncShopData();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      fetchBiddings();
      fetchCompletedBiddings();
    }, [shopId])
  );

  const renderBidData = () => {
    switch (currentTab) {
      case "ongoing":
        return (
          <ScrollView>
            <View className="flex-col">
              {biddingData.map((bidding) => (
                <BidItem
                  key={bidding.bid_id}
                  bidding={bidding}
                  navigation={navigation}
                  handleDeleteConfirmation={handleDeleteConfirmation}
                />
              ))}
            </View>
          </ScrollView>
        );
      case "completed":
        return (
          <ScrollView>
            <View className="flex-col">
              {completedBiddingData.map((bidding) => (
                <TouchableOpacity
                  key={bidding.bid_id}
                  className="bg-white rounded-lg shadow-md flex-row items-start p-4 mb-4 border border-gray-300"
                  onPress={() =>
                    navigation.navigate("Shop Bidding Details", { bidding })
                  }
                  style={{ elevation: 3 }}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: bidding.bid_image }}
                    className="w-24 h-24 rounded-lg mr-4"
                    resizeMode="cover"
                  />
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-800 mb-1">
                      Bid Name:
                      <Text className="font-bold text-base text-[#00b251]">
                        {" "}
                        {bidding.bid_name}
                      </Text>
                    </Text>
                    <Text className="text-gray-700 mb-1">
                      <Text className="font-semibold text-base">
                        Starting Price:
                      </Text>
                      <Text className="font-bold text-base text-[#00b251]">
                        {" "}
                        ₱{bidding.bid_starting_price}
                      </Text>
                    </Text>
                    <Text className="text-gray-700 mb-1">
                      <Text className="font-semibold text-base">
                        Current Highest Bid:
                      </Text>
                      <Text className="font-bold text-base text-[#00b251]">
                        {" "}
                        ₱{bidding.bid_current_highest}
                      </Text>
                    </Text>
                    {bidding.checked_out === false && (
                      <Text className='text-base text-red-600'>
                        Waiting for the buyer who won to checkout this bid.
                      </Text>
                    )}
                    {bidding.checked_out === true && (
                      <Text className='font-bold text-base text-[#00b251]'>
                        This bid has been checkedout.
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <SafeAreaView className="flex-1 p-4 pt-0 bg-gray-100">
        <View className="flex-row justify-between items-center px-6 py-4 pt-2 bg-gray-100">
          <TouchableOpacity onPress={() => setCurrentTab("ongoing")}>
            <Text
              className={
                currentTab === "ongoing"
                  ? "text-[#00b251] font-bold border-b-2 border-[#00b251] pb-1 text-base"
                  : "text-gray-500 font-medium text-base"
              }
            >
              Ongoing Bids
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setCurrentTab("completed")}>
            <Text
              className={
                currentTab === "completed"
                  ? "text-[#00b251] font-bold border-b-2 border-[#00b251] pb-1 text-base"
                  : "text-gray-500 font-medium text-base"
              }
            >
              Completed Bids
            </Text>
          </TouchableOpacity>
        </View>
        {/* Header Section */}
        <View className="flex-row justify-between items-center mb-4">
          <TouchableOpacity
            className="bg-[#00b251] rounded-lg px-4 py-2 w-full items-center flex-row justify-center"
            onPress={() => navigation.navigate("Add Bid")}
          >

            <Ionicons name="add-circle-outline" size={30} color="white" />
            <Text className="text-white text-lg font-bold ml-1">Create New Bidding</Text>
          </TouchableOpacity>
        </View>

        {renderBidData()}
      </SafeAreaView>
      <NavigationbarComponent />
    </>
  );
}

// Component for rendering a single bid item
const BidItem = ({ bidding, navigation, handleDeleteConfirmation }) => {
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

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(bidding.end_date));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(bidding.end_date));
    }, 1000);

    return () => clearInterval(timer);
  }, [bidding.end_date]);

  return (
    <>
      <TouchableOpacity
        className="bg-white rounded-lg shadow-md flex-row items-start p-4 mb-4 border border-gray-300"
        onPress={() => navigation.navigate("Shop Bidding Details", { bidding })}
        style={{ elevation: 3 }}
        activeOpacity={0.8}
      >

        <Image
          source={{ uri: bidding.bid_image }}
          className="w-24 h-24 rounded-lg mr-3"
          resizeMode="cover"
        />
        <View className="flex-1">

          {/* Conditional Button */}
          {bidding.number_of_bids === 0 && (
            <>
              <View className="flex-row items-end justify-end">
                <TouchableOpacity
                  className=""
                  onPress={() => navigation.navigate('Edit Bid', { bidding })}
                >
                  <Ionicons name="create-outline" size={24} color="#00b251" />
                </TouchableOpacity>
                <TouchableOpacity
                  className="ml-1"
                  onPress={() => handleDeleteConfirmation(bidding.bid_id)}
                >
                  <Ionicons name="trash-outline" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </>
          )}
          <Text className="text-lg font-semibold text-gray-800 mb-1">
            Bid Name:
            <Text className="font-bold text-base text-[#00b251]">
              {" "}
              {bidding.bid_name}
            </Text>
          </Text>
          <Text className="text-gray-700 mb-1">
            <Text className="font-semibold text-base">Starting Price:</Text>
            <Text className="font-bold text-base text-[#00b251]">
              {" "}
              ₱{bidding.bid_starting_price}
            </Text>
          </Text>
          <Text className="text-gray-700 mb-1">
            <Text className="font-semibold text-base">Current Highest Bid:</Text>
            <Text className="font-bold text-base text-[#00b251]">
              {" "}
              ₱{bidding.bid_current_highest}
            </Text>
          </Text>
          {timeLeft.expired ? (
            <Text className="text-base text-red-600">Bid Expired</Text>
          ) : (
            <Text className="font-semibold text-base">
              Time Left:
              <Text className="font-bold text-base text-[#00b251]">
                {" "}
                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{" "}
                {timeLeft.seconds}s
              </Text>
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </>
  );
};

export default BiddingScreen;
