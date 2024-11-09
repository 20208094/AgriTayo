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

function ShopPhonesOTPScreen({ route, navigation }) {
  const { userData, shopData, shopNumber, secondaryShopNumber } = route.params;

  console.log(shopNumber, secondaryShopNumber)

  const [generatedCode, setGeneratedCode] = useState("");
  const [generatedCode2, setGeneratedCode2] = useState("");

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [phone_number, setPhone_Number] = useState("");
  const [seconds, setSeconds] = useState(10 * 60);

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
    console.log("Generated OTP code:", code); // For debugging, remove in production
    setTitle("AgriTayo"),
      setMessage(`Your OTP code is: ${code}`),
      setPhone_Number(shopNumber);
    socket.emit("sms sender", {
      title,
      message,
      phone_number,
    });
  };

  const generateRandomCode2 = () => {
    const code2 = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode2(code2); // Store generated code in state
    console.log("Generated OTP code:", code2); // For debugging, remove in production
    setTitle("AgriTayo"),
      setMessage(`Your OTP code is: ${code2}`),
      setPhone_Number(secondaryShopNumber);
    socket.emit("sms sender", {
      title,
      message,
      phone_number,
    });
  };

  useEffect(() => {
    generateRandomCode();
    generateRandomCode2(); // Generate code on component mount

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
  }, []);

  const handleOtp = async () => {
    setOtpError("");
    setOtpError2("");
    const otpString = otp.join("");
    const otpString2 = otp2.join("");

    if (otpString.length < 6 && otpString2.length < 6) {
      setOtpError("Enter the 6 digit code");
      setOtpError2("Enter the 6 digit code");
    } else if (otpString !== generatedCode && otpString2 !== generatedCode2) {
      setOtpError("Invalid OTP. Please try again.");
      setOtpError2("Invalid OTP. Please try again.");
    } else {
        navigation.navigate("Business Information", {
            userData,
            shopData,
          });
    }
  };

  const handleResend = () => {
    generateRandomCode();
  };

  const handleResend2 = () => {
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

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <GoBack navigation={navigation} />
      <View className="flex-1 justify-center items-center p-6">
        <Image source={pic} className="w-3/4 h-1/4 mb-6" resizeMode="contain" />
        <Text className="text-3xl font-bold mb-4 text-gray-800 text-center">
          Verify Your Shop Phone Numbers
        </Text>

        <View className="mb-6">
          <Text className="text-gray-600 text-center">Phone: {shopNumber}</Text>
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

        <View className="flex-row items-center mb-6">
          <Text className="text-gray-600">- Didn’t receive the code? </Text>
          <TouchableOpacity onPress={handleResend}>
            <Text className="text-green-500">Resend</Text>
          </TouchableOpacity>
        </View>

        {otpError ? (
          <Text className="text-center text w-4/5 text-red-500 mb-4">
            {otpError}
          </Text>
        ) : null}

        <View className='mb-6'>
        <Text className="text-gray-600 text-center">
          Alternative Phone: {secondaryShopNumber}
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
          <TouchableOpacity onPress={handleResend2}>
            <Text className="text-green-500">Resend</Text>
          </TouchableOpacity>
        </View>

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
              onPress={() => setAlertVisible(false)}
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

export default ShopPhonesOTPScreen;
