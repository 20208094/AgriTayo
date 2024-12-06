import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons"; // Import FontAwesome5 for icons
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import LoadingAnimation from "../../components/LoadingAnimation";
import { useFocusEffect } from '@react-navigation/native';

function LoginScreen({ navigation, fetchUserSession }) {
  const [formData, setFormData] = useState({
    phone_number: "",
    password: "",
  });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [secondaryPhoneNumber, setSecondaryPhoneNumber] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);

  // New state for toggling password visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const password_regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,30}$/;
  const phone_regex = /^(?:\+63|0)9\d{2}[-\s]?\d{3}[-\s]?\d{4}$/;

  const [phoneNumbersList, setPhoneNumbersList] = useState([]);
  const [secondaryPhoneNumbersList, setSecondaryPhoneNumbersList] = useState(
    []
  );

  // Modal control states
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Add a new state for the second confirmation modal
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmModalMessage, setConfirmModalMessage] = useState("");

  useEffect(() => {
    const fetchPhoneNumbers = async () => {
      try {
        const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/users`, {
          headers: { "x-api-key": REACT_NATIVE_API_KEY },
        });
        if (response.ok) {
          const data = await response.json();
          const numbers = data.map((user) => user.phone_number);
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

  const handleConfirms = () => {
    setPhoneError("");

    if (!phoneNumber) {
      setPhoneError("Enter your phone number");
      return;
    } else if (!phone_regex.test(phoneNumber)) {
      setPhoneError(
        "Invalid phone number format. Please use 09 followed by 9 digits."
      );
      return;
    } else if (phoneNumbersList.includes(phoneNumber)) {
      navigation.navigate("Change Password OTP", { phoneNumber });
      setAlertMessage("Phone Number Confirmed");
      setAlertVisible(true);
    } else {
      setAlertMessage("Phone number not found. Please try again.");
      setAlertVisible(true);
    }
  };

  const openConfirmationAlert = () => {
    setAlertMessage(`Is this really your phone number?\n${phoneNumber}`);
    setAlertVisible(true);
  };

  useEffect(() => {
    const fetchPhoneNumbers = async () => {
      try {
        const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/users`, {
          headers: { "x-api-key": REACT_NATIVE_API_KEY },
        });
        if (response.ok) {
          const data = await response.json();
          const numbers = data.map((user) => user.secondary_phone_number);
          setSecondaryPhoneNumbersList(numbers);
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
      setPhoneError(
        "Invalid phone number format. Please use 09 followed by 9 digits."
      );
      return;
    } else if (secondaryPhoneNumbersList.includes(secondaryPhoneNumber)) {
      navigation.navigate("Lost Phone Number OTP", { secondaryPhoneNumber });
    } else {
      setAlertMessage("Phone number not found. Please try again.");
      setAlertVisible(true);
    }
  };

  const openSecondaryPhoneConfirmation = () => {
    setConfirmModalMessage(`Is this really your alternative phone number? \n${secondaryPhoneNumber}`);
    setConfirmModalVisible(true);
  };

  useEffect(() => {
    const fetchUserSession = async () => {
      console.log("came to session...");
      try {
        console.log("Fetching user session...");
        const response = await fetch(
          `${REACT_NATIVE_API_BASE_URL}/api/session`,
          {
            headers: {
              "x-api-key": REACT_NATIVE_API_KEY,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log("User session data:", data);
          if (data.user) {
            console.log("User is logged in, navigating to HomePageScreen");
            navigation.navigate("HomePageScreen");
          } else {
            console.log("No user found in session");
          }
        }
      } catch (error) {
        console.error("Login Error fetching user session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSession();
  }, [navigation]);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async () => {
    setPhoneError("");
    setPasswordError("");

    let hasError = false;

    if (!formData.phone_number) {
      setPhoneError("Enter your phone number");
      hasError = true;
    } else if (!phone_regex.test(formData.phone_number)) {
      setPhoneError(
        "Invalid phone number format. Please use 09 followed by 9 digits."
      );
      hasError = true;
    }

    if (!formData.password) {
      setPasswordError("Enter your password");
      hasError = true;
    } else if (!password_regex.test(formData.password)) {
      setPasswordError(
        "Invalid Password. Please enter 8-30 characters, including letters and numbers."
      );
      hasError = true;
    }

    if (!hasError && !phoneError && !passwordError) {
      try {
        console.log("Attempting to log in with:", formData);
        const response = await fetch(
          `${REACT_NATIVE_API_BASE_URL}/api/loginMobile`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": REACT_NATIVE_API_KEY,
            },
            body: JSON.stringify(formData),
          }
        );
        console.log("Login response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json();
          setPasswordError(
            errorData.error || "Login failed. Please try again."
          );
          console.log("Login failed:", errorData);
          return;
        }

        console.log("Login successful, fetching user session...");
        await fetchUserSession();
      } catch (error) {
        console.error("Error during login:", error);
        setPhoneError("An error occurred. Please try again.");
      }
    }
  };

  const handleRegisterNavigate = () => {
    setPhoneError("");
    setPasswordError("");
    setFormData({
      phone_number: null,
      password: null,
    });
    navigation.navigate("Register");
  };

  // const handleForgotPassNavigate = () => {
  //   setPhoneError("");
  //   setPasswordError("");
  //   setFormData({
  //     phone_number: null,
  //     password: null,
  //   });
  //   navigation.navigate("Forgot Password");
  // };

  // const handleLostPhoneNavigate = () => {
  //   setPhoneError("");
  //   setPasswordError("");
  //   setFormData({
  //     phone_number: null,
  //     password: null,
  //   });
  //   navigation.navigate("Lost Phone Number");
  // };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-3xl font-bold mb-6 text-gray-800">Login</Text>
      <TextInput
        className="w-4/5 p-3 mb-2 bg-white rounded-lg shadow-md"
        placeholder="Phone Number"
        keyboardType="numeric"
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={(value) => handleInputChange("phone_number", value)}
        value={formData.phone_number}
      />
      {phoneError ? (
        <Text className="w-4/5 text-red-500 mb-4">{phoneError}</Text>
      ) : null}

      {/* Password input with show/hide icon functionality */}
      <View className="w-4/5 mb-2 bg-white rounded-lg shadow-md flex-row items-center">
        <TextInput
          className="flex-1 p-3"
          placeholder="Password"
          secureTextEntry={!isPasswordVisible}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(value) => handleInputChange("password", value)}
          value={formData.password}
        />
        <TouchableOpacity
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          className="pr-3"
        >
          <FontAwesome5
            name={isPasswordVisible ? "eye-slash" : "eye"}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      {passwordError ? (
        <Text className="w-4/5 text-red-500 mb-4">{passwordError}</Text>
      ) : null}

      <TouchableOpacity
        onPress={handleLogin}
        className="w-4/5 p-3 mb-4 bg-[#00B251] rounded-lg shadow-md"
      >
        <Text className="text-white text-center text-lg">Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleRegisterNavigate}
        className="w-4/5 p-3 bg-gray-300 rounded-lg shadow-md"
      >
        <Text className="text-gray-800 text-center text-lg">Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsModalVisible2(true)}>
        <Text className="text-green-500 mt-4">Forgot Password</Text>
      </TouchableOpacity>
      <Modal
        visible={isModalVisible2}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible2(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-4/5 bg-white rounded-lg p-6 shadow-lg">
            <Text className="text-2xl font-bold text-green-700 mb-4 text-center">
              Forgot Password
            </Text>
            <Text className="text-base text-gray-600 mb-4">
              Enter your phone number
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
              placeholder="09123456789"
              keyboardType="phone-pad"
              autoCapitalize="none"
              autoCorrect={false}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            {phoneError ? (
              <Text className="w-4/5 text-red-500 mb-4">{phoneError}</Text>
            ) : null}

            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setIsModalVisible2(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg"
              >
                <Text className="text-gray-700 font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={openConfirmationAlert}
                className="bg-green-600 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-bold">Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={alertVisible}
        onRequestClose={() => setAlertVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 bg-opacity-50">
          <View className="bg-white p-6 rounded-lg shadow-lg w-3/4">
            <Text className="text-lg font-semibold text-gray-900 mb-4 text-center">
              {alertMessage}
            </Text>
            <View className="flex-row justify-between mt-4">
              <TouchableOpacity
                className="p-2 bg-gray-300 rounded-lg flex-row justify-center items-center w-1/3"
                onPress={() => setAlertVisible(false)}
              >
                <Text className="text-lg text-gray-800 text-center">No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="p-2 bg-[#00B251] rounded-lg flex-row justify-center items-center w-1/3"
                onPress={() => {
                  setAlertVisible(false);
                  handleConfirms();
                }}
              >
                <Text className="text-lg text-white text-center">Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <Text className="text-green-500 mt-4">Lost Phone Number</Text>
      </TouchableOpacity>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-4/5 bg-white rounded-lg p-6 shadow-lg">
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
                onPress={() => setIsModalVisible(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg"
              >
                <Text className="text-gray-700 font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={openSecondaryPhoneConfirmation}
                className="bg-[#00B251] px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-bold text-center">
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
            <Text className="text-lg text-green-500 text-center mt-4">
              If you did not provide an alternative phone number during
              registration, please contact the admin at this email
              (AgriTayo@gmail.com) and send your information.
            </Text>
          </View>
        </View>
      </Modal>

      {/* Secondary Phone Number Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 bg-opacity-50">
          <View className="bg-white p-6 rounded-lg shadow-lg w-3/4">
            <Text className="text-lg font-semibold text-gray-900 mb-4 text-center">
              {confirmModalMessage}
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
    </View>
  );
}

export default LoginScreen;
