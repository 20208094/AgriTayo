import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import { io } from "socket.io-client";
import { Ionicons } from "@expo/vector-icons";
import GoBack from "../../../components/GoBack";

function EditShopPhoneScreen({ navigation, route }) {
  const { shopId, shopNumber } = route.params;
  const [newPhone, setNewPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCLicked, setIsClicked] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [seconds, setSeconds] = useState(10 * 60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const socket = io(REACT_NATIVE_API_BASE_URL);

  const phone_regex = /^(?:\+63|0)9\d{2}[-\s]?\d{3}[-\s]?\d{4}$/;

  useEffect(() => {
    console.log("New phone input changed:", newPhone);
    if (newPhone && !phone_regex.test(newPhone)) {
      setPhoneError(
        "Invalid phone number format. Please use 09 followed by 9 digits."
      );
    } else {
      setPhoneError("");
    }
  }, [newPhone]);

  useEffect(() => {
    if (isCLicked) {
      const generateRandomCode = () => {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedCode(code);
        console.log("Generated OTP code:", code); // For debugging
        const title = "AgriTayo";
        const message = `Your OTP code is: ${code}`;
        const phone_number = newPhone;
        socket.emit("sms sender", { title, message, phone_number });
      };

      generateRandomCode(); // Generate OTP when isCLicked is true
    }
  }, [isCLicked, newPhone]); // Runs when the OTP button is clicked

  const handleOtp = async () => {
    setOtpError("");

    if (otp.length < 6) {
      setOtpError("Enter the 6 digit code");
    } else if (otp !== generatedCode) {
      setOtpError("Invalid OTP. Please try again.");
    } else {
      const formData = new FormData();
      formData.append("edit_phone_number", newPhone);

      console.log("Form data being sent:", formData);

      let hasError = false;

      if (!hasError && !otpError) {
        setLoading(true);
        try {
          console.log("Sending request to update shop phone number...");
          const response = await fetch(
            `${REACT_NATIVE_API_BASE_URL}/api/editShopPhoneNumber/${shopId}`,
            {
              method: "PUT",
              headers: {
                "x-api-key": REACT_NATIVE_API_KEY,
              },
              body: formData,
            }
          );

          console.log("Response received:", response);

          if (response.ok) {
            const data = await response.json();
            console.log("Successfully Updated Shop Phone Number:", data);
            setAlertMessage("Success!, Successfully Updated Shop Phone Number");
            setAlertVisible(true);
            navigation.navigate("View Shop", { userData });
          } else {
            const errorData = await response.json();
            console.error("Adding new shop phone number failed:", errorData);
            setAlertMessage("Adding New Shop Phone Number Failed. Please Try Again");
            setAlertVisible(true);
          }
        } catch (error) {
          console.error("Error during adding new shop phone number:", error);
          setAlertMessage("An error occurred. Please try again.");
          setAlertVisible(true);
        } finally {
          setLoading(false);
        }
      } else {
        console.log("Form data has errors, not submitting");
      }
    }
  };

  const handleConfirm = () => {
    console.log("Handling new shop phone number update");
    setPhoneError("");

    let hasError = false;

    if (!newPhone) {
      setPhoneError("Enter your new phone number");
      hasError = true;
    } else if (!phone_regex.test(newPhone)) {
      setPhoneError(
        "Invalid phone number format. Please use 09 followed by 9 digits."
      );
      return;
    } else {
      setIsClicked(true); // Enable OTP generation and countdown
    }
  };

  const handleResend = () => {
    setIsClicked(false); // Temporarily set to false to retrigger OTP generation
    setTimeout(() => setIsClicked(true), 0); // Set back to true to generate a new OTP
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 items-center px-5">
        <View className="bg-white mb-10 mt-20 p-6 rounded-lg shadow-md w-full max-w-md">
          <Text className="text-2xl font-bold text-green-700 mb-4 text-center">
            Shop Phone Number
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
            keyboardType="numeric"
            placeholder="09123456789"
            value={newPhone}
            onChangeText={setNewPhone}
          />
          {phoneError ? (
            <Text className="w-4/5 text-red-500 mb-4">{phoneError}</Text>
          ) : null}
          <TouchableOpacity
            onPress={handleConfirm}
            className="bg-green-600 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-bold text-center">Confirm </Text>
          </TouchableOpacity>
        </View>
        {isCLicked && (
          <>
            <View className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
              <Text className="text-2xl font-bold text-green-700 mb-4 text-center">Enter your 6 digit code: </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
                keyboardType="numeric"
                value={otp}
                onChangeText={setOtp}
                placeholder="123456"
              />
              {otpError ? (
                <Text className="text w-4/5 text-red-500 mb-4">
                  {otpError}
                </Text>
              ) : null}
              <TouchableOpacity className="bg-green-600 px-4 py-2 rounded-lg mb-5" onPress={handleOtp}>
                <Text className="text-white font-bold text-center">Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleResend}>
                <Text className="text-center font-bold text-[#00B251]">Resend OTP</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
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

export default styled(EditShopPhoneScreen);
