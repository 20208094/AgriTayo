import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";

function LostPhoneNumberScreen({ navigation }) {
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
    if (phoneNumbersList.includes(secondaryPhoneNumber)) {
      navigation.navigate("Lost Phone Number OTP", { secondaryPhoneNumber });
      Alert.alert('Success!','Secondary Phone Number Confirmed')
    } else {
      Alert.alert("Error", "Phone number not found. Please try again.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 justify-center items-center px-5">
        <View className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <Text className="text-2xl font-bold text-green-700 mb-4 text-center">
            Enter Your Secondary Phone Number
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
            placeholder="Enter Secondary Phone Number"
            keyboardType="numeric"
            value={secondaryPhoneNumber}
            onChangeText={setSecondaryPhoneNumber}
          />
          <View className='flex-row justify-between'>
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
            If you didn't put a secondary number during registration, please
            contact the admin using this email (AgriTayo@gmail.com) and send
            your information.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default styled(LostPhoneNumberScreen);
