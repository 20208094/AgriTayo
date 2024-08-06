import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import pic from "../../assets/emailotp.png"; // Update with the correct image for phone OTP

function PhoneAuthenticationScreen({ navigation, route }) {
  const { profile } = route.params;

  // Timer state
  const [seconds, setSeconds] = useState(10 * 60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);

  useEffect(() => {
    let interval = null;
    if (seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else {
      setIsResendEnabled(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [seconds]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleResend = () => {
    setSeconds(10 * 60);
    setIsResendEnabled(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 justify-center items-center p-6">
        <Image source={pic} className="w-3/4 h-1/4 mb-6" resizeMode="contain" />

        <Text className="text-3xl font-bold mb-4 text-gray-800 text-center">
          Verify with Text Message
        </Text>

        <View className="mb-6">
          <Text className="text-gray-600 text-center">
            A 6-digit code will be sent to {profile.phone}
          </Text>
        </View>

        <Text className="text-gray-600 mb-4 text-center">
          Please enter the authentication code.
        </Text>

        <View className="flex-row justify-between w-full max-w-xs mb-4">
          <TextInput
            className="w-14 p-3 bg-white rounded-lg shadow-md text-center"
            placeholder=""
            keyboardType="numeric"
            maxLength={1}
          />
          <TextInput
            className="w-14 p-3 bg-white rounded-lg shadow-md text-center"
            placeholder=""
            keyboardType="numeric"
            maxLength={1}
          />
          <TextInput
            className="w-14 p-3 bg-white rounded-lg shadow-md text-center"
            placeholder=""
            keyboardType="numeric"
            maxLength={1}
          />
          <TextInput
            className="w-14 p-3 bg-white rounded-lg shadow-md text-center"
            placeholder=""
            keyboardType="numeric"
            maxLength={1}
          />
          <TextInput
            className="w-14 p-3 bg-white rounded-lg shadow-md text-center"
            placeholder=""
            keyboardType="numeric"
            maxLength={1}
          />
          <TextInput
            className="w-14 p-3 bg-white rounded-lg shadow-md text-center"
            placeholder=""
            keyboardType="numeric"
            maxLength={1}
          />
        </View>

        <Text className="text-gray-600 mb-4">
          - The OTP will expire in {formatTime(seconds)}
        </Text>

        <View className="flex-row items-center mb-6">
          <Text className="text-gray-600">Didn’t receive the code? </Text>
          <TouchableOpacity onPress={handleResend} disabled={!isResendEnabled}>
            <Text className={`text-green-500 ${isResendEnabled ? '' : 'opacity-50'}`}>
              Resend
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("Shop Information", { profile })}
          className="w-4/5 p-3 bg-[#00B251] rounded-lg shadow-md"
        >
          <Text className="text-white text-center text-lg">Verify</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default PhoneAuthenticationScreen;