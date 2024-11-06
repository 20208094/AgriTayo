import React, { useState, useEffect } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import LoadingAnimation from "../../components/LoadingAnimation";

function LoginScreen({ navigation, fetchUserSession }) {
  const [formData, setFormData] = useState({
    phone_number: "",
    password: "",
  });
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(true);

  const password_regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,30}$/;
  const phone_regex = /^(?:\+63|0)9\d{2}[-\s]?\d{3}[-\s]?\d{4}$/;

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
    }else if(!phone_regex.test(formData.phone_number)) {
      setPhoneError("Invalid phone number format. Please use 09 followed by 9 digits.");
      hasError = true;
    }

    if (!formData.password) {
      setPasswordError("Enter your password");
      hasError = true;
    }else if (!password_regex.test(formData.password)){
      setPasswordError("Invalid Password. Please enter 8-30 characters, including letters and numbers.");
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
          setPasswordError(errorData.error || "Login failed. Please try again.");
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
      <TextInput
        className="w-4/5 p-3 mb-2 bg-white rounded-lg shadow-md"
        placeholder="Password"
        secureTextEntry={true}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={(value) => handleInputChange("password", value)}
        value={formData.password}
      />
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
        onPress={() => navigation.navigate("Register")}
        className="w-4/5 p-3 bg-gray-300 rounded-lg shadow-md"
      >
        <Text className="text-gray-800 text-center text-lg">Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Forgot Password")}>
        <Text className="text-green-500 mt-4">Forgot Password? Click Here</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Lost Phone Number")}>
        <Text className="text-green-500 mt-4">Lost Phone Number? Click Here</Text>
      </TouchableOpacity>
    </View>
  );
}

export default LoginScreen;
