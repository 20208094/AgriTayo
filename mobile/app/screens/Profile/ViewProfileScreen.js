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
import DateTimePicker from '@react-native-community/datetimepicker';
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from '@env';
import AsyncStorage from "@react-native-async-storage/async-storage";

function ViewProfileScreen({ route, navigation }) {
  const { userData } = route.params;

  // State to manage input values
  const [firstName, setFirstName] = useState(userData.firstname);
  const [middleName, setMiddleName] = useState(userData.middlename);
  const [lastName, setLastName] = useState(userData.lastname);
  const [birthday, setBirthday] = useState(userData.birthday);
  const [gender, setGender] = useState(userData.gender);
  const [phone, setPhone] = useState(userData.phone_number);
  const [secondaryPhoneNumber, setSecondaryPhoneNumber] = useState(userData.secondary_phone_number);
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
    gender: "",
  });

  // RegEx for validation
  const nameRegex = /^[a-zA-Z\s]+$/;
  const middlename_regex = /^([A-Za-z\s]{1,})?$/
  const phoneRegex = /^(09|\+639)\d{9}$/; // Matches Philippine phone number
  const secondaryPhone_regex = /^(?:\+63|0)?9\d{9}$/;

  // Validation function
  const validateFields = () => {
    let valid = true;
    let updatedErrors = {};

    // First Name validation
    if (!firstName || !nameRegex.test(firstName)) {
      updatedErrors.firstName = "* Please enter a valid first name";
      valid = false;
    }

    // Middle Name validation
    if (middleName && !middlename_regex.test(middleName)) {
      updatedErrors.middleName = "* Please enter a valid middle name";
      valid = false;
    }

    // Last Name validation
    if (!lastName || !nameRegex.test(lastName)) {
      updatedErrors.lastName = "* Please enter a valid last name";
      valid = false;
    }

    // Phone validation
    if (!phone || !phoneRegex.test(phone)) {
      updatedErrors.phone = "* Please enter a valid phone number";
      valid = false;
    }

    // Secondary Phone validation
    if (secondaryPhoneNumber && !secondaryPhone_regex.test(secondaryPhoneNumber)) {
      updatedErrors.secondaryPhoneNumber = "* Please enter a valid phone number";
      valid = false;
    }


    // Birthday validation
    if (!birthday) {
      updatedErrors.birthday = "* Please enter a valid birthday";
      valid = false;
    }

    // Gender validation
    if (!gender) {
      updatedErrors.gender = "* Please select a gender";
      valid = false;
    }

    setErrors(updatedErrors);
    return valid;
  };

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
      setProfileImage(result.assets[0].uri);
      setModalVisible(false);
    }
  };


  // Handle form submission
  const handleSubmit = async () => {
    if (!validateFields()) {
      return; // Prevent form submission if validation fails
    }

    const formData = new FormData();
    formData.append('user_id', userData.user_id);
    formData.append('user_type_id', userData.user_type_id);
    formData.append('firstname', firstName);
    formData.append('middlename', middleName);
    formData.append('lastname', lastName);
    formData.append('phone_number', phone);
    formData.append('secondary_phone_number', secondaryPhoneNumber);
    formData.append('gender', gender);
    formData.append('birthday', birthday);

    if (profileImage) {
      formData.append('image', {
        uri: profileImage,
        name: 'profile.jpg',
        type: 'image/jpeg',
      });
    }

    console.log('profileImage :', profileImage);
    console.log('formData :', formData);

    try {
      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/users/${userData.user_id}`, {
        method: 'PUT',
        headers: {
          'x-api-key': REACT_NATIVE_API_KEY,
        },
        body: formData,
      });

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
          gender: gender,
          birthday: birthday,
          user_image_url: profileImage,
        };

        await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
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

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Others", value: "Others" },
  ];
  

  const today = new Date();
  const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
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
          <Text className="text-sm mb-2 text-gray-800">First Name:
            {" "} {errors.firstName ? <Text className="text-red-500 text-xs mb-4">{errors.firstName}</Text> : null}
          </Text>
          <TextInput
            className="w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800"
            value={firstName}
            onChangeText={setFirstName}
          />

          {/* Middle Name */}
          <Text className="text-sm mb-2 text-gray-800">Middle Name:
            {" "} {errors.middleName ? <Text className="text-red-500 text-xs mb-4">{errors.middleName}</Text> : null}
          </Text>
          <TextInput
            value={middleName}
            onChangeText={setMiddleName}
            className="w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800"
          />


          {/* Last Name */}
          <Text className="text-sm mb-2 text-gray-800">Last Name:
            {" "} {errors.lastName ? <Text className="text-red-500 text-xs mb-4">{errors.lastName}</Text> : null}
          </Text>
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            className="w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800"
          />


          {/* Birthday */}
          <Text className="text-sm mb-2 text-gray-800">Birthday:
            {" "} {errors.birthday ? <Text className="text-red-500 text-xs mb-4">{errors.birthday}</Text> : null}
          </Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <View className="w-full p-3 mb-4 bg-white rounded-lg shadow-md">
              <Text className="text-gray-800">{birthday ? birthday : "Select your birthday"}</Text>
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


          {/* Gender */}
          <Text className="text-sm mb-2 text-gray-800">Gender:
            {" "} {errors.gender ? <Text className="text-red-500 text-xs mb-4">{errors.gender}</Text> : null}
          </Text>
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

          {/* Phone Number */}
          <Text className="text-sm mb-2 text-gray-800">Phone Number:
            {" "} {errors.phone ? <Text className="text-red-500 text-xs mb-4">{errors.phone}</Text> : null}
          </Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            className="w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800"
            placeholder="09123456789"
            keyboardType="numeric" 
          />

          {/* Alternative Phone Number */}
          <Text className="text-sm mb-2 text-gray-800">Alternative Phone Number:
            {" "} {errors.secondaryPhoneNumber ? <Text className="text-red-500 text-xs mb-4">{errors.secondaryPhoneNumber}</Text> : null}
          </Text>
          <TextInput
            value={secondaryPhoneNumber}
            onChangeText={setSecondaryPhoneNumber}
            className="w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800"
            placeholder="09123456789"
            keyboardType="numeric" 
          />


          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            className="w-full p-4 bg-[#00B251] rounded-lg shadow-md"
          >
            <Text className="text-center text-white font-bold">Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal for user gallery */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 bg-opacity-50">
          <View className="bg-white p-6 rounded-lg shadow-lg w-3/4">
            <Text className="text-lg font-semibold text-gray-900">
              Update Profile Picture
            </Text>
            <TouchableOpacity
              className="mt-4 p-4 bg-green-500 rounded-lg flex-row justify-center items-center"
              onPress={selectImageFromGallery}
            >
              <Ionicons name="image-outline" size={24} color="white" />
              <Text className="text-lg text-white ml-2">
                Select from Gallery
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="mt-4 p-4 bg-red-500 rounded-lg flex-row justify-center items-center"
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close-outline" size={24} color="white" />
              <Text className="text-lg text-white ml-2">Cancel</Text>
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
    </SafeAreaView>
  );
}

export default ViewProfileScreen;
