import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
  Pressable,
  ScrollView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

function ViewShopScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [shopData, setShopData] = useState(null);

  const [shopName, setShopName] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [shopLocation, setShopLocation] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [shopImage, setShopImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [isVisibleDelivery, setIsVisibleDelivery] = useState(false);
  const [isCheckedDelivery, setIsCheckedDelivery] = useState(false);

  const [isVisiblePickup, setIsVisiblePickUp] = useState(false)
  const [isCheckedPickup, setIsCheckedPickup] = useState(false)

  const [isCheckedCod, setIsCheckedCod] = useState(false)
  const [isCheckedGcash, setIsCheckedGcash] = useState(false)
  const [isCheckedBankTransfer, setIsCheckedBankTransfer] = useState(false)

  const formData = new FormData();

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
      setShopImage(result.assets[0].uri);
      setModalVisible(false);
    }
  };
  if (shopImage) {
    formData.append("image", {
      uri: shopImage,
      name: "profile.jpg",
      type: "image/jpeg",
    });
    console.log("Image added to FormData:", shopImage);
  } else {
    console.log("No image selected to upload.");
  }

  const getAsyncUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("userData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData)) {
          const user = parsedData[0];
          setUserData(user);
        } else {
          setUserData(parsedData);
        }
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };

  const getAsyncShopData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("shopData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData)) {
          const shop = parsedData[0];
          setShopData(shop);
          setShopName(shop.shop_name);
          setShopAddress(shop.shop_address);
          setShopDescription(shop.shop_description);
          setShopImage(shop.shop_image_url);
        } else {
          setShopData(parsedData);
          setShopName(parsedData.shop_name);
          setShopAddress(parsedData.shop_address);
          setShopDescription(parsedData.shop_description);
          setShopImage(parsedData.shop_image_url);
        }
      }
    } catch (error) {
      console.error("Failed to load shop data:", error);
    }
  };

  // Use useFocusEffect to re-fetch data when the screen is focused (navigated back)
  useFocusEffect(
    React.useCallback(() => {
      getAsyncUserData();
      getAsyncShopData();
    }, [])
  );

  const handleDelivery = () => {
    setIsVisibleDelivery(!isVisibleDelivery);
  };

  const handlePickup = () => {
    setIsVisiblePickUp(!isVisiblePickup)
  }

  const handleSubmit = async () => {

  }
  return (
  <SafeAreaView className="flex-1 bg-gray-100">
    <ScrollView className="flex-1 px-4">
      <View className="bg-white p-4 rounded-lg shadow-sm relative">
        {/* Circular frame with shop image */}
        <View className="items-center mb-4 mt-8">
          <View className="relative w-24 h-24 rounded-full border-4 border-green-500 shadow-lg bg-white">
            <Image
              source={{ uri: shopImage }}
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

        {/* Shop Name */}
        <View className="mb-4">
          <Text className="text-base text-gray-600">Shop Name</Text>
          <TextInput
            value={shopName}
            onChangeText={setShopName}
            className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
          />
        </View>

        {/* Shop Address */}
        <View className="mb-4">
          <Text className="text-base text-gray-600">Address</Text>
          <TextInput
            value={shopAddress}
            onChangeText={setShopAddress}
            className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
          />
        </View>

        {/* Shop Location */}
        <View className="mb-4">
          <TouchableOpacity onPress={() => navigation.navigate("")}>
            <Text className="text-base text-gray-600">Shop Location</Text>
          </TouchableOpacity>
        </View>

        {/* Shop Description */}
        <View className="mb-4">
          <Text className="text-base text-gray-600">Shop Description</Text>
          <TextInput
            value={shopDescription}
            onChangeText={setShopDescription}
            className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
          />
        </View>

        {/* Shipping Options */}
        <View className="mb-4">
          <Text className="text-base text-gray-600">Shipping Options</Text>
          <TouchableOpacity onPress={handleDelivery}>
            <Text className="mt-1 text-lg text-gray-900">Delivery</Text>
          </TouchableOpacity>
          {isVisibleDelivery && (
            <Pressable onPress={() => setIsCheckedDelivery(!isCheckedDelivery)}>
              <Text>{isCheckedDelivery ? "☑ " : "☐ "}Delivery Fee</Text>
            </Pressable>
          )}
        </View>

        <View className="mb-4">
          <TouchableOpacity onPress={handlePickup}>
            <Text className="mt-1 text-lg text-gray-900">Pickup</Text>
          </TouchableOpacity>
          {isVisiblePickup && (
            <Pressable onPress={() => setIsCheckedPickup(!isCheckedPickup)}>
              <Text>{isCheckedPickup ? "☑ " : "☐ "}Pickup Address</Text>
            </Pressable>
          )}
        </View>

        {/* Available Payment Method */}
        <View className="mb-4">
          <Text className="text-base text-gray-600">Available Payment Methods</Text>
          <Pressable onPress={() => setIsCheckedCod(!isCheckedCod)}>
            <Text>{isCheckedCod ? "☑ " : "☐ "} Cash on Delivery (COD)</Text>
          </Pressable>
          <Pressable onPress={() => setIsCheckedGcash(!isCheckedGcash)}>
            <Text>{isCheckedGcash ? "☑ " : "☐ "} GCash</Text>
          </Pressable>
          <Pressable onPress={() => setIsCheckedBankTransfer(!isCheckedBankTransfer)}>
            <Text>{isCheckedBankTransfer ? "☑ " : "☐ "}Bank Transfer</Text>
          </Pressable>
        </View>

        {/* Submit Button */}
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

export default ViewShopScreen;
