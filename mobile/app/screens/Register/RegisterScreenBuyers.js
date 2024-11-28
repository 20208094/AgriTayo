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
  const [phoneSecondaryNumbersList, setSecondaryPhoneNumbersList] = useState(
    []
  );

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);

  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);
  const toggleConfirmPasswordVisibility = () =>
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

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
      setMiddleNameError(
        "Invalid Middle Name. Please enter at least 2 letters."
      );
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
      setPhoneError(
        "Invalid phone number format. Please use 09 followed by 9 digits."
      );
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

    if (
      phone &&
      secondaryPhoneNumber &&
      (phoneNumbersList.includes(phone) ||
        phoneSecondaryNumbersList.includes(phone)) &&
      (phoneNumbersList.includes(secondaryPhoneNumber) ||
        phoneSecondaryNumbersList.includes(secondaryPhoneNumber))
    ) {
      setAlertMessage(
        "Both Phone and Alternative Number are Already Registered"
      );
      setAlertVisible(true);
      return;
    }

    if (
      phone &&
      (phoneNumbersList.includes(phone) ||
        phoneSecondaryNumbersList.includes(phone))
    ) {
      setAlertMessage("Phone Number is Already Registered");
      setAlertVisible(true);
      return;
    }

    if (
      secondaryPhoneNumber &&
      (phoneSecondaryNumbersList.includes(secondaryPhoneNumber) ||
        phoneNumbersList.includes(secondaryPhoneNumber))
    ) {
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

    if (!isTermsAccepted) {
      setAlertMessage("You must accept the Terms and Conditions to register.");
      setAlertVisible;
      return;
    }
    // Proceed with registration logic
    setAlertMessage("Registration successful!");
    setAlertVisible;
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

          {/* Terms and Conditions */}
          <View className="flex-row items-center mb-6">
            <TouchableOpacity
              onPress={() => setIsTermsAccepted(!isTermsAccepted)}
              className={`w-6 h-6 border-2 rounded-md flex items-center justify-center ${
                isTermsAccepted
                  ? "bg-green-600 border-green-600"
                  : "border-gray-400"
              }`}
            >
              {isTermsAccepted && (
                <Ionicons name="checkmark" size={18} color="white" />
              )}
            </TouchableOpacity>
            <View className="ml-2 flex-1">
              <Text className="text-gray-800 leading-5">
                By checking this box, I confirm that I have read, understood,
                and agree to abide by the{" "}
                <TouchableOpacity onPress={() => setTermsModalVisible(true)}>
                  <Text className="text-[#00b251] underline">
                    Terms and Conditions
                  </Text>
                </TouchableOpacity>{" "}
                of AgriTayo. I acknowledge that failing to adhere to the terms
                may result in the suspension or termination of my account.
              </Text>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleModal} // Open registration confirmation modal
            className={`w-full p-4 ${
              isTermsAccepted ? "bg-[#00B251]" : "bg-gray-300"
            } rounded-lg shadow-md`}
            disabled={!isTermsAccepted} // Disable if terms are not accepted
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

          {/* Improved Terms and Conditions Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={termsModalVisible}
            onRequestClose={() => setTermsModalVisible(false)}
          >
            <View className="flex-1 justify-center items-center bg-black/50">
              <View className="bg-white rounded-lg p-6 w-12/13 max-w-lg shadow-lg">
                {/* Header Section */}
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-xl font-bold text-[#00B251]">
                    Terms and Conditions
                  </Text>
                  <TouchableOpacity
                    onPress={() => setTermsModalVisible(false)}
                    className="p-2"
                  >
                    <Text className="text-gray-500 font-bold">✕</Text>
                  </TouchableOpacity>
                </View>

                {/* Scrollable Content */}
                <ScrollView className="h-60 mb-4">
                  <Text className="text-gray-800 text-base font-semibold mb-2">
                    Welcome to AgriTayo!
                  </Text>
                  <Text className="text-gray-800 text-sm mb-4">
                    By registering as a buyer in our platform, you agree to the
                    following Terms and Conditions. Please read them carefully
                    before proceeding:
                  </Text>

                  {/* Each term with its own class */}
                  <View className="mb-4">
                    <Text className="text-gray-800 text-base font-bold">
                      1. Account Registration and Security
                    </Text>
                    <Text className="text-gray-700 text-sm mt-2">
                      1.1 You must provide accurate, complete, and up-to-date
                      information during registration.
                    </Text>
                    <Text className="text-gray-700 text-sm mt-2">
                      1.2 Your account is personal and non-transferable. Sharing
                      your account with others is prohibited.
                    </Text>
                    <Text className="text-gray-700 text-sm mt-2">
                      1.3 You are responsible for keeping your login credentials
                      secure. Any activity performed under your account will be
                      considered your responsibility.
                    </Text>
                  </View>

                  <View className="mb-4">
                    <Text className="text-gray-800 text-base font-bold">
                      2. Acceptable Use of the Platform
                    </Text>
                    <Text className="text-gray-700 text-sm mt-2">
                      2.1 The platform is intended solely for lawful purposes
                      related to the purchase of agricultural products directly
                      from farmers.
                    </Text>
                    <Text className="text-gray-700 text-sm mt-2">
                      2.2 You must not engage in fraudulent activities,
                      impersonate others, or provide false information on the
                      platform.
                    </Text>
                    <Text className="text-gray-700 text-sm mt-2">
                      2.3 Harassment, abusive language, or any inappropriate
                      conduct toward other users (buyers, farmers, or
                      administrators) is strictly prohibited.
                    </Text>
                  </View>

                  <View className="mb-4">
                    <Text className="text-gray-800 text-base font-bold">
                      3. Transactions and Payments
                    </Text>
                    <Text className="text-gray-700 text-sm mt-2">
                      3.1 Payments must be made using authorized payment methods
                      integrated into the platform.
                    </Text>
                    <Text className="text-gray-700 text-sm mt-2">
                      3.2 AgriTayo is not liable for losses or disputes arising
                      from incomplete or unsatisfactory transactions between
                      buyers and sellers.
                    </Text>
                    <Text className="text-gray-700 text-sm mt-2">
                      3.3 Refunds and cancellations are subject to the policies
                      defined by the seller and applicable laws.
                    </Text>
                  </View>

                  <View className="mb-4">
                    <Text className="text-gray-800 text-base font-bold">
                      4. Buyer Responsibilities
                    </Text>
                    <Text className="text-gray-700 text-sm mt-2">
                      4.1 You must review product descriptions, prices, and
                      terms carefully before placing an order.
                    </Text>
                    <Text className="text-gray-700 text-sm mt-2">
                      4.2 Ensure timely communication with farmers regarding
                      inquiries, negotiations, or order updates.
                    </Text>
                    <Text className="text-gray-700 text-sm mt-2">
                      4.3 Provide accurate delivery addresses and contact
                      information to facilitate smooth order processing.
                    </Text>
                  </View>

                  <View className="mb-4">
                    <Text className="text-gray-800 text-base font-bold">
                      5. Privacy and Data Protection
                    </Text>
                    <Text className="text-gray-700 text-sm mt-2">
                      5.1 AgriTayo collects and processes personal data in
                      compliance with the Data Privacy Act of 2012.
                    </Text>
                    <Text className="text-gray-700 text-sm mt-2">
                      5.2 Your data will be used solely for account management,
                      transaction facilitation, and service improvement.
                    </Text>
                    <Text className="text-gray-700 text-sm mt-2">
                      5.3 Do not misuse other users' personal information for
                      purposes outside the platform’s scope.
                    </Text>
                  </View>

                  <View className="mb-4">
                    <Text className="text-gray-800 text-base font-bold">
                      6. Limitation of Liability
                    </Text>
                    <Text className="text-gray-700 text-sm mt-2">
                      6.1 AgriTayo is a marketplace facilitator and is not
                      liable for the quality, accuracy, or condition of products
                      sold by farmers.
                    </Text>
                    <Text className="text-gray-700 text-sm mt-2">
                      6.2 While we strive for uptime and accuracy, occasional
                      errors, outages, or inaccuracies may occur.
                    </Text>
                  </View>

                  <View className="mb-4">
                    <Text className="text-gray-800 text-base font-bold">
                      7. Suspension and Termination
                    </Text>
                    <Text className="text-gray-700 text-sm mt-2">
                      7.1 AgriTayo reserves the right to suspend or terminate
                      accounts that violate these terms or engage in prohibited
                      activities.
                    </Text>
                    <Text className="text-gray-700 text-sm mt-2">
                      7.2 Account restrictions, suspensions, or permanent
                      terminations depend on the severity of the breach..
                    </Text>
                  </View>

                  <Text className="text-gray-800 text-sm mt-4">
                    By proceeding with your registration, you confirm that you
                    have read, understood, and agree to abide by these Terms and
                    Conditions. If you do not agree, please refrain from using
                    the platform.
                  </Text>
                </ScrollView>

                {/* Action Buttons */}
                <View className="flex-row justify-end">
                  <TouchableOpacity
                    onPress={() => setTermsModalVisible(false)}
                    className="bg-[#00B251] px-4 py-2 rounded-md"
                  >
                    <Text className="text-white font-medium">Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

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
                <Text className="mb-4">
                  Confirm if all the details are correct
                </Text>
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
