import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import GoBack from "../../components/GoBack";

function LostPhoneNumberScreen({ navigation }) {
  const phone_regex = /^(?:\+63|0)9\d{2}[-\s]?\d{3}[-\s]?\d{4}$/;
  const [phoneError, setPhoneError] = useState("");

  const [secondaryPhoneNumber, setSecondaryPhoneNumber] = useState("");
  const [phoneNumbersList, setPhoneNumbersList] = useState([]);

  useEffect(() => {
    const fetchPhoneNumbers = async () => {
      try {
        const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/users`, {
          headers: { "x-api-key": REACT_NATIVE_API_KEY },
        });
        if (response.ok) {
          const data = await response.json();
          const numbers = data.map((user) => user.secondary_phone_number);
          setPhoneNumbersList(numbers);
        } else {
          console.error("Failed to fetch phone numbers");
        }
      } catch (error) {
        console.error("Error fetching phone numbers:", error);
      }
    };

    fetchPhoneNumbers();
  }, []);

  const handleConfirm = () => {

    setPhoneError("");

    if (!secondaryPhoneNumber) {
      setPhoneError("Enter your phone number");
      return;
    } else if (!phone_regex.test(secondaryPhoneNumber)) {
      setPhoneError("Invalid phone number format. Please use 09 followed by 9 digits.");
      return;
    } else if (phoneNumbersList.includes(secondaryPhoneNumber)) {
      navigation.navigate("Lost Phone Number OTP", { secondaryPhoneNumber });
      // Alert.alert("Success!", "Secondary Phone Number Confirmed");
    } else {
      Alert.alert("", "Phone number not found. Please try again.");
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <GoBack navigation={navigation}/>
      <View className="flex-1 justify-center items-center px-5">
        <View className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <Text className="text-2xl font-bold text-green-700 mb-4 text-center">
            Enter Your Alternative Phone Number
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
            placeholder="09123456789"
            keyboardType="numeric"
            value={secondaryPhoneNumber}
            onChangeText={setSecondaryPhoneNumber}
          />
          {phoneError ? (
            <Text className="w-4/5 text-red-500 mb-4">{phoneError}</Text>
          ) : null}
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              className="bg-gray-300 px-4 py-2 rounded-lg"
            >
              <Text className="text-gray-700 font-bold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Confirm Secondary Phone Number",
                  "Is this really your secondary phone number?",
                  [
                    {
                      text: "No",
                      style: "cancel",
                    },
                    {
                      text: "Yes",
                      onPress: handleConfirm,
                    },
                  ],
                  { cancelable: false }
                );
              }}
              className="bg-[#00B251] px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-bold text-center">Confirm</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-green-500 text-center mt-4">
          If you did not provide an alternative phone number during registration, please contact the admin at this email (AgriTayo@gmail.com) and send your information.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default styled(LostPhoneNumberScreen);
