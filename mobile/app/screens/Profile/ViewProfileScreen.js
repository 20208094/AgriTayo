import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons"; // Ensure you have this package installed
import GoBack from "../../components/GoBack";

const editButton = require("../../assets/edit.png");
const userImage = require("../../assets/user.png"); // Import the user image

function ViewProfileScreen({ route, navigation }) {
  const { profile } = route.params;

  // State to manage input values
  const [firstName, setFirstName] = useState(profile.firstname);
  const [middleName, setMiddleName] = useState(profile.middlename);
  const [lastName, setLastName] = useState(profile.lastname);
  const [birthday, setBirthday] = useState(profile.birthday);
  const [gender, setGender] = useState(profile.gender);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone || "091234567890"); // Default phone number

  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [profileImage, setProfileImage] = useState(userImage); // State for the profile image

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
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage({ uri: result.assets[0].uri });
      setModalVisible(false);
    }
  };

  // Function to handle taking a picture
  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage({ uri: result.assets[0].uri });
      setModalVisible(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="flex-1 px-4">
        <View className="bg-white p-4 rounded-lg shadow-sm relative">
          {/* Back Button */}
          <GoBack navigation={navigation} />

          {/* Circular frame with user image and shadow effect */}
          <View className="items-center mb-4 mt-8">
            <View className="relative w-24 h-24 rounded-full border-4 border-green-500 shadow-lg bg-white">
              <Image
                source={profileImage}
                className="w-full h-full rounded-full"
              />
              <TouchableOpacity
                className="absolute bottom-0 right-0 bg-green-500 p-2 rounded-full"
                onPress={() => setModalVisible(true)} // Show modal on press
              >
                <Ionicons name="pencil" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row items-center mb-2">
            <Ionicons name="person-circle-outline" size={24} color="#50d71e" />
            <Text className="text-lg font-medium text-gray-800 ml-2">
              Account Information
            </Text>
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
            <Text className="text-base text-gray-600 flex-row items-center">
              <Ionicons name="calendar-outline" size={20} color="#50d71e" />{" "}
              Birthday
            </Text>
            <TextInput
              value={birthday}
              onChangeText={setBirthday}
              className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
            />
          </View>
          <View className="mb-4">
            <Text className="text-base text-gray-600 flex-row items-center">
              <Ionicons name="male-female-outline" size={20} color="#50d71e" />{" "}
              Gender
            </Text>
            <TextInput
              value={gender}
              onChangeText={setGender}
              className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
            />
          </View>
          <View className="mb-4">
            <Text className="text-base text-gray-600 flex-row items-center">
              <Ionicons name="mail-outline" size={20} color="#50d71e" /> Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
            />
          </View>
          <View className="mb-4">
            <Text className="text-base text-gray-600 flex-row items-center">
              <Ionicons name="call-outline" size={20} color="#50d71e" /> Phone
            </Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
              placeholder="091234567890" // Placeholder for phone number
            />
          </View>
        </View>

        <TouchableOpacity
          className="bg-green-500 py-3 rounded-lg flex-row justify-center items-center shadow-lg mt-4 mb-4"
          onPress={() => navigation.navigate("Edit Profile", { profile })}
        >
          <Image
            source={editButton}
            className="w-6 h-6"
            style={{ tintColor: "white" }}
          />
          <Text className="text-lg text-white ml-2">Edit Profile</Text>
        </TouchableOpacity>
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
              className="mt-4 p-4 bg-green-500 rounded-lg flex-row justify-center items-center"
              onPress={takePicture}
            >
              <Ionicons name="camera-outline" size={24} color="white" />
              <Text className="text-lg text-white ml-2">Take a Picture</Text>
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
