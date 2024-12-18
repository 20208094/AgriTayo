import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

function ViewProfileScreen({ route, navigation }) {
  const { userData } = route.params;

  // State to manage input values
  const [firstName, setFirstName] = useState(userData.firstname);
  const [middleName, setMiddleName] = useState(userData.middlename);
  const [lastName, setLastName] = useState(userData.lastname);
  const [birthday, setBirthday] = useState(userData.birthday);
  const [phone, setPhone] = useState(userData.phone_number);
  const [secondaryPhoneNumber, setSecondaryPhoneNumber] = useState(
    userData.secondary_phone_number
  );
  const [profileImage, setProfileImage] = useState(userData.user_image_url);
  const [modalVisible, setModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);

  // Validation state
  const [errors, setErrors] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    secondaryPhoneNumber: "",
    birthday: "",
  });

  // RegEx for validation
  const firstname_regex = /^[a-zA-Z\s]{2,}$/; // At least 2 letters
  const middlename_regex = /^([A-Za-z\s]{1,})?$/;
  const lastname_regex = /^[a-zA-Z\s]{2,}$/; // At least 2 letters
  const phoneRegex = /^(09|\+639)\d{9}$/; // Matches Philippine phone number
  const secondaryPhone_regex = /^(?:\+63|0)?9\d{9}$/;

  // Centralized Validation Handler
  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "firstName":
        setFirstName(value);
        if (value.trim() === "") {
          error = "* First Name is required";
        } else if (!firstname_regex.test(value)) {
          error = "Invalid First Name. Please enter at least 2 letters.";
        }
        setErrors((prev) => ({ ...prev, firstName: error }));
        break;

      case "middleName":
        setMiddleName(value);
        if (value.trim() !== "" && !middlename_regex.test(value)) {
          error = "Invalid Middle Name. Please enter at least 2 letters.";
        }
        setErrors((prev) => ({ ...prev, middleName: error }));
        break;

      case "lastName":
        setLastName(value);
        if (value.trim() === "") {
          error = "* Last Name is required";
        } else if (!lastname_regex.test(value)) {
          error = "Invalid Last Name. Please enter at least 2 letters.";
        }
        setErrors((prev) => ({ ...prev, lastName: error }));
        break;

      case "phone":
        setPhone(value);
        if (value.trim() === "") {
          error = "* Phone number is required";
        } else if (!phoneRegex.test(value)) {
          error = "Invalid phone number format.";
        }
        setErrors((prev) => ({ ...prev, phone: error }));
        break;

      case "secondaryPhoneNumber":
        setSecondaryPhoneNumber(value);
        if (value.trim() !== "" && !secondaryPhone_regex.test(value)) {
          error = "Invalid alternative phone number format.";
        }
        setErrors((prev) => ({ ...prev, secondaryPhoneNumber: error }));
        break;

      case "birthday":
        setBirthday(value);
        if (!value) {
          error = "* Birthday is required";
        }
        setErrors((prev) => ({ ...prev, birthday: error }));
        break;


      default:
        break;
    }

    return error === ""; // Return true if no error
  };

  // General Fields Validation for Save Changes
  const validateFields = () => {
    const fieldsToValidate = [
      { field: "firstName", value: firstName },
      { field: "middleName", value: middleName },
      { field: "lastName", value: lastName },
      { field: "phone", value: phone },
      { field: "secondaryPhoneNumber", value: secondaryPhoneNumber },
      { field: "birthday", value: birthday },
    ];

    let isValid = true;

    fieldsToValidate.forEach(({ field, value }) => {
      if (!validateField(field, value)) {
        isValid = false;
      }
    });

    return isValid;
  };


  const MAX_IMAGE_SIZE_MB = 1; // Maximum allowed image size (1 MB)

  // Helper function to validate image size
  const validateImageSize = async (imageUri) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const sizeInMB = blob.size / (1024 * 1024); // Convert bytes to MB

      if (sizeInMB > MAX_IMAGE_SIZE_MB) {
        setAlertMessage(
          `The selected image is too large (${sizeInMB.toFixed(
            2
          )} MB). Please choose an image smaller than ${MAX_IMAGE_SIZE_MB} MB.`
        );
        setAlertVisible(true);
        return false;
      }

      return true;
    } catch (error) {
      setAlertMessage("Failed to check image size. Please try again.");
      setAlertVisible(true);
      return false;
    }
  };

  // Function to select an image from the gallery
  const selectImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setAlertMessage("Sorry, we need camera roll permissions to make this work!");
      setAlertVisible(true);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;

      const isValidSize = await validateImageSize(imageUri);
      if (isValidSize) {
        setProfileImage(imageUri);
        setModalVisible(false);
      }
    }
  };

  // Function to capture an image using the camera
  const selectImageFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      setAlertMessage("Sorry, we need camera permissions to make this work!");
      setAlertVisible(true);
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;

      const isValidSize = await validateImageSize(imageUri);
      if (isValidSize) {
        setProfileImage(imageUri);
        setModalVisible(false);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateFields()) {
      return; // Prevent form submission if validation fails
    }

    const formData = new FormData();
    formData.append("user_id", userData.user_id);
    formData.append("user_type_id", userData.user_type_id);
    formData.append("firstname", firstName);
    formData.append("middlename", middleName);
    formData.append("lastname", lastName);
    formData.append("phone_number", phone);
    formData.append("secondary_phone_number", secondaryPhoneNumber);
    formData.append("birthday", birthday);

    if (profileImage) {
      formData.append("image", {
        uri: profileImage,
        name: "profile.jpg",
        type: "image/jpeg",
      });
    }

    console.log("profileImage :", profileImage);
    console.log("formData :", formData);

    try {
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/users/${userData.user_id}`,
        {
          method: "PUT",
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
          body: formData,
        }
      );

      if (response.ok) {
        setAlertMessage("Profile updated successfully!");
        setAlertVisible(true);

        const updatedUserData = {
          ...userData,
          firstname: firstName,
          middlename: middleName,
          lastname: lastName,
          phone_number: phone,
          secondary_phone_number: secondaryPhoneNumber,
          birthday: birthday,
          user_image_url: profileImage,
        };

        await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));
        navigation.goBack(updatedUserData);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }
    } catch (error) {
      setAlertMessage("Failed to update profile: " + error.message);
      setAlertVisible(true);
    }
  };

  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
      setBirthday(formattedDate);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Profile Image Section */}
        <View className="items-center mb-8">
          <View className="relative w-28 h-28 rounded-full border-4 border-green-500 shadow-lg bg-white">
            <Image
              source={{ uri: profileImage }}
              className="w-full h-full rounded-full"
            />
            <TouchableOpacity
              className="absolute bottom-0 right-0 bg-green-500 p-2 rounded-full"
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="pencil" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* First Name */}
        <View className="w-full max-w-md mx-auto">
          <Text className="text-sm mb-2 text-gray-800">
            First Name:{" "}
            {errors.firstName && (
              <Text className="text-red-500 text-xs mb-4">{errors.firstName}</Text>
            )}
          </Text>
          <TextInput
            className="w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800"
            value={firstName}
            onChangeText={(text) => validateField("firstName", text)} // Real-time validation
          />

          {/* Middle Name */}
          <Text className="text-sm mb-2 text-gray-800">
            Middle Name:{" "}
            {errors.middleName && (
              <Text className="text-red-500 text-xs mb-4">{errors.middleName}</Text>
            )}
          </Text>
          <TextInput
            value={middleName}
            onChangeText={(text) => validateField("middleName", text)} // Real-time validation
            className="w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800"
          />

          {/* Last Name */}
          <Text className="text-sm mb-2 text-gray-800">
            Last Name:{" "}
            {errors.lastName && (
              <Text className="text-red-500 text-xs mb-4">{errors.lastName}</Text>
            )}
          </Text>
          <TextInput
            value={lastName}
            onChangeText={(text) => validateField("lastName", text)} // Real-time validation
            className="w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800"
          />

          {/* Birthday */}
          <Text className="text-sm mb-2 text-gray-800">
            Birthday:{" "}
            {errors.birthday ? (
              <Text className="text-red-500 text-xs mb-4">
                {errors.birthday}
              </Text>
            ) : null}
          </Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <View className="w-full p-3 mb-4 bg-white rounded-lg shadow-md">
              <Text className="text-gray-800">
                {birthday ? birthday : "Select your birthday"}
              </Text>
            </View>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={birthday ? new Date(birthday) : new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={eighteenYearsAgo}
            />
          )}

          <View className="relative w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800">
            {/* Phone Number Text */}
            <Text className="text-sm mb-2 text-gray-800">
              Phone Number:{" "}
              {errors.phone ? (
                <Text className="text-red-500 text-xs mb-4">
                  {errors.phone}
                </Text>
              ) : null}
            </Text>

            <Text className="">{phone}</Text>

            {/* Pencil Icon on the Top Right */}
            <TouchableOpacity
              style={{ position: "absolute", top: 10, right: 10 }}
              onPress={() =>
                navigation.navigate("Edit Phone Number", { userData, phone })
              }
            >
              <Ionicons name="pencil" size={20} color="gray" />
            </TouchableOpacity>
          </View>

          <View className="relative w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800">
            {/* Phone Number Text */}
            <Text className="text-sm mb-2 text-gray-800">
              Alternative Phone Number{" "}
              {errors.secondaryPhoneNumber ? (
                <Text className="text-red-500 text-xs mb-4">
                  {errors.secondaryPhoneNumber}
                </Text>
              ) : null}
            </Text>

            <Text className="">{secondaryPhoneNumber}</Text>

            {/* Pencil Icon on the Top Right */}
            <TouchableOpacity
              style={{ position: "absolute", top: 10, right: 10 }}
              onPress={() =>
                navigation.navigate("Edit Alternative Phone Number", {
                  secondaryPhoneNumber,
                  userData,
                })
              }
            >
              <Ionicons name="pencil" size={20} color="gray" />
            </TouchableOpacity>
          </View>

          {/* Alternative Phone Number
          <Text className="text-sm mb-2 text-gray-800">Alternative Phone Number:
            {" "} {errors.secondaryPhoneNumber ? <Text className="text-red-500 text-xs mb-4">{errors.secondaryPhoneNumber}</Text> : null}
          </Text>
          <TextInput
            value={secondaryPhoneNumber}
            onChangeText={setSecondaryPhoneNumber}
            className="w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800"
            placeholder="09123456789"
            keyboardType="numeric" 
          /> */}

          {/* Submit Button */}
          <TouchableOpacity
            onPress={() => {
              if (validateFields()) {
                handleSubmit();
              }
            }}
            className="w-full p-4 bg-[#00B251] rounded-lg shadow-md"
          >
            <Text className="text-center text-white font-bold">Save Changes</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* Modal for user gallery */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg">
            <Text className="text-lg font-semibold mb-4">
              Select Image Source
            </Text>
            <TouchableOpacity
              className="mb-4 p-4 bg-[#00B251] rounded-lg"
              onPress={selectImageFromGallery}
            >
              <Text className="text-white text-center">
                Choose from Gallery
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="mb-4 p-4 bg-[#00B251] rounded-lg"
              onPress={selectImageFromCamera}
            >
              <Text className="text-white text-center">Take a Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="p-4 bg-red-500 rounded-lg"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-white text-center">Cancel</Text>
            </TouchableOpacity>
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
    </SafeAreaView>
  );
}

export default ViewProfileScreen;
