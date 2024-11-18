import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
} from "react-native";
import pic from "../../assets/emailotp.png";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import { io } from "socket.io-client";
import GoBack from "../../components/GoBack";
import { Ionicons } from "@expo/vector-icons";
import LoadingAnimation from "../../components/LoadingAnimation";

function OTPScreen({ route, navigation }) {
  const { formData, phone, secondaryPhoneNumber } = route.params;
  const [generatedCode, setGeneratedCode] = useState("");
  const [generatedCode2, setGeneratedCode2] = useState("");

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [phone_number, setPhone_Number] = useState("");
  const [seconds, setSeconds] = useState(10 * 60);
  const [secondsSecondary, setSecondsSecondary] = useState(10 * 60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [isResendEnabledSecondary, setIsResendEnabledSecondary] = useState(false);

  const socket = io(REACT_NATIVE_API_BASE_URL);

  // for validation
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otp2, setOtp2] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpError2, setOtpError2] = useState("");
  const [loading, setLoading] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const inputRefs = useRef([]);
  const inputRefs2 = useRef([]);

  const generateRandomCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code); // Store generated code in state
    console.log("Generated OTP code1:", code); // For debugging, remove in production
    const title = "AgriTayo";
    const message = `Your OTP code is: ${code}`;
    const phone_number = phone;
    socket.emit("sms sender", {
      title,
      message,
      phone_number,
    });
  };

  const generateRandomCode2 = () => {
    const code2 = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode2(code2); // Store generated code in state
    console.log("Generated OTP code2:", code2); // For debugging, remove in production
    const title = "AgriTayo";
    const message = `Your OTP code is: ${code2}`;
    const phone_number = secondaryPhoneNumber;
    socket.emit("sms sender", {
      title,
      message,
      phone_number,
    });
  };

  useEffect(() => {
    generateRandomCode();
    generateRandomCode2();
  }, [phone, secondaryPhoneNumber]); 

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

  useEffect(() => {
    let intervalSecondary = null;
    if (secondsSecondary > 0) {
      intervalSecondary = setInterval(() => {
        setSecondsSecondary((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else {
      setIsResendEnabledSecondary(true);
      clearInterval(intervalSecondary);
    }
    return () => clearInterval(intervalSecondary);
  }, [secondsSecondary]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const handleOtp = async () => {
    setOtpError("");
    setOtpError2("");
    const otpString = otp.join("");
    const otpString2 = otp2.join("");

    // Check if both OTPs have 6 digits
    if (otpString.length < 6) {
      setOtpError("Enter the 6 digit code");
    }
    if (otpString2.length < 6) {
      setOtpError2("Enter the 6 digit code");
    }

    // Validate each OTP separately and set appropriate error messages
    if (otpString.length === 6 && otpString !== generatedCode) {
      setOtpError("Invalid OTP. Please try again.");
    }
    if (otpString2.length === 6 && otpString2 !== generatedCode2) {
      setOtpError2("Invalid OTP. Please try again.");
    }

    // If both OTPs are correct, navigate to the next screen
    if (otpString === generatedCode && otpString2 === generatedCode2) {
      setLoading(true);
      try {
        const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/users`, {
          method: "POST",
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Successfully Registered");
          setAlertMessage("Success!, Successfully Registered");
          setAlertVisible(true);
        } else {
          const errorData = await response.json();
          console.error("Registration failed:", errorData);
          setAlertMessage("Registration Failed. Please Try Again");
          setAlertVisible(true);
        }
      } catch (error) {
        console.error("Error during registration:", error);
        setAlertMessage("An error occurred. Please try again.");
        setAlertVisible(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResend = () => {
    setSeconds(10 * 60);
    setIsResendEnabled(false);
    generateRandomCode();
  };

  const handleResend2 = () => {
    setSecondsSecondary(10 * 60);
    setIsResendEnabledSecondary(false);
    generateRandomCode2();
  };

  const handleChangeText = (index, text) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to the next input if available
    if (text.length === 1 && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleChangeText2 = (index, text) => {
    const newOtp = [...otp2];
    newOtp[index] = text;
    setOtp2(newOtp);

    // Move to the next input if available
    if (text.length === 1 && index < 5) {
      inputRefs2.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleKeyPress2 = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && index > 0 && otp2[index] === "") {
      inputRefs2.current[index - 1].focus();
    }
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <GoBack navigation={navigation} />
      <View className="flex-1 justify-center items-center p-6">
        <Image source={pic} className="w-3/4 h-1/4 mb-6" resizeMode="contain" />
        <Text className="text-3xl font-bold mb-4 text-gray-800 text-center">
          Verify Your Phone Numbers
        </Text>
        <View className="mb-6">
          <Text className="font-bold text-gray-600 text-center">
            Phone: {phone}
          </Text>
        </View>
        <View className="flex-row justify-between w-full max-w-xs mb-4">
          {otp.map((value, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)} // Store refs in the array
              className="w-14 p-3 bg-white rounded-lg shadow-md text-center"
              placeholder=""
              keyboardType="numeric"
              maxLength={1}
              onChangeText={(text) => handleChangeText(index, text)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              value={value}
            />
          ))}
        </View>
        {otpError ? (
          <Text className="text-center text w-4/5 text-red-500 mb-4">
            {otpError}
          </Text>
        ) : null}
        <View className="flex-row items-center mb-6">
          <Text className="text-gray-600">- Didn’t receive the code? </Text>
          <TouchableOpacity
            onPress={isResendEnabled ? handleResend : null}
            disabled={!isResendEnabled}
          >
            <Text
              className={`text-${isResendEnabled ? "green-500" : "gray-400"}`}
            >
              Resend
            </Text>
          </TouchableOpacity>
        </View>

        {seconds > 0 && (
          <Text className="text-gray-600 mb-4">
            - The OTP will expire in {formatTime(seconds)}
          </Text>
        )}

        <View className="mb-6">
          <Text className="font-bold text-gray-600 text-center">
            Alternative Phone: {secondaryPhoneNumber}
          </Text>
        </View>
        <View className="flex-row justify-between w-full max-w-xs mb-4">
          {otp2.map((value, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs2.current[index] = ref)} // Store refs in the array
              className="w-14 p-3 bg-white rounded-lg shadow-md text-center"
              placeholder=""
              keyboardType="numeric"
              maxLength={1}
              onChangeText={(text) => handleChangeText2(index, text)}
              onKeyPress={(e) => handleKeyPress2(e, index)}
              value={value}
            />
          ))}
        </View>
        {otpError2 ? (
          <Text className="text-center text w-4/5 text-red-500 mb-4">
            {otpError2}
          </Text>
        ) : null}

        <View className="flex-row items-center mb-6">
          <Text className="text-gray-600">- Didn’t receive the code? </Text>
          <TouchableOpacity
            onPress={isResendEnabledSecondary  ? handleResend2 : null}
            disabled={!isResendEnabledSecondary }
          >
            <Text
              className={`text-${isResendEnabledSecondary  ? "green-500" : "gray-400"}`}
            >
              Resend
            </Text>
          </TouchableOpacity>
        </View>
        {secondsSecondary > 0 && (
          <Text className="text-gray-600 mb-4">
            - The OTP will expire in {formatTime(secondsSecondary)}
          </Text>
        )}
        <TouchableOpacity
          onPress={handleOtp}
          className="w-4/5 p-3 bg-[#00B251] rounded-lg shadow-md"
        >
          <Text className="text-white text-center text-lg">Verify</Text>
        </TouchableOpacity>
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
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              {alertMessage}
            </Text>
            <TouchableOpacity
              className="mt-4 p-2 bg-[#00B251] rounded-lg flex-row justify-center items-center"
              onPress={() => {
                setAlertVisible(false); // Close the alert modal
                navigation.navigate("Login"); // Navigate to "Login" after pressing OK
              }}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={24}
                color="white"
              />
              <Text className="text-lg text-white ml-2">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default OTPScreen;
