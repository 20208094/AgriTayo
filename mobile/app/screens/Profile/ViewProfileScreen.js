import React, { useState } from "react";
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
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from '@env';
const SOCKET_URL = 'https://agritayo.azurewebsites.net';

import AsyncStorage from "@react-native-async-storage/async-storage";
const editButton = require("../../assets/edit.png");

function ViewProfileScreen({ route, navigation }) {
  const { userData } = route.params;

  // State to manage input values
  const [firstName, setFirstName] = useState(userData.firstname);
  const [middleName, setMiddleName] = useState(userData.middlename);
  const [lastName, setLastName] = useState(userData.lastname);
  const [birthday, setBirthday] = useState(userData.birthday);
  const [gender, setGender] = useState(userData.gender);
  const [email, setEmail] = useState(userData.email);
  const [phone, setPhone] = useState(userData.phone_number);
  const [profileImage, setProfileImage] = useState(userData.user_image_url);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Function to handle image selection from gallery
  const selectImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
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

  // Function to handle saving the profile
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('user_id', userData.user_id);
    formData.append('user_type_id', userData.user_type_id);
    formData.append('firstname', firstName);
    formData.append('middlename', middleName);
    formData.append('lastname', lastName);
    formData.append('email', email);
    formData.append('phone_number', phone);
    formData.append('gender', gender);
    formData.append('birthday', birthday);
  
    if (profileImage) {
      formData.append('image', {
        uri: profileImage,
        name: 'profile.jpg',
        type: 'image/jpeg',
      });
      console.log("Image added to FormData:", profileImage);
    } else {
      console.log("No image selected to upload.");
    }
  
    try {
      console.log("Sending request to update profile...");
      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/users/${userData.user_id}`, {
        method: 'PUT',
        headers: {
          'x-api-key': REACT_NATIVE_API_KEY,
        },
        body: formData,
      });
  
      console.log("Response Status:", response.status);
      if (response.ok) {
        alert("Profile updated successfully!");
  
        // Construct updated user data
        const updatedUserData = {
          ...userData,
          firstname: firstName,
          middlename: middleName,
          lastname: lastName,
          email: email,
          phone_number: phone,
          gender: gender,
          birthday: birthday,
          user_image_url: profileImage, // Add the profile image URL
        };
  
        // Save updated data to AsyncStorage
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
        console.log("Updated profile data saved to AsyncStorage!");
  
        // Navigate back and pass the updated user data
        navigation.goBack(updatedUserData); 
      } else {
        const errorData = await response.json();
        console.error("Error response data:", errorData);
        throw new Error(errorData.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile: " + error.message);
    }
  };
  
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="flex-1 px-4">
        <View className="bg-white p-4 rounded-lg shadow-sm relative">
          {/* Circular frame with user image */}
          <View className="items-center mb-4 mt-8">
            <View className="relative w-24 h-24 rounded-full border-4 border-green-500 shadow-lg bg-white">
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

          <View className="mb-4">
            <Text className="text-base text-gray-600">First Name</Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
            />
          </View>
          <View className="mb-4">
            <Text className="text-base text-gray-600">Middle Name</Text>
            <TextInput
              value={middleName}
              onChangeText={setMiddleName}
              className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
            />
          </View>
          <View className="mb-4">
            <Text className="text-base text-gray-600">Last Name</Text>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
            />
          </View>

          <View className="mb-4">
            <Text className="text-base text-gray-600">Birthday</Text>
            <TextInput
              value={birthday}
              onChangeText={setBirthday}
              className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
            />
          </View>
          <View className="mb-4">
            <Text className="text-base text-gray-600">Gender</Text>
            <TextInput
              value={gender}
              onChangeText={setGender}
              className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
            />
          </View>
          <View className="mb-4">
            <Text className="text-base text-gray-600">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
            />
          </View>
          <View className="mb-4">
            <Text className="text-base text-gray-600">Phone</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
              placeholder="091234567890"
            />
          </View>

          <TouchableOpacity
            className="bg-green-500 py-3 rounded-lg flex-row justify-center items-center shadow-lg mt-4 mb-4"
            onPress={handleSubmit}
          >
            <Text className="text-lg text-white">Submit</Text>
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
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
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
    </SafeAreaView>
  );
}

export default ViewProfileScreen;
