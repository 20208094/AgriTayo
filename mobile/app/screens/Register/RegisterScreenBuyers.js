import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { styled } from "nativewind";
import { FontAwesome } from "@expo/vector-icons";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env"; // Import environment variables

function RegisterScreenBuyers({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [firstNameError, setFirstNameError] = useState("");
  const [middleNameError, setMiddleNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [birthDayError, setBirthDayError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [loading, setLoading] = useState(false); // Loading state to handle spinner

  const firstname_regex = /^[A-Za-z\s]{2,}$/;
  const middlename_regex = /^[A-Za-z\s]{2,}$/;
  const lastname_regex = /^[A-Za-z\s]{2,}$/;
  const password_regex = /^[A-Za-z\d@.#$!%*?&^]{8,30}$/;
  const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phone_regex = /^(?:\+63|0)?9\d{9}$/;

  const handleRegister = async () => {
    // Reset error states
    setFirstNameError("");
    setMiddleNameError("");
    setLastNameError("");
    setBirthDayError("");
    setGenderError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setPhoneError("");

    let hasError = false;

    // Validation checks (omitted for brevity, same as before)
    if (!firstName || !firstname_regex.test(firstName)) {
      setFirstNameError("Invalid First Name. Please try again.");
      hasError = true;
    }

    if (!middleName || !middlename_regex.test(middleName)) {
      setMiddleNameError("Invalid Middle Name. Please try again.");
      hasError = true;
    }

    if (!lastName || !lastname_regex.test(lastName)) {
      setLastNameError("Invalid Last Name. Please try again.");
      hasError = true;
    }

    if (!birthDay) {
      setBirthDayError("Enter your Birthday");
      hasError = true;
    }

    if (!gender) {
      setGenderError("Select your Gender");
      hasError = true;
    }

    if (!email || !email_regex.test(email)) {
      setEmailError("Invalid Email. Please try again.");
      hasError = true;
    }

    if (!password || !password_regex.test(password)) {
      setPasswordError("Invalid Password. Please try again.");
      hasError = true;
    }

    if (!confirmPassword || confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match.");
      hasError = true;
    }

    if (!phone || !phone_regex.test(phone)) {
      setPhoneError("Invalid Phone Number. Please try again.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // If validation passes, proceed to call the backend API for registration
    setLoading(true); // Show loading state while making API call
    try {
      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": REACT_NATIVE_API_KEY, // Secure API key
        },
        body: JSON.stringify({
          firstname: firstName,
          middlename: middleName,
          lastname: lastName,
          birthday: birthDay,
          gender,
          email,
          password,
          phone_number: phone,
          user_type_id: 3,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Registration successful:", data);

        // Navigate to OTP Screen or login screen after successful registration
        navigation.navigate("OTP Screen", { email });
      } else {
        const errorData = await response.json();
        console.error("Registration failed:", errorData);
        setEmailError(errorData.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setEmailError("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ];

  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState("");

  const handleDateChange = (event, selectedDate) => {
    if (event.type === "set") {
      const currentDate = selectedDate || date;
      setShow(false);
      setDate(currentDate);
      setFormattedDate(currentDate.toLocaleDateString());
      setBirthDay(currentDate.toLocaleDateString());
    } else {
      setShow(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-3xl font-bold mt-6 mb-6 text-gray-800 text-center">
          Register
        </Text>
        <View className="w-full max-w-md mx-auto">
          <TextInput
            className="w-full p-3 mb-4 bg-white rounded-lg shadow-md"
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          {firstNameError ? (
            <Text className="w-4/5 text-red-500 mb-4">{firstNameError}</Text>
          ) : null}

          <TextInput
            className="w-full p-3 mb-4 bg-white rounded-lg shadow-md"
            placeholder="Middle Name"
            value={middleName}
            onChangeText={setMiddleName}
          />
          {middleNameError ? (
            <Text className="w-4/5 text-red-500 mb-4">{middleNameError}</Text>
          ) : null}

          <TextInput
            className="w-full p-3 mb-4 bg-white rounded-lg shadow-md"
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
          {lastNameError ? (
            <Text className="w-4/5 text-red-500 mb-4">{lastNameError}</Text>
          ) : null}

          <TouchableOpacity
            onPress={() => setShow(true)}
            className="w-full p-3 mb-4 bg-white rounded-lg shadow-md"
          >
            <Text className="text-gray-800">
              {formattedDate || "Select Birthday"}
            </Text>
          </TouchableOpacity>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={handleDateChange}
            />
          )}
          {birthDayError ? (
            <Text className="w-4/5 text-red-500 mb-4">{birthDayError}</Text>
          ) : null}

          <Text className="text-lg mb-2 text-gray-800">Gender:</Text>
          <View className="flex-row mb-4">
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => setGender(option.value)}
                className="flex-row items-center mr-6"
              >
                <View className="w-8 h-8 rounded-full border-2 border-green-600 flex items-center justify-center">
                  {gender === option.value && (
                    <FontAwesome name="check" size={25} color="#00B251" />
                  )}
                </View>
                <Text className="ml-2 text-gray-800">{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {genderError ? (
            <Text className="w-4/5 text-red-500 mb-4">{genderError}</Text>
          ) : null}

          <TextInput
            className="w-full p-3 mb-4 bg-white rounded-lg shadow-md"
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />
          {emailError ? (
            <Text className="w-4/5 text-red-500 mb-4">{emailError}</Text>
          ) : null}

          <TextInput
            className="w-full p-3 mb-4 bg-white rounded-lg shadow-md"
            placeholder="Password"
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
            value={password}
            onChangeText={setPassword}
          />
          {passwordError ? (
            <Text className="w-4/5 text-red-500 mb-4">{passwordError}</Text>
          ) : null}

          <TextInput
            className="w-full p-3 mb-6 bg-white rounded-lg shadow-md"
            placeholder="Confirm Password"
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          {confirmPasswordError ? (
            <Text className="w-4/5 text-red-500 mb-4">
              {confirmPasswordError}
            </Text>
          ) : null}

          <TextInput
            className="w-full p-3 mb-6 bg-white rounded-lg shadow-md"
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          {phoneError ? (
            <Text className="w-4/5 text-red-500 mb-4">{phoneError}</Text>
          ) : null}

          <TouchableOpacity
            onPress={handleRegister}
            className="w-full p-3 bg-[#00B251] rounded-lg shadow-md"
          >
            <Text className="text-white text-center text-lg">
              {loading ? "Registering..." : "Register"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            className="w-full p-3 bg-gray-300 rounded-lg shadow-md mt-4"
          >
            <Text className="text-gray-800 text-center text-lg">Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default styled(RegisterScreenBuyers);
