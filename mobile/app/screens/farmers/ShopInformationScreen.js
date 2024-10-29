import React, { useState } from "react";
import {
  TextInput,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { Icon } from "react-native-elements";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from 'expo-image-picker';
import placeholderlogo from "../../assets/logolabel.png"
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";

function ShopInformationScreen({ route, navigation }) {
  const { userData } = route.params;

  const [shopName, setShopName] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [shopImage, setShopImage] = useState(null);
  const [shopDeliveryFee, setShopDeliveryFee] = useState("");
  const [pickupAreaFee, setPickupAreaFee] = useState("");
  const [isCheckedDelivery, setIsCheckedDelivery] = useState(false);
  const [isCheckedPickup, setIsCheckedPickup] = useState(false);
  const [isCheckedCod, setIsCheckedCod] = useState(false);
  const [isCheckedGcash, setIsCheckedGcash] = useState(false);
  const [isCheckedBankTransfer, setIsCheckedBankTransfer] = useState(false);
  const [shopNumber, setShopNumber] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [pickupAddress, setPickupAddress] = useState("");


  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");


  const shopNameRegex = /^[A-Za-z\s]{2,}$/;
  const addressRegex = /^[A-Za-z0-9\s,'-]{10,}$/;

  const handleInputChange = (field, value) => {
    let error = "";
    switch (field) {
      case "shopName":
        if (!shopNameRegex.test(value)) {
          error = "Invalid Shop Name. Must be at least 2 characters and letters only.";
        }
        setShopName(value);
        break;
      case "shopAddress":
        if (!addressRegex.test(value)) {
          error = "Invalid Address. Must be at least 10 characters.";
        }
        setShopAddress(value);
        break;
      case "pickupAddress":
        if (!addressRegex.test(value)) {
          error = "Invalid Address. Must be at least 10 characters.";
        }
        setPickupAddress(value);
        break;
      case "shopDeliveryFee":
        if (isCheckedDelivery && (isNaN(value) || value <= 0)) {
          error = "Delivery fee must be a positive number.";
        }
        setShopDeliveryFee(value);
        break;
      case "pickupAreaFee":
        if (isCheckedPickup && (isNaN(value) || value <= 0)) {
          error = "Pickup area fee must be a positive number.";
        }
        setPickupAreaFee(value);
        break;
      case "shopNumber":
        if (value.trim() === "") {
          error = "Shop Number is required.";
        }
        setShopNumber(value);
        break;
      default:
        break;
    }
    setErrors({ ...errors, [field]: error });
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      setAlertMessage("Permission Required, Permission to access the gallery is required.");
      setAlertVisible(true);
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

 

  const handleSubmit = () => {
    let hasError = false;
    if (!shopImage) {
      setErrors((prev) => ({ ...prev, shopImage: "Shop Image is required." }));
      hasError = true;
    }
    if (!shopName) {
      setErrors((prev) => ({ ...prev, shopName: "Shop name is required." }));
      hasError = true;
    }
    if (!shopAddress) {
      setErrors((prev) => ({ ...prev, shopAddress: "Shop address is required." }));
      hasError = true;
    }
    if (!shopNumber) {
      setErrors((prev) => ({ ...prev, shopNumber: "Shop number is required." }));
      hasError = true;
    }

    if (hasError) {
      setAlertMessage("Sorry,  Please fill up the forms before continuing.");
      setAlertVisible(true);
      return;

    }

    const shopData = {
      shop_name: shopName,
      shop_address: shopAddress,
      shop_description: shopDescription,
      shop_image: shopImage,
      user_id: userData.user_id,
      delivery: isCheckedDelivery,
      delivery_price: isCheckedDelivery ? shopDeliveryFee : null,
      pickup: isCheckedPickup,
      pickup_price: isCheckedPickup ? pickupAreaFee : null,
      gcash: isCheckedGcash,
      cod: isCheckedCod,
      bank: isCheckedBankTransfer,
      shop_number: shopNumber,
      pickup_address: pickupAddress,
    };

    console.log("shopData being passed:", shopData);

    navigation.navigate("Business Information", {
      userData,
      shopData,
    });
  };


  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="flex-row justify-between items-center">
          <View className="flex-1 border-b-2 border-green-800 pb-2">
            <Text className="text-center text-green-600">Shop Information</Text>
          </View>
          <View className="flex-1 border-b-2 border-gray-300 pb-2">
            <Text className="text-center text-gray-300">
              Business Information
            </Text>
          </View>
        </View>
        <View className="items-center mb-8 mt-4">
          <View className="relative w-28 h-28 rounded-full border-4 border-green-500 shadow-lg bg-white">
            <Image
              source={shopImage ? { uri: shopImage } : placeholderlogo}
              className="w-full h-full rounded-full"
            />
            <TouchableOpacity
              className="absolute bottom-0 right-0 bg-green-500 p-2 rounded-full"
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="pencil" size={20} color="white" />
            </TouchableOpacity>
            {errors.shopImage && (
              <Text className="text-red-500 mb-2">{errors.shopImage}</Text>
            )}
          </View>

        </View>

        {/* Shop Name */}
        <View className="w-full max-w-md mx-auto">
          <Text className="text-sm mb-2 text-[#00B251]">Shop Name: <Text className="text-red-500 text-sm">*</Text>
            {errors.shopName && (
              <Text className="text-red-500 mb-2">{errors.shopName}</Text>
            )}
          </Text>
          <TextInput
            value={shopName}
            onChangeText={(value) => handleInputChange('shopName', value)}
            className="w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800"
            placeholder="Enter your Shop Name"
          />

          {/* Shop Address */}
          <Text className="text-sm mb-2 text-[#00B251]">Address: <Text className="text-red-500 text-sm">*</Text>
            {errors.shopAddress && (
              <Text className="text-red-500 mb-2">{errors.shopAddress}</Text>
            )}
          </Text>
          <TextInput
            value={shopAddress}
            onChangeText={(value) => handleInputChange('shopAddress', value)}
            className="w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800"
            placeholder="Enter Shop Address"
          />

          {/* Shop Description */}
          <Text className="text-sm mb-2 text-[#00B251]">Shop Description: </Text>
          <TextInput
            value={shopDescription}
            onChangeText={setShopDescription}
            className="w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800"
            placeholder="Enter shop description (optional)"
          />

          {/* Shop Number */}
          <Text className="text-sm mb-2 text-[#00B251]">Shop Number: <Text className="text-red-500 text-sm">*</Text></Text>
          <TextInput
            value={shopNumber}
            onChangeText={(value) => handleInputChange('shopNumber', value)}
            className="w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800"
            placeholder="Enter your Shop Number"
          />

          {/* Delivery Checkbox */}
          <Text className="text-orange-500 text-sm">NOTE: AgriTayo will not handle shipping and payment, this will only serve as away to inform the buyer for your available shipping and payment option.</Text>
          <Text className="text-sm mb-2 text-[#00B251]">Shipping Options: <Text className="text-red-500 text-sm">*</Text></Text>
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              className="mr-2"
              onPress={() => setIsCheckedDelivery(!isCheckedDelivery)}
            >
              <Ionicons
                name={isCheckedDelivery ? "checkbox-outline" : "square-outline"}
                size={24}
                color="green"
              />
            </TouchableOpacity>
            <Text className="text-sm text-gray-800">Delivery</Text>
          </View>

          {/* Delivery Fee */}
          {isCheckedDelivery && (
            <>
              <Text className="text-sm mb-2 text-gray-800">Delivery Fee:</Text>

              <TextInput
                value={shopDeliveryFee}
                onChangeText={(value) => handleInputChange('shopDeliveryFee', value)}
                className="w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800"
                placeholder="Enter delivery fee"
                keyboardType="numeric"
              />
            </>
          )}

          {/* Pickup Checkbox */}
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              className="mr-2"
              onPress={() => setIsCheckedPickup(!isCheckedPickup)}
            >
              <Ionicons
                name={isCheckedPickup ? "checkbox-outline" : "square-outline"}
                size={24}
                color="green"
              />
            </TouchableOpacity>
            <Text className="text-sm text-gray-800">Pickup</Text>
          </View>

          {/* Pickup Fee */}
          {isCheckedPickup && (
            <>
              <Text className="text-sm mb-2 text-gray-800">Pickup Address:
              </Text>
              <TextInput
                value={pickupAddress}
                onChangeText={(value) => handleInputChange('pickupAddress', value)}
                className="w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800"
                placeholder="Enter Pickup Address"
              />

              <Text className="text-sm mb-2 text-gray-800">Pickup Area Fee: </Text>
              <TextInput
                value={pickupAreaFee}
                onChangeText={(value) => handleInputChange('pickupAreaFee', value)}
                className="w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800"
                placeholder="Enter pickup area fee"
                keyboardType="numeric"
              />
            </>
          )}

          {/* COD Checkbox */}
          <Text className="text-sm mb-2 text-[#00B251]">Payment Methods:</Text>
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              className="mr-2"
              onPress={() => setIsCheckedCod(!isCheckedCod)}
            >
              <Ionicons
                name={isCheckedCod ? "checkbox-outline" : "square-outline"}
                size={24}
                color="green"
              />
            </TouchableOpacity>
            <Text className="text-sm text-gray-800">Cash on Delivery</Text>
          </View>

          {/* Gcash Checkbox */}
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              className="mr-2"
              onPress={() => setIsCheckedGcash(!isCheckedGcash)}
            >
              <Ionicons
                name={isCheckedGcash ? "checkbox-outline" : "square-outline"}
                size={24}
                color="green"
              />
            </TouchableOpacity>
            <Text className="text-sm text-gray-800">Gcash</Text>
          </View>

          {/* Bank Transfer Checkbox */}
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              className="mr-2"
              onPress={() => setIsCheckedBankTransfer(!isCheckedBankTransfer)}
            >
              <Ionicons
                name={isCheckedBankTransfer ? "checkbox-outline" : "square-outline"}
                size={24}
                color="green"
              />
            </TouchableOpacity>
            <Text className="text-sm text-gray-800">Bank Transfer</Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className="bg-[#00B251] p-4 rounded-lg shadow-md"
            onPress={handleSubmit}
          >
            <Text className="text-white text-center font-bold">Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal for image picker */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg p-8 w-5/6">
            <Text className="text-lg font-bold mb-4">Select Image Source</Text>
            <TouchableOpacity
              className="mb-4 p-2 bg-green-600 rounded-lg"
              onPress={pickImage}
            >
              <Text className="text-white text-center">Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="p-2 bg-gray-400 rounded-lg"
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

export default ShopInformationScreen;
