import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { styled } from "nativewind";
import { FontAwesome } from "@expo/vector-icons";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";

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
  const [lastNameError, setLastNameError] = useState("");
  const [birthDayError, setBirthDayError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [loading, setLoading] = useState(false);

  const firstname_regex = /^[A-Za-z\s]{2,}$/;
  const lastname_regex = /^[A-Za-z\s]{2,}$/;
  const password_regex = /^[A-Za-z\d@.#$!%*?&^]{8,30}$/;
  const phone_regex = /^(?:\+63|0)?9\d{9}$/;

  // Real-time validation handlers
  const validateFirstName = (text) => {
    setFirstName(text);
    if (!firstname_regex.test(text)) {
      setFirstNameError("Invalid First Name. Please try again.");
    } else {
      setFirstNameError("");
    }
  };

  const validateLastName = (text) => {
    setLastName(text);
    if (!lastname_regex.test(text)) {
      setLastNameError("Invalid Last Name. Please try again.");
    } else {
      setLastNameError("");
    }
  };

  const validatePassword = (text) => {
    setPassword(text);
    if (!password_regex.test(text)) {
      setPasswordError("Invalid Password. Please try again.");
    } else {
      setPasswordError("");
    }
  };

  const validatePhone = (text) => {
    setPhone(text);
    if (!phone_regex.test(text)) {
      setPhoneError("Invalid Phone Number. Please try again.");
    } else {
      setPhoneError("");
    }
  };

  const handleRegister = async () => {
    setFirstNameError("");
    setLastNameError("");
    setBirthDayError("");
    setGenderError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setPhoneError("");

    let hasError = false;

    if (!firstName) {
      setFirstNameError(" First Name is required.");
      hasError = true;
    }

    if (!lastName) {
      setLastNameError(" Last Name is required.");
      hasError = true;
    }

    if (!birthDay) {
      setBirthDayError(" Enter your Birthday.");
      hasError = true;
    }

    if (!gender) {
      setGenderError(" Select your Gender.");
      hasError = true;
    }

    if (!password) {
      setPasswordError(" Password is required.");
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError(" Please confirm your password.");
      hasError = true;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError(" Passwords do not match.");
      hasError = true;
    }

    if (!phone) {
      setPhoneError(" Phone Number is required.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const formData = new FormData();
    formData.append("firstname", firstName);
    formData.append("middlename", middleName);
    formData.append("lastname", lastName);
    formData.append("birthday", birthDay);
    formData.append("gender", gender);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phone_number", phone);
    formData.append("user_type_id", "3");

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
        console.log("Registration successful:", data);
        alert("Registration Successful!");
        navigation.navigate("OTP Screen", { email });
      } else {
        const errorData = await response.json();
        console.error("Registration failed:", errorData);
        alert("Registration Failed. Please Try Again");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
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
        <Text className="text-3xl font-bold mt-6 mb-6 text-[#00B251] text-center">
          Register
        </Text>
        <View className="w-full max-w-md mx-auto">
          {/* First Name */}
          <Text className="text-sm mb-2 text-gray-800">
            First Name: <Text className="text-red-500 text-sm">*</Text>{" "}
            {firstNameError ? (
              <Text className="text-sm w-4/5 text-red-500 mb-4">
                {firstNameError}
              </Text>
            ) : null}
          </Text>
          <TextInput
            className="w-full p-2 mb-4 bg-white rounded-lg shadow-md"
            placeholder="First Name"
            value={firstName}
            onChangeText={validateFirstName} // Real-time validation
          />

          {/* Middle Name */}
          <Text className="text-sm mb-2 text-gray-800">
            Middle Name: (Optional)
          </Text>
          <TextInput
            className="w-full p-2 mb-4 bg-white rounded-lg shadow-md"
            placeholder="Middle Name"
            value={middleName}
            onChangeText={setMiddleName}
          />

          {/* Last Name */}
          <Text className="text-sm mb-2 text-gray-800">
            Last Name: <Text className="text-red-500 text-sm">*</Text>{" "}
            {lastNameError ? (
              <Text className="text-sm w-4/5 text-red-500 mb-4">
                {lastNameError}
              </Text>
            ) : null}
          </Text>
          <TextInput
            className="w-full p-2 mb-4 bg-white rounded-lg shadow-md"
            placeholder="Last Name"
            value={lastName}
            onChangeText={validateLastName} // Real-time validation
          />

          {/* Birthday */}
          <Text className="text-sm mb-2 text-gray-800">
            Birthday: <Text className="text-red-500 text-sm">*</Text>{" "}
            {birthDayError ? (
              <Text className="text-sm w-4/5 text-red-500 mb-4">
                {birthDayError}
              </Text>
            ) : null}
          </Text>
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
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
          {/* Gender */}
          <Text className="text-sm mb-2 text-gray-800">Gender: <Text className="text-red-500 text-sm">*</Text> {genderError ? (
            <Text className="text-sm w-4/5 text-red-500 mb-4">{genderError}</Text>
          ) : null}</Text>
          <View className="flex-row mb-4">
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => setGender(option.value)}
                className="flex-row items-center mr-6"
              >
                <View className="w-7 h-7 rounded-full border-2 border-green-600 flex items-center justify-center">
                  {gender === option.value && (
                    <FontAwesome name="circle" size={21} color="#00B251" />
                  )}
                </View>
                <Text className="ml-2 text-gray-800">{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Phone */}
          <Text className="text-sm mb-2 text-gray-800">
            Phone Number: <Text className="text-red-500 text-sm">*</Text>{" "}
            {phoneError ? (
              <Text className="text-sm w-4/5 text-red-500 mb-4">
                {phoneError}
              </Text>
            ) : null}
          </Text>
          <TextInput
            className="w-full p-2 mb-4 bg-white rounded-lg shadow-md"
            placeholder="Phone Number"
            value={phone}
            onChangeText={validatePhone} // Real-time validation
          />
          {/* Email */}
          <Text className="text-sm mb-2 text-gray-800">Email: (Optional)</Text>
          <TextInput
            className="w-full p-2 mb-4 bg-white rounded-lg shadow-md"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />

          {/* Password */}
          <Text className="text-sm mb-2 text-gray-800">
            Password: <Text className="text-red-500 text-sm">*</Text>{" "}
            {passwordError ? (
              <Text className="text-sm w-4/5 text-red-500 mb-4">
                {passwordError}
              </Text>
            ) : null}
          </Text>
          <TextInput
            className="w-full p-2 mb-4 bg-white rounded-lg shadow-md"
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={validatePassword} // Real-time validation
          />

          {/* Confirm Password */}
          <Text className="text-sm mb-2 text-gray-800">
            Confirm Password: <Text className="text-red-500 text-sm">*</Text>{" "}
            {confirmPasswordError ? (
              <Text className="text-sm w-4/5 text-red-500 mb-4">
                {confirmPasswordError}
              </Text>
            ) : null}
          </Text>
          <TextInput
            className="w-full p-2 mb-4 bg-white rounded-lg shadow-md"
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (text !== password) {
                setConfirmPasswordError("Passwords do not match.");
              } else {
                setConfirmPasswordError("");
              }
            }}
          />



          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleRegister}
            className="w-full p-4 bg-[#00B251] rounded-lg shadow-md"
          >
            <Text className="text-center text-white font-bold">Register</Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            className="w-full p-4 bg-gray-300 rounded-lg shadow-md mt-4"
          >
            <Text className="text-gray-800 text-center font-bold">Cancel</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default RegisterScreenBuyers;
