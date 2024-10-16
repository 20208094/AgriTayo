import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
  ScrollView,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";

function ViewShopScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [shopData, setShopData] = useState(null);

  const [shopName, setShopName] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [shopLocation, setShopLocation] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [shopImage, setShopImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [shopDeliveryFee, setShopDeliveryFee] = useState("");
  const [pickupAreaFee, setPickUpAreaFee] = useState("");
  const [pickupAddress, setPickUpAddress] = useState("");
  const [userId, setUserId] = useState("");
  const [shopId, setShopId] = useState("");

  const [isCheckedDelivery, setIsCheckedDelivery] = useState(false);
  const [isCheckedPickup, setIsCheckedPickup] = useState(false);
  const [isCheckedCod, setIsCheckedCod] = useState(false);
  const [isCheckedGcash, setIsCheckedGcash] = useState(false);
  const [isCheckedBankTransfer, setIsCheckedBankTransfer] = useState(false);

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

  const getAsyncUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("userData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserData(Array.isArray(parsedData) ? parsedData[0] : parsedData);

        // Here, adjust the property names according to your user data structure
        const userId = parsedData.user_id || parsedData.id; // Make sure to adjust according to your actual user object
        setUserId(userId); // Set userId here
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
        const shop = Array.isArray(parsedData) ? parsedData[0] : parsedData;
        setShopData(shop);
        setShopId(shop.shop_id);
        setShopName(shop.shop_name);
        setShopAddress(shop.shop_address);
        setShopLocation(shop.shop_location);
        setShopDescription(shop.shop_description);
        setShopImage(shop.shop_image_url);
        setShopDeliveryFee(String(shop.delivery_price));
        setPickUpAreaFee(String(shop.pickup_price));
        setIsCheckedPickup(shop.pickup);
        setIsCheckedDelivery(shop.delivery);
        setIsCheckedCod(shop.cod);
        setIsCheckedGcash(shop.gcash);
        setIsCheckedBankTransfer(shop.bank);
        setPickUpAddress(shop.shop_address);
        setUserId(shop.user_id);
      }
    } catch (error) {
      console.error("Failed to load shop data:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getAsyncUserData();
      getAsyncShopData();
    }, [])
  );

  const CustomCheckbox = ({ label, checked, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 4,
          borderWidth: 2,
          borderColor: checked ? "#00b251" : "#ccc",
          backgroundColor: checked ? "#00b251" : "transparent",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 8,
        }}
      >
        {checked && <Ionicons name="checkmark" size={16} color="white" />}
      </View>
      <Text style={{ fontSize: 16, color: "#333" }}>{label}</Text>
    </TouchableOpacity>
  );

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("shop_id", shopId);
    formData.append("shop_name", shopName);
    formData.append("shop_address", shopAddress);
    formData.append("shop_description", shopDescription);
    if (shopImage) {
      formData.append("image", {
        uri: shopImage,
        name: "shop.jpg",
        type: "image/jpeg",
      });
    }
    formData.append("delivery", isCheckedDelivery);
    formData.append("pickup", isCheckedPickup);
    formData.append("delivery_price", shopDeliveryFee);
    formData.append("delivery_address", pickupAddress);
    formData.append("pickup_price", pickupAreaFee);
    formData.append("gcash", isCheckedGcash);
    formData.append("cod", isCheckedCod);
    formData.append("bank", isCheckedBankTransfer);
    formData.append("user_id", userId);
    formData.append("longitude", 1.0);
    formData.append("latitude", 1.0);

    // Debugging logs
    console.log("Submitting shop data:", {
      shop_name: shopName,
      shop_address: shopAddress,
      shop_location: shopLocation,
      shop_description: shopDescription,
      image: shopImage,
      delivery: isCheckedDelivery,
      pickup: isCheckedPickup,
      delivery_price: shopDeliveryFee,
      delivery_address: pickupAddress,
      pickup_price: pickupAreaFee,
      gcash: isCheckedGcash,
      cod: isCheckedCod,
      bank: isCheckedBankTransfer,
      user_id: userId,
      longtitude: 1.0,
      latitude: 1.0,
      shop_id: shopId,
    });

    try {
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/shops/${shopId}`,
        {
          method: "PUT",
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
          body: formData,
        }
      );

      console.log("Response status:", response.status);
      console.log("Response body:", await response.text()); // Log response body for more info

      const updatedShopData = {
        shop_name: shopName,
        shop_address: shopAddress,
        shop_location: shopLocation,
        shop_description: shopDescription,
        image: shopImage,
        shop_image_url: shopImage,
        delivery: isCheckedDelivery,
        pickup: isCheckedPickup,
        delivery_price: shopDeliveryFee,
        delivery_address: pickupAddress,
        pickup_price: pickupAreaFee,
        gcash: isCheckedGcash,
        cod: isCheckedCod,
        bank: isCheckedBankTransfer,
        user_id: userId,
        longtitude: 1.0,
        latitude: 1.0,
        shop_id: shopId,
      };

      if (!response.ok) {
        throw new Error("Failed to Edit Shop");
      }

      console.log("form data:", JSON.stringify(updatedShopData));
      AsyncStorage.setItem("shopData", JSON.stringify(updatedShopData));
      getAsyncShopData();
      alert("Shop Updated Successfully!");
      navigation.navigate('My Shop')
    } catch (error) {
      alert("There was an error editing the shop.");
    }
  };

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
            <Text className="text-base text-gray-600">Shop Location</Text>
            <TouchableOpacity
              className="flex-row justify-between items-center p-3 border border-gray-300 rounded-lg"
              onPress={() => navigation.navigate("Add Location")}
            >
              <Text className="text-base text-gray-600">Select Location</Text>
              <Ionicons name="chevron-forward-outline" size={20} color="gray" />
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
            <Text className="text-base text-gray-600">Shipping Options: </Text>

            <CustomCheckbox
              label="Delivery"
              checked={isCheckedDelivery}
              onPress={() => setIsCheckedDelivery(!isCheckedDelivery)}
            />
            {isCheckedDelivery && (
              <>
                <Text className="text-base text-gray-600">Delivery Fee:</Text>
                <TextInput
                  keyboardType="numeric"
                  value={shopDeliveryFee}
                  onChangeText={setShopDeliveryFee}
                  className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
                />
              </>
            )}

            <CustomCheckbox
              label="Pickup"
              checked={isCheckedPickup}
              onPress={() => setIsCheckedPickup(!isCheckedPickup)}
            />
            {isCheckedPickup && (
              <>
                <Text className="text-base text-gray-600">Pickup Address:</Text>
                <TextInput
                  className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
                  value={pickupAddress}
                  onChangeText={setPickUpAddress}
                />
                <Text className="text-base text-gray-600">
                  Pickup Area Fee:
                </Text>
                <TextInput
                  keyboardType="numeric"
                  value={pickupAreaFee}
                  onChangeText={setPickUpAreaFee}
                  className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
                />
              </>
            )}
          </View>

          {/* Available Payment Method */}
          <View className="mb-4">
            <Text className="text-base text-gray-600">
              Available Payment Methods
            </Text>

            <CustomCheckbox
              label="Cash on Delivery (COD)"
              checked={isCheckedCod}
              onPress={() => setIsCheckedCod(!isCheckedCod)}
            />

            <CustomCheckbox
              label="GCash"
              checked={isCheckedGcash}
              onPress={() => setIsCheckedGcash(!isCheckedGcash)}
            />

            <CustomCheckbox
              label="Bank Transfer"
              checked={isCheckedBankTransfer}
              onPress={() => setIsCheckedBankTransfer(!isCheckedBankTransfer)}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className="bg-green-500 py-3 rounded-lg flex-row justify-center items-center shadow-lg mt-4 mb-4"
            onPress={() => {
              Alert.alert(
                "Confirm Update Profile",
                "Do you really want to update this profile?",
                [
                  {
                    text: "No",
                    onPress: () => console.log("Shop Update Cancelled"),
                    style: "cancel",
                  },
                  {
                    text: "Yes",
                    onPress: handleSubmit,
                  },
                ],
                { cancelable: false }
              );
            }}
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
