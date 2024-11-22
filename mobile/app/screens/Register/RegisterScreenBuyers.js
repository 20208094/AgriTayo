import React, { useState, useEffect } from "react";
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
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import GoBack from "../../components/GoBack";
import { Ionicons } from "@expo/vector-icons";

function RegisterScreenBuyers({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [secondaryPhoneNumber, setSecondaryPhoneNumber] = useState("");

  const [firstNameError, setFirstNameError] = useState("");
  const [middleNameError, setMiddleNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [birthDayError, setBirthDayError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [secondaryPhoneNumberError, setSecondaryPhoneNumberError] =
    useState("");

  const [phoneNumbersList, setPhoneNumbersList] = useState([]);
  const [phoneSecondaryNumbersList, setSecondaryPhoneNumbersList] = useState([]);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);


  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);
  const toggleConfirmPasswordVisibility = () => setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

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

  useEffect(() => {
    const fetchSecondaryPhoneNumbers = async () => {
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

    fetchSecondaryPhoneNumbers();
  }, []);

  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const firstname_regex = /^[A-Za-z\s]{2,}$/;
  const middlename_regex = /^[A-Za-z\s]{1,}$/;
  const lastname_regex = /^[A-Za-z\s]{2,}$/;
  const password_regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,30}$/;
  const phone_regex = /^(?:\+63|0)?9\d{9}$/;
  const secondaryPhone_regex = /^(?:\+63|0)?9\d{9}$/;

 // Real-time validation handlers
const validateFirstName = (text) => {
  setFirstName(text);
  if (text === "") {
    setFirstNameError(""); // Remove error if input is empty
  } else if (!firstname_regex.test(text)) {
    setFirstNameError("Invalid First Name. Please enter at least 2 letters.");
  } else {
    setFirstNameError("");
  }
};

const validateMiddleName = (text) => {
  setMiddleName(text);
  if (text === "") {
    setMiddleNameError(""); // Remove error if input is empty
  } else if (!middlename_regex.test(text)) {
    setMiddleNameError("Invalid Middle Name. Please enter at least 2 letters.");
  } else {
    setMiddleNameError("");
  }
};

const validateLastName = (text) => {
  setLastName(text);
  if (text === "") {
    setLastNameError(""); // Remove error if input is empty
  } else if (!lastname_regex.test(text)) {
    setLastNameError("Invalid Last Name. Please enter at least 2 letters.");
  } else {
    setLastNameError("");
  }
};

const validatePassword = (text) => {
  setPassword(text);
  if (text === "") {
    setPasswordError(""); // Remove error if input is empty
  } else if (!password_regex.test(text)) {
    setPasswordError(
      "Invalid Password. Please enter 8-30 characters, including letters and numbers."
    );
  } else {
    setPasswordError("");
  }
};

const validatePhone = (text) => {
  setPhone(text);
  if (text === "") {
    setPhoneError(""); // Remove error if input is empty
  } else if (!phone_regex.test(text)) {
    setPhoneError("Invalid phone number format. Please use 09 followed by 9 digits.");
  } else {
    setPhoneError("");
  }
};

const validateSecondaryPhone = (text) => {
  setSecondaryPhoneNumber(text);
  if (text === "") {
    setSecondaryPhoneNumberError(""); // Remove error if input is empty
  } else if (!secondaryPhone_regex.test(text)) {
    setSecondaryPhoneNumberError(
      "Invalid alternative phone number format. Please use 09 followed by 9 digits."
    );
  } else if (text === phone) {
    setSecondaryPhoneNumberError(
      "Same number as the phone number. Please input another number."
    );
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
    formData.append("password", password);
    formData.append("phone_number", phone);
    formData.append("secondary_phone_number", secondaryPhoneNumber);
    formData.append("user_type_id", "3");

    if (phone && secondaryPhoneNumber && (phoneNumbersList.includes(phone) || phoneSecondaryNumbersList.includes(phone)) && (phoneNumbersList.includes(secondaryPhoneNumber) || phoneSecondaryNumbersList.includes(secondaryPhoneNumber))) {
      setAlertMessage("Both Phone and Alternative Number are Already Registered");
      setAlertVisible(true);
      return;
    }

    if (phone && (phoneNumbersList.includes(phone) || phoneSecondaryNumbersList.includes(phone))) {
      setAlertMessage("Phone Number is Already Registered");
      setAlertVisible(true);
      return;
    }

    if (secondaryPhoneNumber && (phoneSecondaryNumbersList.includes(secondaryPhoneNumber) || phoneNumbersList.includes(secondaryPhoneNumber))) {
      setAlertMessage("Alternative Phone Number is Already Registered");
      setAlertVisible(true);
      return;
    }

    if (secondaryPhoneNumber) {
      navigation.navigate("OTP Screen", {
        formData,
        phone,
        secondaryPhoneNumber,
      });
    } else {
      navigation.navigate("OTP Only Phone", { formData, phone });
    }
  };

  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState("");

  // Calculate the date that is 18 years prior to today
  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );

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
    setModalVisible(true);
  };

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
            Middle Name: (Optional){" "}
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

          {/* Brithday */}
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
          <View className="flex-row items-center w-full p-2 mb-4 bg-white rounded-lg shadow-md">
            <TextInput
              className="flex-1"
              placeholder="•••••••"
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={validatePassword} // Real-time validation
            />
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <FontAwesome5
                name={isPasswordVisible ? "eye" : "eye-slash"}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <Text className="text-sm mb-2 text-gray-800">
            Confirm Password: <Text className="text-red-500 text-sm">*</Text>{" "}
            {confirmPasswordError ? (
              <Text className="text-sm w-4/5 text-red-500 mb-4">
                {confirmPasswordError}
              </Text>
            ) : null}
          </Text>
          <View className="flex-row items-center w-full p-2 mb-4 bg-white rounded-lg shadow-md">
            <TextInput
              className="flex-1"
              placeholder="•••••••"
              secureTextEntry={!isConfirmPasswordVisible}
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
            <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
              <FontAwesome5
                name={isConfirmPasswordVisible ? "eye" : "eye-slash"}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>

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

          {/* Alert Modal */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={alertVisible}
            onRequestClose={() => setAlertVisible(false)}
          >
            <View className="flex-1 justify-center items-center bg-black/50 bg-opacity-50">
              <View className="bg-white p-6 rounded-lg shadow-lg w-3/4">
                <Text className="text-lg font-semibold text-gray-900 mb-4">{alertMessage}</Text>
                <TouchableOpacity
                  className="mt-4 p-2 bg-[#00B251] rounded-lg flex-row justify-center items-center"
                  onPress={() => setAlertVisible(false)}
                >
                  <Ionicons name="checkmark-circle-outline" size={24} color="white" />
                  <Text className="text-lg text-white ml-2">OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

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
                <Text className="mb-4">Confirm if all the details are correct</Text>
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
                    <Text className="text-white">Confirm</Text>
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