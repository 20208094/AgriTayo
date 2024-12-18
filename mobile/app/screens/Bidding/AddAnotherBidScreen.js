import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  Modal, // Import Modal
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import Ionicons from 'react-native-vector-icons/Ionicons';


function AddAnotherBid({ route, navigation }) {
  const { myBidId } = route.params;

  const [timeLeft, setTimeLeft] = useState({});
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isBidValid, setIsBidValid] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [minValidBid, setMinValidBid] = useState(0);
  const [myBid, setMyBidData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [numberOfBids, setNumberOfBids] = useState(0);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

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

  // Fetch user bids and calculate time left
  const fetchUserBids = async () => {
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

      const biddingData = await biddingResponse.json();
      const bidData = biddingData.find(bid => bid.bid_id === myBidId);

      setMyBidData(bidData);
      setNumberOfBids(bidData.number_of_bids + 1);

      // Calculate time left immediately after fetching
      setTimeLeft(calculateTimeLeft(bidData.end_date));

    } catch (error) {
      setAlertMessage(`Error: ${error.message}`);
      setAlertVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Update time left every second
  useEffect(() => {
    fetchUserBids();
    const interval = setInterval(() => {
      if (myBid) {
        setTimeLeft(calculateTimeLeft(myBid.end_date));
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount

  }, [myBid, myBidId]);

  // Set minimum bid amount and initialize bid amount when fetching bid data
  useEffect(() => {
    if (myBid) {
      const minBid = parseFloat(myBid.bid_current_highest) + parseFloat(myBid.bid_minimum_increment);
      setMinValidBid(minBid);

      // Only set amount if it hasn't been modified (i.e., it's still an empty string)
      if (amount === "") {
        setAmount(minBid.toString());
      }
    }
  }, [myBid]);

  // Validate the bid amount entered by the user
  useEffect(() => {
    const enteredAmount = parseFloat(amount);
    if (myBid) {
      if (isNaN(enteredAmount)) {
        setError("Please enter a valid number.");
        setIsBidValid(false);
      } else if (enteredAmount <= myBid.bid_current_highest) {
        setError(`Bid must be higher than the current highest bid of ${myBid.bid_current_highest}`);
        setIsBidValid(false);
      } else if (enteredAmount < minValidBid) {
        setError(`Bid must be at least ${minValidBid} (${myBid.bid_current_highest} + minimum increment of ${myBid.bid_minimum_increment})`);
        setIsBidValid(false);
      } else {
        setError("");
        setIsBidValid(true);
      }
    }
  }, [amount, minValidBid, myBid]);

  // Fetching user data from AsyncStorage
  const getAsyncUserData = async () => {
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
      console.error("Failed to load user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle placing a bid
  const handlePlaceBid = async () => {
    if (isBidValid) {
      setLoading(true);
      try {
        const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/userbids`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": REACT_NATIVE_API_KEY,
          },
          body: JSON.stringify({
            user_id: userId,
            bid_id: myBid.bid_id,
            price: amount,
            bid_current_highest: amount,
            bid_user_id: userId,
            number_of_bids: numberOfBids,
          }),
        });

        if (!response.ok) {
          const errorResponseText = await response.text();
          setAlertMessage(`Failed to place bid: ${errorResponseText}`);
          setAlertVisible(true);
          return;
        } else {
          setAlertMessage('Success!, Bid Successfully Added');
          setAlertVisible(true);
          navigation.navigate("My Bids");
        }
      } catch (error) {
        setAlertMessage("Network error. Please try again later.");
        setAlertVisible(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const addMinimumIncrement = () => {
    const newAmount = parseFloat(amount) + parseFloat(myBid.bid_minimum_increment);
    setAmount(newAmount.toString());
  };

  useEffect(() => {
    getAsyncUserData();
  }, []);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <ScrollView>
        <View className="items-center mb-5">
          <Image
            source={{ uri: myBid?.bid_image }} // Use optional chaining
            className="w-11/12 h-52 rounded-lg"
          />
        </View>
        <Text className="text-lg mb-4 text-center">
          {timeLeft.expired ? (
            <Text className="text-red-600">Bid Expired</Text>
          ) : (
            `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`
          )}
        </Text>
        <Text className="text-xl font-bold text-gray-800 mb-2">
          {myBid?.bid_name}
        </Text>
        <Text className="text-lg text-gray-600 mb-4">
          {myBid?.bid_description}
        </Text>

        <Text className="text-lg font-bold text-[#00b251] mb-4">
          Current Highest Bid: {myBid?.bid_current_highest}
        </Text>

        <View className="mb-6">
          <Text className="text-base text-gray-700 mb-2">Amount</Text>
          <View className="flex-row items-center">
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-base text-gray-800 flex-1"
              keyboardType="numeric"
              placeholder="Enter your bid amount"
              value={amount}
              onChangeText={setAmount}
              editable={false}
            />
            <TouchableOpacity
              className="ml-2 p-2 rounded-lg"
              onPress={() => setAmount(minValidBid.toString())}
            >
              <Ionicons name="refresh-outline" size={24} color="#00b251" />
            </TouchableOpacity>
            <TouchableOpacity
              className="ml-2 p-2 rounded-lg"
              onPress={addMinimumIncrement}
            >
              <Ionicons name="add-outline" size={24} color="#00b251" />
            </TouchableOpacity>
          </View>
          {error ? <Text className="text-red-600 mt-2">{error}</Text> : null}
        </View>

        <View className="items-center">
          <TouchableOpacity
            className={`w-full py-4 rounded-lg ${isBidValid ? "bg-[#00b251]" : "bg-gray-400"}`}
            onPress={() => setModalVisible(true)} // Show modal instead of placing bid directly
            disabled={!isBidValid}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-lg font-bold text-center">
                Add Another Bid
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal for Bid Confirmation */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg p-6 w-80">
            <Text className="text-lg font-bold mb-4">Confirm Placed Bid</Text>
            <Text className="mb-4">Do you really want to place this bid of {amount}?</Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setModalVisible(false)} // Close the modal on cancel
                className="bg-gray-300 p-2 rounded"
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  handlePlaceBid(); // Call handlePlaceBid on confirmation
                }}
                className="bg-[#00B251] p-2 rounded"
              >
                <Text className="text-white">Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  );
}

export default AddAnotherBid;
