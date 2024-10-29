import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal, // Import Modal
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import Ionicons from 'react-native-vector-icons/Ionicons';


function PlaceABid({ route, navigation }) {
  const { data } = route.params;
  const [timeLeft, setTimeLeft] = useState({});
  const [amount, setAmount] = useState(""); // Initialize amount with an empty string
  const [error, setError] = useState("");
  const [isBidValid, setIsBidValid] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [minValidBid, setMinValidBid] = useState(0); // New state for minValidBid
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(data.end_date));
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer on component unmount
  }, [data.end_date]);

  // Calculate minValidBid and update amount when it is set
  useEffect(() => {
    const minBid =
      parseFloat(data.bid_current_highest) +
      parseFloat(data.bid_minimum_increment);

    setMinValidBid(minBid); // Set minValidBid to the calculated value
    setAmount(minBid.toString()); // Pre-fill amount with minValidBid as soon as it is calculated
  }, [data.bid_current_highest, data.bid_minimum_increment]);

  // Validation for the entered bid amount
  useEffect(() => {
    const enteredAmount = parseFloat(amount);

    if (isNaN(enteredAmount)) {
      setError("Please enter a valid number.");
      setIsBidValid(false);
    } else if (enteredAmount <= data.bid_current_highest) {
      setError(
        `Bid must be higher than the current highest bid of ${data.bid_current_highest}`
      );
      setIsBidValid(false);
    } else if (enteredAmount < minValidBid) {
      setError(
        `Bid must be at least ${minValidBid} (${data.bid_current_highest} + minimum increment of ${data.bid_minimum_increment})`
      );
      setIsBidValid(false);
    } else {
      setError("");
      setIsBidValid(true);
    }
  }, [
    amount,
    minValidBid,
    data.bid_current_highest,
    data.bid_minimum_increment,
  ]);

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

  useFocusEffect(
    useCallback(() => {
      getAsyncUserData();
    }, [])
  );

  // Handle placing a bid
  const handlePlaceBid = async () => {
    if (isBidValid) {
      setLoading(true);
      const bidDetails = {
        bid_id: data.bid_id,
        user_id: userId,
        price: Number(amount),
        bid_current_highest: Number(amount),
        bid_user_id: userId,
        number_of_bids: data.number_of_bids + 1
      };

      try {
        const response = await fetch(
          `${REACT_NATIVE_API_BASE_URL}/api/userbids`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": REACT_NATIVE_API_KEY,
            },
            body: JSON.stringify(bidDetails),
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log("Bid placed successfully:", result);
          setAlertMessage("Success!", "Bid placed successfully!");
          setAlertVisible(true);
          navigation.navigate("My Bids");
        } else {
          console.error("Failed to place bid:", response.statusText);
          setAlertMessage("Failed to place bid. Please try again.");
          setAlertVisible(true);
        }
      } catch (error) {
        console.error("Error placing bid:", error);
        setAlertMessage("Network error. Please try again later.");
        setAlertVisible(true);
      } finally {
        setLoading(false);
      }
    }
  };

  // Function to set the amount to minValidBid
  const setToMinValidBid = () => {
    setAmount(minValidBid.toString()); // Update the input value to minValidBid
  };

  // Function to add bid_minimum_increment to the current amount
  const addMinimumIncrement = () => {
    const newAmount = parseFloat(amount) + parseFloat(data.bid_minimum_increment);
    setAmount(newAmount.toString());
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <View className="items-center mb-5">
        <Image
          source={{ uri: data.bid_image }}
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
        {data.bid_name}
      </Text>
      <Text className="text-lg text-gray-600 mb-4">{data.bid_description}</Text>

      <Text className="text-lg font-bold text-[#00b251] mb-4">
        Current Highest Bid: {data.bid_current_highest}
      </Text>

      <View className="mb-6">
        <Text className="text-base text-gray-700 mb-2">Amount</Text>
        <View className="flex-row items-center">
          <TextInput
            className="border border-gray-300 rounded-lg p-3 text-base text-gray-800 flex-1"
            keyboardType="numeric"
            placeholder="Enter your bid amount"
            value={amount} // Pre-fill with amount (which will be minValidBid)
            onChangeText={setAmount}
          />
          <TouchableOpacity
            className="ml-2 p-2 rounded-lg"
            onPress={setToMinValidBid} // Button to reset amount to minValidBid
          >
            <Ionicons name="refresh-outline" size={24} color="#00b251" />
          </TouchableOpacity>
          <TouchableOpacity
            className="ml-2 p-2 rounded-lg"
            onPress={addMinimumIncrement} // Button to add minimum increment
          >
            <Ionicons name="add-outline" size={24} color="#00b251" />
          </TouchableOpacity>
        </View>
        {error ? <Text className="text-red-600 mt-2">{error}</Text> : null}
      </View>

      <View className="items-center">
        <TouchableOpacity
          className={`w-full py-4 rounded-lg ${isBidValid ? "bg-[#00b251]" : "bg-gray-400"}`}
          onPress={() => setModalVisible(true)} // Show modal instead of directly placing the bid
          disabled={!isBidValid}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-lg font-bold text-center">
              Place Bid
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Modal for confirmation */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg p-6 w-80">
            <Text className="text-lg font-bold mb-4">Confirm Placed Bid</Text>
            <Text className="mb-4">Do you really want to place this bid of {amount}?</Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  console.log("Bid Placement Cancelled");
                }}
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

export default PlaceABid;
