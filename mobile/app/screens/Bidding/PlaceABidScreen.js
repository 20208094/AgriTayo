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
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";

function PlaceABid({ route }) {
  const { data } = route.params;
  const [timeLeft, setTimeLeft] = useState({});
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isBidValid, setIsBidValid] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

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

  // Validation for the entered bid amount
  useEffect(() => {
    const minValidBid =
      parseFloat(data.bid_current_highest) +
      parseFloat(data.bid_minimum_increment);
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
  }, [amount, data.bid_current_highest, data.bid_minimum_increment]);

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

  const handlePlaceBid = async () => {
    if (isBidValid) {
      setLoading(true);
      const bidDetails = {
        bid_id: data.bid_id,
        user_id: userId,
        price: amount,
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
          alert("Bid placed successfully!");
        } else {
          console.error("Failed to place bid:", response.statusText);
          alert("Failed to place bid. Please try again.");
        }
      } catch (error) {
        console.error("Error placing bid:", error);
        alert("Network error. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <View className="items-center mb-5">
        <Image
          source={{ uri: data.bid_image }}
          className="w-11/12 h-52 rounded-lg"
        />
      </View>
      <Text className="text-xl font-bold text-gray-800 mb-2">{data.bid_name}
      </Text>
      <Text className="text-lg text-gray-600 mb-4">{data.bid_description}
      </Text>
      <Text className="text-lg mb-4 text-center">
        {timeLeft.expired ? (
          <Text className="text-red-600">Bid Expired</Text>
        ) : (
          `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`
        )}
      </Text>
      <Text className="text-lg font-bold text-[#00b251] mb-4">
        Current Highest Bid: {data.bid_current_highest}
      </Text>

      <View className="mb-6">
        <Text className="text-base text-gray-700 mb-2">Amount</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 text-base text-gray-800"
          keyboardType="numeric"
          placeholder="Enter your bid amount"
          value={amount}
          onChangeText={setAmount}
        />
        {error ? <Text className="text-red-600 mt-2">{error}</Text> : null}
      </View>

      <View className="items-center">
        <TouchableOpacity
          className={`w-full py-4 rounded-lg ${
            isBidValid ? "bg-[#00b251]" : "bg-gray-400"
          }`}
          onPress={() => {
            Alert.alert(
              "Confirm Placed Bid",
              "Do you really want to place this bid?",
              [
                { text: "No", style: "cancel" },
                { text: "Yes", onPress: handlePlaceBid },
              ],
              { cancelable: false }
            );
          }}
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
    </SafeAreaView>
  );
}

export default PlaceABid;
