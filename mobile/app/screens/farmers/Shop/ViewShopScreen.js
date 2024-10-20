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
import { FontAwesome } from "@expo/vector-icons";
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

  const [errors, setErrors] = useState({});

  const validateField = (fieldName, value) => {
    let errorMessage = '';

    switch (fieldName) {
      case 'shopName':
        if (!value) errorMessage = " *Shop name cannot be empty.";
        break;
      case 'shopAddress':
        if (!value) errorMessage = " *Shop address cannot be empty.";
        break;
      case 'shopLocation':
        // You can modify this regex based on your requirement for a valid location
        if (!value) errorMessage = " *Shop location cannot be empty.";
        break;
      case 'shopDescription':
        if (!value) errorMessage = " *Shop description cannot be empty.";
        break;
      case 'shopDeliveryFee':
        if (isCheckedDelivery && (!value || isNaN(value) || Number(value) < 0)) {
          errorMessage = " *Delivery fee must be a valid number.";
        }
        break;
      case 'pickupAddress':
        if (isCheckedPickup && !value) errorMessage = " *Pickup address cannot be empty.";
        break;
      case 'pickupAreaFee':
        if (isCheckedPickup && (!value || isNaN(value) || Number(value) < 0)) {
          errorMessage = " *Pickup area fee must be a valid number.";
        }
        break;
      default:
        break;
    }

    setErrors(prevErrors => ({ ...prevErrors, [fieldName]: errorMessage }));
  };

  const handleInputChange = (fieldName, value) => {
    switch (fieldName) {
      case 'shopName':
        setShopName(value);
        validateField('shopName', value);
        break;
      case 'shopAddress':
        setShopAddress(value);
        validateField('shopAddress', value);
        break;
      case 'shopLocation':
        setShopLocation(value);
        validateField('shopLocation', value);
        break;
      case 'shopDescription':
        setShopDescription(value);
        validateField('shopDescription', value);
        break;
      case 'shopDeliveryFee':
        setShopDeliveryFee(value);
        validateField('shopDeliveryFee', value);
        break;
      case 'pickupAddress':
        setPickUpAddress(value);
        validateField('pickupAddress', value);
        break;
      case 'pickupAreaFee':
        setPickUpAreaFee(value);
        validateField('pickupAreaFee', value);
        break;
      default:
        break;
    }
  };

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

        const userId = parsedData.user_id || parsedData.id;
        setUserId(userId);
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
          borderRadius: 25,
          borderWidth: 2,
          borderColor: checked ? "#00b251" : "#00B251",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 8,
        }}
      >
        {checked && <FontAwesome name="circle" size={16} color="#00B251" />}
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

    try {
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/shops/${shopId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${REACT_NATIVE_API_KEY}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      if (result.success) {
        Alert.alert("Success", "Profile updated successfully!");
        navigation.navigate("ViewShop");
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Circular frame with shop image */}
        <View className="items-center mb-8">
          <View className="relative w-28 h-28 rounded-full border-4 border-green-500 shadow-lg bg-white">
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
        <View className="w-full max-w-md mx-auto">
          <Text className="text-sm mb-2 text-gray-800">Shop Name:
            {errors.shopName && (
              <Text className="text-red-500 mb-2">{errors.shopName}</Text>
            )}
          </Text>
          <TextInput
            value={shopName}
            onChangeText={(value) => handleInputChange('shopName', value)}
            className="w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800"
          />

          {/* Shop Address */}
          <Text className="text-sm mb-2 text-gray-800">Address:
            {errors.shopAddress && (
              <Text className="text-red-500 mb-2">{errors.shopAddress}</Text>
            )}
          </Text>
          <TextInput
            value={shopAddress}
            onChangeText={(value) => handleInputChange('shopAddress', value)}
            className="w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800"
          />

          {/* Shop Location */}
          <Text className="text-sm mb-2 text-gray-800">Shop Location:</Text>
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
          <Text className="text-sm mb-2 text-gray-800">Shop Description:
            {errors.shopDescription && (
              <Text className="text-red-500 mb-2">{errors.shopDescription}</Text>
            )}
          </Text>
          <TextInput
            value={shopDescription}
            onChangeText={(value) => handleInputChange('shopDescription', value)}
            className="w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800"
          />

          {/* Shipping Options */}
          <Text className="text-sm mb-2 text-gray-800">Shipping Options:</Text>

          <CustomCheckbox
            label="Delivery"
            checked={isCheckedDelivery}
            onPress={() => {
              setIsCheckedDelivery(!isCheckedDelivery);
              if (!isCheckedDelivery) setShopDeliveryFee(""); // Reset if unchecked
            }}
          />
          {isCheckedDelivery && (
            <>
              <Text className="text-sm mb-2 text-gray-800">Delivery Fee:
                {errors.shopDeliveryFee && (
                  <Text className="text-red-500 mb-2">{errors.shopDeliveryFee}</Text>
                )}
              </Text>
              <TextInput
                keyboardType="numeric"
                value={shopDeliveryFee}
                onChangeText={(value) => handleInputChange('shopDeliveryFee', value)}
                className="w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800"
              />

            </>
          )}

          <CustomCheckbox
            label="Pickup"
            checked={isCheckedPickup}
            onPress={() => {
              setIsCheckedPickup(!isCheckedPickup);
              if (!isCheckedPickup) setPickUpAddress(""); // Reset if unchecked
            }}
          />
          {isCheckedPickup && (
            <>
              <Text className="text-sm mb-2 text-gray-800">Pickup Address:
                {errors.pickupAddress && (
                  <Text className="text-red-500 mb-2">{errors.pickupAddress}</Text>
                )}
              </Text>
              <TextInput
                className="w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800"
                value={pickupAddress}
                onChangeText={(value) => handleInputChange('pickupAddress', value)}
              />

              <Text className="text-sm mb-2 text-gray-800">Pickup Area Fee:
                {errors.pickupAreaFee && (
                  <Text className="text-red-500 mb-2">{errors.pickupAreaFee}</Text>
                )}
              </Text>
              <TextInput
                keyboardType="numeric"
                value={pickupAreaFee}
                onChangeText={(value) => handleInputChange('pickupAreaFee', value)}
                className="w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800"
              />

            </>
          )}

          {/* Available Payment Method */}
          <Text className="text-sm mb-2 text-gray-800">Available Payment Methods:</Text>

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

          {/* Submit Button */}
          <TouchableOpacity
            className="w-full mt-8 p-4 bg-[#00B251] rounded-lg shadow-md"
            onPress={() => {
              // Validate all fields before submitting
              handleInputChange('shopName', shopName);
              handleInputChange('shopAddress', shopAddress);
              handleInputChange('shopLocation', shopLocation);
              handleInputChange('shopDescription', shopDescription);
              handleInputChange('shopDeliveryFee', shopDeliveryFee);
              handleInputChange('pickupAddress', pickupAddress);
              handleInputChange('pickupAreaFee', pickupAreaFee);

              if (Object.values(errors).every(error => !error)) {
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
              } else {
                Alert.alert("Error", "Please fix the errors before submitting.");
              }
            }}
          >
            <Text className="text-center text-white font-bold">Submit</Text>
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
            <Text className="text-lg font-semibold text-gray-900">Update Profile Picture</Text>
            <TouchableOpacity
              className="mt-4 p-4 bg-green-500 rounded-lg flex-row justify-center items-center"
              onPress={selectImageFromGallery}
            >
              <Ionicons name="image-outline" size={24} color="white" />
              <Text className="text-lg text-white ml-2">Select from Gallery</Text>
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
