import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import GoBack from "../../components/GoBack";
import { Ionicons } from "@expo/vector-icons";

function LostPhoneNumberScreen({ navigation }) {
  const phone_regex = /^(?:\+63|0)9\d{2}[-\s]?\d{3}[-\s]?\d{4}$/;
  const [phoneError, setPhoneError] = useState("");

  const [secondaryPhoneNumber, setSecondaryPhoneNumber] = useState("");
  const [phoneNumbersList, setPhoneNumbersList] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

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
    } else {
      setAlertMessage("Phone number not found. Please try again.");
      setAlertVisible(true);
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
                setAlertMessage(`Is this really your alternative phone number? \n(${secondaryPhoneNumber})`);
                setConfirmModalVisible(true);
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

      {/* Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 bg-opacity-50">
          <View className="bg-white p-6 rounded-lg shadow-lg w-3/4">
            <Text className="text-lg font-semibold text-gray-900 mb-4 text-center">
              {alertMessage}
            </Text>
            <View className="flex-row justify-between mt-4">
              <TouchableOpacity
                className="p-2 bg-gray-300 rounded-lg flex-row justify-center items-center w-1/3"
                onPress={() => setConfirmModalVisible(false)}
              >
                <Text className="text-lg text-gray-800 text-center">No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="p-2 bg-[#00B251] rounded-lg flex-row justify-center items-center w-1/3"
                onPress={() => {
                  setConfirmModalVisible(false);
                  handleConfirm();
                }}
              >
                <Text className="text-lg text-white text-center">Yes</Text>
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

export default styled(LostPhoneNumberScreen);
