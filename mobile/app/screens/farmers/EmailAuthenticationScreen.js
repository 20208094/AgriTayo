import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import pic from "../../assets/emailotp.png";

function EmailAuthenticationScreen({ navigation, route }) {
  const { profile } = route.params;

  const [emailAuthentication, setEmailAuthentication] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [emailAuthenticationError, setEmailAuthenticationError] = useState("");

  const handleEmailAuthentication = () => {
    setEmailAuthenticationError("");
    const emailAuthenticationString = emailAuthentication.join("");

    if (emailAuthenticationString.length < 6) {
      setEmailAuthenticationError("Enter the 6 digit code");
    } else {
      navigation.navigate("Shop Information", { profile });
    }
  };

  const handleChangeText = (index, text) => {
    const newEmailAuthentication = [...emailAuthentication];
    newEmailAuthentication[index] = text;
    setEmailAuthentication(newEmailAuthentication);
  };

  const email = "example@gmail.com";
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
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
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
          Verify Your Email
        </Text>

        <View className="mb-6">
          <Text className="text-gray-600 text-center">
            A 6-digit code has been sent to {email}{" "}
          </Text>
          <View className="flex-row justify-center">
            <TouchableOpacity
              onPress={() => navigation.navigate("Change Email")}
            >
              <Text className="text-green-500">Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row justify-between w-full max-w-xs mb-4">
          {emailAuthentication.map((value, index) => (
            <TextInput
              key={index}
              className="w-14 p-3 bg-white rounded-lg shadow-md text-center"
              placeholder=""
              keyboardType="numeric"
              maxLength={1}
              onChangeText={(text) => handleChangeText(index, text)}
              value={value}
            />
          ))}
        </View>

        {emailAuthenticationError ? (
          <Text className="text-center text w-4/5 text-red-500 mb-4 ">
            {emailAuthenticationError}
          </Text>
        ) : null}

        <Text className="text-gray-600 mb-4">
          - The OTP will expire in {formatTime(seconds)}
        </Text>

        <View className="flex-row items-center mb-6">
          <Text className="text-gray-600">-Didn’t receive the code? </Text>
          <TouchableOpacity onPress={handleResend}>
            <Text className="text-green-500">Resend</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleEmailAuthentication}
          className="w-4/5 p-3 bg-[#00B251] rounded-lg shadow-md"
        >
          <Text className="text-white text-center text-lg">Verify</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default EmailAuthenticationScreen;
