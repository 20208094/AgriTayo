import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome } from "@expo/vector-icons";
import GoBack from "../../components/GoBack";

function RegisterScreenBuyers({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [secondaryPhoneNumber, setSecondaryPhoneNumber] = useState('')

  const [firstNameError, setFirstNameError] = useState("");
  const [middleNameError, setMiddleNameError] = useState("")
  const [lastNameError, setLastNameError] = useState("");
  const [birthDayError, setBirthDayError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [secondaryPhoneNumberError, setSecondaryPhoneNumberError] = useState('')

  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const firstname_regex = /^[A-Za-z\s]{2,}$/;
  const middlename_regex = /^[A-Za-z\s]{2,}$/;
  const lastname_regex = /^[A-Za-z\s]{2,}$/;
  const password_regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,30}$/;
  const phone_regex = /^(?:\+63|0)?9\d{9}$/;
  const secondaryPhone_regex = /^(?:\+63|0)?9\d{9}$/;

  // Real-time validation handlers
  const validateFirstName = (text) => {
    setFirstName(text);
    if (!firstname_regex.test(text)) {
      setFirstNameError("Invalid First Name. Please enter atleast 2 letters.");
    } else {
      setFirstNameError("");
    }
  };

  const validateMiddleName = (text) => {
    setMiddleName(text);
    if (!middlename_regex.test(text)) {
      setMiddleNameError("Invalid Middle Name. Please enter atleast 2 letters.")
    } else {
      setMiddleNameError("")
    }
  }

  const validateLastName = (text) => {
    setLastName(text);
    if (!lastname_regex.test(text)) {
      setLastNameError("Invalid Last Name. Please enter atleast 2 letters.");
    } else {
      setLastNameError("");
    }
  };

  const validatePassword = (text) => {
    setPassword(text);
    if (!password_regex.test(text)) {
      setPasswordError("Invalid Password. Please enter 8-30 characters, including letters and numbers.");
    } else {
      setPasswordError("");
    }
  };

  const validatePhone = (text) => {
    setPhone(text);
    if (!phone_regex.test(text)) {
      setPhoneError("Invalid phone number format. Please use 09 followed by 9 digits.");
    } else {
      setPhoneError("");
    }
  };

  const validateSecondaryPhone = (text) => {
    setSecondaryPhoneNumber(text);
    if (!secondaryPhone_regex.test(text)) {
      setSecondaryPhoneNumberError("Invalid alternative phone number format. Please use 09 followed by 9 digits.");
    } else {
      setSecondaryPhoneNumberError("");
    }
  };

  const handleRegister = async () => {
    const formData = new FormData();
    formData.append("firstname", firstName);
    formData.append("middlename", middleName);
    formData.append("lastname", lastName);
    formData.append("birthday", birthDay);
    formData.append("gender", gender);
    formData.append("password", password);
    formData.append("phone_number", phone);
    formData.append("secondary_phone_number", secondaryPhoneNumber);
    formData.append("user_type_id", "3");

    navigation.navigate("OTP Screen", { formData, phone });

  };

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];

  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState("");

  // Calculate the date that is 18 years prior to today
  const today = new Date();
  const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

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

  const handleModal = () => {
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
    setModalVisible(true)
  }

  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
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
            placeholder="Rafael Martin"
            value={firstName}
            onChangeText={validateFirstName} // Real-time validation
          />

          {/* Middle Name */}
          <Text className="text-sm mb-2 text-gray-800">
            Middle Name: (Optional) {" "}
            {middleNameError ? (
              <Text className="text-sm w-4/5 text-red-500 mb-4">
                {middleNameError}
              </Text>
            ) : null}
          </Text>
          <TextInput
            className="w-full p-2 mb-4 bg-white rounded-lg shadow-md"
            placeholder="Emperador"
            value={middleName}
            onChangeText={validateMiddleName} // Real-time validation
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
            placeholder="Aquino"
            value={lastName}
            onChangeText={validateLastName} // Real-time validation
          />


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
              maximumDate={eighteenYearsAgo} // Restrict selection to dates 18 years ago or earlier
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
            keyboardType="numeric"
            placeholder="09123456789"
            value={phone}
            onChangeText={validatePhone} // Real-time validation
          />
          {/*Secondary Phone Number*/}
          <Text className="text-sm mb-2 text-gray-800">
            Alternative Phone Number: (Optional){" "}
            {secondaryPhoneNumberError ? (
              <Text className="text-sm w-4/5 text-red-500 mb-4">
                {secondaryPhoneNumberError}
              </Text>
            ) : null}
          </Text>
          <TextInput
            className="w-full p-2 mb-4 bg-white rounded-lg shadow-md"
            keyboardType="numeric"
            placeholder="09123456789"
            value={secondaryPhoneNumber}
            onChangeText={validateSecondaryPhone} // Real-time validation
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
            placeholder="•••••••"
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
            placeholder="•••••••"
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
            onPress={handleModal} // Open modal instead of alert
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

          {/* Modal for Registration Confirmation */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View className="flex-1 justify-center items-center bg-black/50">
              <View className="bg-white rounded-lg p-6 w-80">
                <Text className="text-lg font-bold mb-4">Register</Text>
                <Text className="mb-4">Do you really want to register?</Text>
                <View className="flex-row justify-between">
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      console.log("Registration Cancelled");
                    }}
                    className="bg-gray-300 p-2 rounded"
                  >
                    <Text>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      handleRegister(); // Call handleRegister on confirmation
                    }}
                    className="bg-[#00B251] p-2 rounded"
                  >
                    <Text className="text-white">Yes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default RegisterScreenBuyers;
