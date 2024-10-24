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
import * as ImagePicker from 'expo-image-picker'; // Assuming you're using expo-image-picker

function ShopInformationScreen({ route, navigation }) {
  const { userData } = route.params;

  // State management for the form fields
  const [shopName, setShopName] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [shopLocation, setShopLocation] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [shopImage, setShopImage] = useState(null);
  const [shopDeliveryFee, setShopDeliveryFee] = useState("");
  const [pickupAddress, setPickUpAddress] = useState("");
  const [pickupAreaFee, setPickupAreaFee] = useState("");

  // Checkbox states
  const [isCheckedDelivery, setIsCheckedDelivery] = useState(false);
  const [isCheckedPickup, setIsCheckedPickup] = useState(false);
  const [isCheckedCod, setIsCheckedCod] = useState(false);
  const [isCheckedGcash, setIsCheckedGcash] = useState(false);
  const [isCheckedBankTransfer, setIsCheckedBankTransfer] = useState(false);

  // Modal visibility state for the image picker
  const [modalVisible, setModalVisible] = useState(false);

  // Error handling state
  const [errors, setErrors] = useState({});

  // Validation regex
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
      default:
        break;
    }
    setErrors({ ...errors, [field]: error });
  };

  const handleSubmit = () => {
    // Validate inputs before proceeding to the next screen
    let hasError = false;
    if (!shopName) {
      setErrors((prev) => ({ ...prev, shopName: "Shop name is required." }));
      hasError = true;
    }
    if (!shopAddress) {
      setErrors((prev) => ({ ...prev, shopAddress: "Shop address is required." }));
      hasError = true;
    }

    if (!hasError) {
      navigation.navigate("Business Information", {
        userData,
        shopName,
        shopAddress,
        shopLocation,
        shopDescription,
        shopDeliveryFee,
        pickupAddress,
        pickupAreaFee,
      });
    } else {
      Alert.alert("Sorry","Please fill up the forms before submitting.");
    }
  };

  // Image picker function
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "Permission to access the gallery is required.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setShopImage(pickerResult.assets[0].uri);
      setModalVisible(false);
    }
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
        {/* Circular frame with shop image */}
        <View className="items-center mb-8 mt-4">
          <View className="relative w-28 h-28 rounded-full border-4 border-green-500 shadow-lg bg-white">
            <Image
              source={{ uri: shopImage || "https://via.placeholder.com/150" }} // Placeholder image
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

          {/* Shop Location */}
          <Text className="text-sm mb-2 text-[#00B251]">Shop Location: <Text className="text-red-500 text-sm">*</Text></Text>
          <TouchableOpacity
            className="w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800"
            onPress={() => navigation.navigate("Add Location")}
          >
            <Text className="text-sm mb-2 text-gray-600">Select Location:</Text>
          </TouchableOpacity>
          {errors.shopLocation && (
            <Text className="text-red-500 mb-2">{errors.shopLocation}</Text>
          )}

          {/* Shop Description */}
          <Text className="text-sm mb-2 text-[#00B251]">Shop Description: </Text>
          <TextInput
            value={shopDescription}
            onChangeText={(value) => setShopDescription(value)}
            className="w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800"
            placeholder="Enter Shop Description"
          />

          {/* Shipping Options */}
          <Text className="text-sm mb-2 text-[#00B251]">Shipping Options: <Text className="text-red-500 text-sm">*</Text></Text>

          <TouchableOpacity
            className="flex-row items-center mb-2"
            onPress={() => setIsCheckedDelivery(!isCheckedDelivery)}
          >
            <Icon
              name={isCheckedDelivery ? "checkbox-marked" : "checkbox-blank-outline"}
              type="material-community"
              color={isCheckedDelivery ? "#00B251" : "gray"}
            />
            <Text className="ml-2 text-gray-800">Delivery</Text>
          </TouchableOpacity>
          {isCheckedDelivery && (
            <>
              <Text className="text-sm mb-2 text-gray-800">Delivery Fee: <Text className="text-red-500 text-sm">*</Text>
                {errors.shopDeliveryFee && (
                  <Text className="text-red-500 mb-2">{errors.shopDeliveryFee}</Text>
                )}
              </Text>
              <TextInput
                keyboardType="numeric"
                value={shopDeliveryFee}
                onChangeText={(value) => handleInputChange('shopDeliveryFee', value)}
                className="w-full p-2 mb-4 bg-white rounded-lg shadow-md text-[#00B251]"
                placeholder="Enter Delivery Fee"
              />
            </>
          )}

          <TouchableOpacity
            className="flex-row items-center mb-2"
            onPress={() => setIsCheckedPickup(!isCheckedPickup)}
          >
            <Icon
              name={isCheckedPickup ? "checkbox-marked" : "checkbox-blank-outline"}
              type="material-community"
              color={isCheckedPickup ? "#00B251" : "gray"}
            />
            <Text className="ml-2 text-gray-800">Pickup</Text>
          </TouchableOpacity>
          {isCheckedPickup && (
            <>
              <Text className="text-sm mb-2 text-gray-800">Pickup Area Fee: <Text className="text-red-500 text-sm">*</Text>
                {errors.pickupAreaFee && (
                  <Text className="text-red-500 mb-2">{errors.pickupAreaFee}</Text>
                )}
              </Text>
              <TextInput
                keyboardType="numeric"
                value={pickupAreaFee}
                onChangeText={(value) => handleInputChange('pickupAreaFee', value)}
                className="w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800"
                placeholder="Enter Pickup Area Fee"
              />
            </>
          )}

          {/* Payment Methods */}
          <Text className="text-sm mb-2 text-[#00B251]">Payment Methods:</Text>

          <TouchableOpacity
            className="flex-row items-center mb-2"
            onPress={() => setIsCheckedCod(!isCheckedCod)}
          >
            <Icon
              name={isCheckedCod ? "checkbox-marked" : "checkbox-blank-outline"}
              type="material-community"
              color={isCheckedCod ? "#00B251" : "gray"}
            />
            <Text className="ml-2 text-gray-800">Cash on Delivery (COD)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center mb-2"
            onPress={() => setIsCheckedGcash(!isCheckedGcash)}
          >
            <Icon
              name={isCheckedGcash ? "checkbox-marked" : "checkbox-blank-outline"}
              type="material-community"
              color={isCheckedGcash ? "#00B251" : "gray"}
            />
            <Text className="ml-2 text-gray-800">Gcash</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center mb-2"
            onPress={() => setIsCheckedBankTransfer(!isCheckedBankTransfer)}
          >
            <Icon
              name={isCheckedBankTransfer ? "checkbox-marked" : "checkbox-blank-outline"}
              type="material-community"
              color={isCheckedBankTransfer ? "#00B251" : "gray"}
            />
            <Text className="ml-2 text-gray-800">Bank Transfer</Text>
          </TouchableOpacity>

          {/* Submit and Back Buttons */}
          <View className="flex-row justify-between mt-6">
            <TouchableOpacity
              className="bg-gray-300 rounded-full py-4 px-8"
              onPress={() => navigation.goBack()}
            >
              <Text className="text-white text-lg font-semibold">Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-green-600 rounded-full py-4 px-8"
              onPress={handleSubmit}
            >
              <Text className="text-white text-lg font-semibold">Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Image Picker Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-4 rounded-lg w-4/5">
            <Text className="text-lg mb-4">Select an image from the gallery</Text>
            <TouchableOpacity
              className="bg-green-500 p-4 rounded-lg"
              onPress={pickImage}
            >
              <Text className="text-white text-lg text-center">Choose Image</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="mt-4"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-center text-gray-600">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default styled(ShopInformationScreen);
