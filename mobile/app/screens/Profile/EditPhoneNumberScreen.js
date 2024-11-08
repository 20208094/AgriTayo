import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

function EditPhoneNumberScreen({ navigation, route }) {
  const { userData, phone } = route.params;
  const [newPhone, setNewPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCLicked, setIsClicked] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [seconds, setSeconds] = useState(10 * 60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);

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
          console.log("Sending request to update phone number...");
          const response = await fetch(
            `${REACT_NATIVE_API_BASE_URL}/api/editPhoneNumber/${phone}`,
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
            console.log("Successfully Updated Phone Number:", data);
            Alert.alert("Success!", "Successfully Updated Phone Number");
            const updatedUserData = {
              ...userData,
              phone_number: newPhone,
            };

            console.log(updatedUserData);

            await AsyncStorage.setItem(
              "userData",
              JSON.stringify(updatedUserData)
            );
            navigation.goBack(updatedUserData);
            navigation.navigate("View Profile", { userData });
          } else {
            const errorData = await response.json();
            console.error("Adding new phone number failed:", errorData);
            alert("Adding New Phone Number Failed. Please Try Again");
          }
        } catch (error) {
          console.error("Error during adding new phone number:", error);
          alert("An error occurred. Please try again.");
        } finally {
          setLoading(false);
        }
      } else {
        console.log("Form data has errors, not submitting");
      }
    }
  };

  const handleConfirm = () => {
    console.log("Handling new phone number update");
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
        <View className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <Text className="text-2xl font-bold text-green-700 mb-4 text-center">
            Phone Number
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
            <View className="">
              <Text className="">Enter your 6 digit code: </Text>
              <TextInput
                keyboardType="numeric"
                value={otp}
                onChangeText={setOtp}
                placeholder="123456"
              />
              <TouchableOpacity className="" onPress={handleOtp}>
                <Text className="">Submit</Text>
              </TouchableOpacity>
              {otpError ? (
                <Text className="text-center text w-4/5 text-red-500 mb-4">
                  {otpError}
                </Text>
              ) : null}
            </View>
            <Text>- The OTP will expire in {formatTime(seconds)}</Text>
            <TouchableOpacity onPress={handleResend}>
              <Text className="">Resend OTP</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

export default styled(EditPhoneNumberScreen);
