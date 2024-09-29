import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import pic from "../../assets/emailotp.png";

function ChangePasswordOTPSCreen({ navigation }) {
  const phoneNumber = '+639123456789'

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

  // Create refs for each TextInput
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);
  const input5Ref = useRef(null);
  const input6Ref = useRef(null);

  const handleInputChange = (text, nextInputRef) => {
    if (text.length === 1 && nextInputRef) {
      nextInputRef.current.focus();
    }
  };

  const handleKeyPress = (e, prevInputRef) => {
    if (e.nativeEvent.key === "Backspace" && prevInputRef) {
      prevInputRef.current.focus();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 justify-center items-center p-6">
        <Image source={pic} className="w-3/4 h-1/4 mb-6" resizeMode="contain" />

        <Text className="text-3xl font-bold mb-4 text-gray-800 text-center">
          Change Password
        </Text>

        <View className="mb-6">
          <Text className="text-gray-600 text-center">
            A 6-digit code has been sent to {phoneNumber}{" "}
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
          <TextInput
            ref={input1Ref}
            className="w-14 p-3 bg-white rounded-lg shadow-md text-center"
            placeholder=""
            keyboardType="numeric"
            maxLength={1}
            onChangeText={(text) => handleInputChange(text, input2Ref)}
            onKeyPress={(e) => handleKeyPress(e, null)}
          />
          <TextInput
            ref={input2Ref}
            className="w-14 p-3 bg-white rounded-lg shadow-md text-center"
            placeholder=""
            keyboardType="numeric"
            maxLength={1}
            onChangeText={(text) => handleInputChange(text, input3Ref)}
            onKeyPress={(e) => handleKeyPress(e, input1Ref)}
          />
          <TextInput
            ref={input3Ref}
            className="w-14 p-3 bg-white rounded-lg shadow-md text-center"
            placeholder=""
            keyboardType="numeric"
            maxLength={1}
            onChangeText={(text) => handleInputChange(text, input4Ref)}
            onKeyPress={(e) => handleKeyPress(e, input2Ref)}
          />
          <TextInput
            ref={input4Ref}
            className="w-14 p-3 bg-white rounded-lg shadow-md text-center"
            placeholder=""
            keyboardType="numeric"
            maxLength={1}
            onChangeText={(text) => handleInputChange(text, input5Ref)}
            onKeyPress={(e) => handleKeyPress(e, input3Ref)}
          />
          <TextInput
            ref={input5Ref}
            className="w-14 p-3 bg-white rounded-lg shadow-md text-center"
            placeholder=""
            keyboardType="numeric"
            maxLength={1}
            onChangeText={(text) => handleInputChange(text, input6Ref)}
            onKeyPress={(e) => handleKeyPress(e, input4Ref)}
          />
          <TextInput
            ref={input6Ref}
            className="w-14 p-3 bg-white rounded-lg shadow-md text-center"
            placeholder=""
            keyboardType="numeric"
            maxLength={1}
            onChangeText={(text) => handleInputChange(text, null)}
            onKeyPress={(e) => handleKeyPress(e, input5Ref)}
          />
        </View>

        <Text className="text-gray-600 mb-4">
          - The OTP will expire in {formatTime(seconds)}
        </Text>

        <View className="flex-row items-center mb-6">
          <Text className="text-gray-600">- Didn’t receive the code? </Text>
          <TouchableOpacity onPress={handleResend}>
            <Text className="text-green-500">Resend</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("New Password")}
          className="w-4/5 p-3 bg-[#00B251] rounded-lg shadow-md"
        >
          <Text className="text-white text-center text-lg">Verify</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default ChangePasswordOTPSCreen;
