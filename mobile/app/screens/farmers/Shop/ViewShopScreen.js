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
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { FontAwesome } from "@expo/vector-icons";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import LoadingAnimation from "../../../components/LoadingAnimation";
function ViewShopScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [shopData, setShopData] = useState(null);

  const [shopName, setShopName] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [shopImage, setShopImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [shopDeliveryFeeMin, setShopDeliveryFeeMin] = useState("");
  const [shopDeliveryFeeMax, setShopDeliveryFeeMax] = useState("");
  const [pickupAreaFee, setPickUpAreaFee] = useState("");
  const [pickupAddress, setPickUpAddress] = useState("");
  const [userId, setUserId] = useState("");
  const [shopId, setShopId] = useState("");

  const [isCheckedDelivery, setIsCheckedDelivery] = useState(false);
  const [isCheckedPickup, setIsCheckedPickup] = useState(false);
  const [isCheckedCod, setIsCheckedCod] = useState(false);
  const [isCheckedGcash, setIsCheckedGcash] = useState(false);
  const [isCheckedBankTransfer, setIsCheckedBankTransfer] = useState(false);
  const [tin, setTin] = useState("");
  const [birCertificate, setBirCertificate] = useState(null);
  const [shopNumber, setShopNumber] = useState("");
  const [shopSecondaryNumber, setShopSecondaryNumber] = useState("");
  const [errors, setErrors] = useState({});

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [alertVisible2, setAlertVisible2] = useState(false);
  const [alertMessage2, setAlertMessage2] = useState("");
  const [alertVisible3, setAlertVisible3] = useState(false);
  const [alertMessage3, setAlertMessage3] = useState("");
  const [loading, setLoading] = useState(false);

  const validateField = (fieldName, value) => {
    let errorMessage = "";

    switch (fieldName) {
      case "shopName":
        if (!value) errorMessage = " *Shop name cannot be empty.";
        break;
      case "shopAddress":
        if (!value) errorMessage = " *Shop address cannot be empty.";
        break;
      case "shopDescription":
        if (!value) errorMessage = " *Shop description cannot be empty.";
        break;
      case "shopDeliveryFeeMin":
        if (
          isCheckedDelivery &&
          value &&
          (!/^\d+$/.test(value) || value < 0)
        ) {
          errorMessage = "\n Minimum delivery fee must be a positive integer.";
        }
        break;
      case "shopDeliveryFeeMax":
        if (
          isCheckedDelivery &&
          value &&
          (!/^\d+$/.test(value) || value < 0)
        ) {
          errorMessage = "\n Maximum delivery fee must be a positive integer.";
        }
        break;
      case "pickupAddress":
        if (isCheckedPickup && !value)
          errorMessage = " *Pickup address cannot be empty.";
        break;
      case "pickupAreaFee":
        if (isCheckedPickup && (!value || isNaN(value) || Number(value) < 0)) {
          errorMessage = " *Pickup area fee must be a valid number.";
        }
        break;
      case "shippingOption":
        if (!isCheckedDelivery && !isCheckedPickup) {
          errorMessage = " *Please select at least one shipping option.";
        }
        break;
      case "paymentMethod":
        if (!isCheckedCod && !isCheckedGcash && !isCheckedBankTransfer) {
          errorMessage = " *Please select at least one payment method.";
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: errorMessage }));
  };

  const handleInputChange = (fieldName, value) => {
    switch (fieldName) {
      case "shopName":
        setShopName(value);
        validateField("shopName", value);
        break;
      case "shopAddress":
        setShopAddress(value);
        validateField("shopAddress", value);
        break;
      case "shopDescription":
        setShopDescription(value);
        validateField("shopDescription", value);
        break;
      case "shopNumber":
        setShopNumber(value);
        validateField("shopNumber", value);
        break;
      case "shopSecondaryNumber":
        setShopSecondaryNumber(value);
        validateField("shopSecondaryNumber", value);
        break;
      case "shopDeliveryFeeMin":
        setShopDeliveryFeeMin(value);
        validateField("shopDeliveryFeeMin", value);
        break;
      case "shopDeliveryFeeMax":
        setShopDeliveryFeeMax(value);
        validateField("shopDeliveryFeeMax", value);
        break;
      case "pickupAddress":
        setPickUpAddress(value);
        validateField("pickupAddress", value);
        break;
      case "pickupAreaFee":
        setPickUpAreaFee(value);
        validateField("pickupAreaFee", value);
        break;
      default:
        break;
    }
  };

  // Update the shipping option and payment method check on press
  const handleShippingOptionCheck = () => {
    validateField("shippingOption");
  };

  const handlePaymentMethodCheck = () => {
    validateField("paymentMethod");
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


  // Updated selectImageFromGallery function
  const selectImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setAlertMessage(
        "Sorry, we need camera roll permissions to make this work!"
      );
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
        setShopImage(imageUri);
        setModalVisible(false);
      }
    }
  };

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
        setShopImage(imageUri);
        setModalVisible(false);
      }
    }
  };


  // Updated selectBirImageFromGallery function
  const selectBirImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setAlertMessage(
        "Sorry, we need camera roll permissions to make this work!"
      );
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
        setBirCertificate(imageUri);
        setModalVisible2(false);
      }
    }
  };

  const selectBirImageFromCamera = async () => {
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
        setBirCertificate(imageUri);
        setModalVisible2(false);
      }
    }
  };

  // Function to remove the selected image
  const removeBirImage = () => {
    setBirCertificate(null); // Clears the selected image
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
        setShopDescription(shop.shop_description);
        setShopImage(shop.shop_image_url);
        setShopDeliveryFeeMin(String(shop.delivery_price_min));
        setShopDeliveryFeeMax(String(shop.delivery_price_max));
        setPickUpAreaFee(String(shop.pickup_price));
        setIsCheckedPickup(shop.pickup);
        setIsCheckedDelivery(shop.delivery);
        setIsCheckedCod(shop.cod);
        setIsCheckedGcash(shop.gcash);
        setIsCheckedBankTransfer(shop.bank);
        setPickUpAddress(shop.pickup_address);
        setUserId(shop.user_id);
        setTin(shop.tin_number);
        setBirCertificate(shop.bir_image_url);
        setShopNumber(shop.shop_number);
        setShopSecondaryNumber(shop.secondary_shop_number);
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
          borderColor: checked ? "#00b251" : "#00B251",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 8,
        }}
      >
        {checked && <FontAwesome name="check" size={16} color="#00B251" />}
      </View>
      <Text style={{ fontSize: 16, color: "#333" }}>{label}</Text>
    </TouchableOpacity>
  );


  const handleSubmit = async () => {
    setLoading(true);
    console.log("Starting submission...");
    console.log("Shop ID:", shopId);
    console.log("Shop Image:", shopImage);
    console.log("BIR Certificate:", birCertificate);

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
      console.log("Appended shop image:", shopImage);
    }

    formData.append("delivery", isCheckedDelivery);
    formData.append("pickup", isCheckedPickup);
    formData.append("delivery_price_min", shopDeliveryFeeMin);
    formData.append("delivery_price_max", shopDeliveryFeeMax);
    formData.append("pickup_address", pickupAddress);
    formData.append("pickup_price", pickupAreaFee);
    formData.append("gcash", isCheckedGcash);
    formData.append("cod", isCheckedCod);
    formData.append("bank", isCheckedBankTransfer);
    formData.append("user_id", userId);
    formData.append("tin_number", tin);

    if (birCertificate) {
      formData.append("bir_image", {
        uri: birCertificate.uri,
        name: "bir_certificate.jpg",
        type: "image/jpeg",
      });
      console.log("Appended BIR certificate:", birCertificate.uri);
    }

    formData.append("shop_number", shopNumber);
    formData.append("secondary_shop_number", shopSecondaryNumber);

    console.log("Final FormData before submission:", formData);

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

      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(responseText || "Failed to Edit Shop");
      }

      const responseData = await response.json();
      console.log("API Response:", responseData);

      if (responseData.data) {
        const filteredShops = Array.isArray(responseData.data)
          ? responseData.data.filter((shop) => shop.user_id === userData.user_id)
          : [responseData.data];

        // Save to AsyncStorage
        await AsyncStorage.setItem("shopData", JSON.stringify(filteredShops));
        console.log("Saved updated shop data to AsyncStorage.");
      } else {
        console.log("No shop data returned from the API.");
      }

      // Refresh shop data explicitly after submission
      await getAsyncShopData();

      setAlertMessage3(responseData.message || "Shop Updated Successfully!");
      setAlertVisible3(true);
    } catch (error1) {
      console.error("Error during submission:", error1.message);
      console.error("Full error object:", error1);
      setAlertMessage3("There was an error editing the shop.");
      setAlertVisible3(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingAnimation />;
  }
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
          <Text className="text-sm mb-2 text-gray-800">
            Shop Name:
            {errors.shopName && (
              <Text className="text-red-500 mb-2">{errors.shopName}</Text>
            )}
          </Text>
          <TextInput
            value={shopName}
            onChangeText={(value) => handleInputChange("shopName", value)}
            className="w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800"
          />

          {/* Shop Address */}
          <Text className="text-sm mb-2 text-gray-800">
            Address:
            {errors.shopAddress && (
              <Text className="text-red-500 mb-2">{errors.shopAddress}</Text>
            )}
          </Text>
          <TextInput
            value={shopAddress}
            onChangeText={(value) => handleInputChange("shopAddress", value)}
            className="w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800"
          />

          {/* Shop Description */}
          <Text className="text-sm mb-2 text-gray-800">
            Shop Description:
            {errors.shopDescription && (
              <Text className="text-red-500 mb-2">
                {errors.shopDescription}
              </Text>
            )}
          </Text>
          <TextInput
            value={shopDescription}
            onChangeText={(value) =>
              handleInputChange("shopDescription", value)
            }
            className="w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800"
          />

          {/* Shop Number */}
          <View className="relative w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800">
            <Text className="text-sm mb-2 text-gray-800">Shop Number:</Text>
            <Text className="">{shopNumber}</Text>

            <TouchableOpacity
              style={{ position: "absolute", top: 10, right: 10 }}
              onPress={() =>
                navigation.navigate("Edit Shop Phone", {
                  shopNumber,
                  shopId,
                })
              }
            >
              <Ionicons name="pencil" size={20} color="gray" />
            </TouchableOpacity>
          </View>

          <View className="relative w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800">
            <Text className="text-sm mb-2 text-gray-800">
              Alternative Shop Number:
            </Text>
            <Text className="">{shopSecondaryNumber}</Text>
            <TouchableOpacity
              style={{ position: "absolute", top: 10, right: 10 }}
              onPress={() =>
                navigation.navigate("Edit Alternative Shop Phone", {
                  shopSecondaryNumber,
                  shopId,
                })
              }
            >
              <Ionicons name="pencil" size={20} color="gray" />
            </TouchableOpacity>
          </View>

          {/* Shipping Options */}
          <Text className="text-sm mb-2 text-gray-800">Shipping Options:
            {errors.shippingOption && (
              <Text className="text-red-500 mb-2">
                {errors.shippingOption}
              </Text>
            )}
          </Text>
          <CustomCheckbox
            label="Delivery"
            checked={isCheckedDelivery}
            onPress={() => {
              setIsCheckedDelivery(!isCheckedDelivery);
              if (!isCheckedDelivery) setShopDeliveryFeeMin("");
              if (!isCheckedDelivery) setShopDeliveryFeeMax("");
              handleShippingOptionCheck();
            }}
          />
          {isCheckedDelivery && (
            <>
              <Text className="text-sm mb-2 text-gray-800">
                Delivery Fee:
                {errors.shopDeliveryFeeMin && (
                  <Text className="text-red-500 mb-2">
                    {errors.shopDeliveryFeeMin}
                  </Text>
                )}
                {errors.shopDeliveryFeeMax && (
                  <Text className="text-red-500 mb-2">
                    {errors.shopDeliveryFeeMax}
                  </Text>
                )}
              </Text>
              <View className="flex-row justify-between w-screen">
                <Text className="text-sm mb-2 text-gray-800 flex-1">
                  Minimum:
                </Text>
                <Text className="text-sm mb-2 text-gray-800 flex-1">
                  Maximum:
                </Text>
              </View>
              <View className="flex-row">
                <TextInput
                  value={shopDeliveryFeeMin}
                  onChangeText={(value) =>
                    handleInputChange("shopDeliveryFeeMin", value)
                  }
                  className="w-2/5 p-2 mb-4 bg-white rounded-lg flex-1 shadow-md text-gray-800 border"
                  placeholder="Enter delivery fee"
                  keyboardType="numeric"
                />
                <View className="mt-2">
                  <Ionicons
                    name="remove-outline"
                    size={24}
                    color="black"
                  />
                </View>
                <TextInput
                  value={shopDeliveryFeeMax}
                  onChangeText={(value) =>
                    handleInputChange("shopDeliveryFeeMax", value)
                  }
                  className="w-2/5 p-2 mb-4 bg-white rounded-lg flex-1 shadow-md text-gray-800 border"
                  placeholder="Enter delivery fee"
                  keyboardType="numeric"
                />
              </View>
            </>
          )}
          <CustomCheckbox
            label="Pickup"
            checked={isCheckedPickup}
            onPress={() => {
              setIsCheckedPickup(!isCheckedPickup);
              if (!isCheckedPickup) setPickUpAddress(""); // Reset if unchecked
              handleShippingOptionCheck();
            }}
          />
          {isCheckedPickup && (
            <>
              <Text className="text-sm mb-2 text-gray-800">
                Pickup Address:
                {errors.pickupAddress && (
                  <Text className="text-red-500 mb-2">
                    {errors.pickupAddress}
                  </Text>
                )}
              </Text>
              <TextInput
                className="w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800"
                value={pickupAddress}
                onChangeText={(value) =>
                  handleInputChange("pickupAddress", value)
                }
              />
              <Text className="text-sm mb-2 text-gray-800">
                Pickup Area Fee:
                {errors.pickupAreaFee && (
                  <Text className="text-red-500 mb-2">
                    {errors.pickupAreaFee}
                  </Text>
                )}
              </Text>
              <TextInput
                keyboardType="numeric"
                value={pickupAreaFee}
                onChangeText={(value) =>
                  handleInputChange("pickupAreaFee", value)
                }
                className="w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800"
              />
            </>
          )}

          {/* Payment Method */}
          <Text className="text-sm mb-2 text-gray-800">
            Available Payment Methods:
            {errors.paymentMethod && (
              <Text className="text-red-500 mb-2">
                {errors.paymentMethod}
              </Text>
            )}
          </Text>
          <CustomCheckbox
            label="Cash on Delivery (COD)"
            checked={isCheckedCod}
            onPress={() => {
              setIsCheckedCod(!isCheckedCod);
              handlePaymentMethodCheck();
            }}
          />
          <CustomCheckbox
            label="GCash"
            checked={isCheckedGcash}
            onPress={() => {
              setIsCheckedGcash(!isCheckedGcash);
              handlePaymentMethodCheck();
            }}
          />
          <CustomCheckbox
            label="Bank Transfer"
            checked={isCheckedBankTransfer}
            onPress={() => {
              setIsCheckedBankTransfer(!isCheckedBankTransfer);
              handlePaymentMethodCheck();
            }}
          />


          {/*TIN NUMBER */}
          <Text className="text-sm mb-2 text-gray-800">
            Taxpayer Identification Number (TIN):{" "}
            <Text className="text-red-500 text-sm">*</Text>
          </Text>
          <TextInput
            className="w-full p-2 mb-4 bg-white rounded-lg shadow-md text-gray-800"
            keyboardType="numeric"
            placeholder="TIN"
            value={tin}
            onChangeText={setTin}
          />

          <Text className="text-sm text-gray-500 mb-4">
            Your 9-digit TIN and 3 to 5 digit branch code. Please use '000' as
            your branch code if you don't have one (e.g. 999-999-000)
          </Text>

          {/* BIR CERTIFICATE */}
          <Text className="text-sm mb-2 text-gray-800">
            BIR Certificate of Registration{" "}
            <Text className="text-red-500 text-sm"></Text>
          </Text>

          {/* Upload Button */}
          <TouchableOpacity
            className="border border-dashed border-green-600 rounded-md p-4 flex-row justify-center items-center"
            onPress={() => setModalVisible2(true)}
          >
            <Ionicons name="camera" size={24} color="#00b251" />
            <Text className="mx-2 text-lg text-[#00b251]"> / </Text>
            <Ionicons name="image-outline" size={24} color="#00b251" className="ml-2" />
          </TouchableOpacity>

          {/* Display Selected Image */}
          {birCertificate && (
            <View className="relative mt-4 w-24 h-24">
              <Image
                source={{ uri: birCertificate }}
                className="w-full h-full rounded"
              />
              {/* Remove Image Button Positioned as X */}
              <TouchableOpacity
                className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 justify-center items-center"
                onPress={() => setBirCertificate(null)}
              >
                <Text className="text-white text-xs font-bold">X</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text className="text-sm text-gray-500 mb-4">
            Choose a file that is not more than 1 MB in size.
          </Text>
          <Text className="text-sm text-gray-500 mb-4">
            If Business Name/Trade is not applicable, please enter your Taxpayer
            Name as indicated on your BIR CoR instead (e.g Acme, Inc.)
          </Text>

          {/* Submit Button */}
          <TouchableOpacity
            className="w-full mt-8 p-4 bg-[#00B251] rounded-lg shadow-lg"
            onPress={() => {
              handleInputChange("shopName", shopName);
              handleInputChange("shopAddress", shopAddress);
              handleInputChange("shopDescription", shopDescription);
              handleInputChange("shopDeliveryFeeMin", shopDeliveryFeeMin);
              handleInputChange("shopDeliveryFeeMax", shopDeliveryFeeMax);
              handleInputChange("pickupAddress", pickupAddress);
              handleInputChange("pickupAreaFee", pickupAreaFee);
              validateField("shippingOption");
              validateField("paymentMethod");

              if (Object.values(errors).every((error) => !error)) {
                // Set custom alert message and make the modal visible for confirmation
                setAlertMessage2("Do you really want to update this profile?");
                setAlertVisible2(true);
              } else {
                // Set error alert message and make the modal visible
                setAlertMessage2("Please fix the errors before submitting.");
                setAlertVisible2(true);
              }
            }}
          >
            <Text className="text-center text-white font-bold text-lg">Submit</Text>
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


      <Modal visible={modalVisible2} transparent={true} animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg">
            <Text className="text-lg font-semibold mb-4">
              Select Image Source
            </Text>
            <TouchableOpacity
              className="mb-4 p-4 bg-[#00B251] rounded-lg"
              onPress={selectBirImageFromGallery}
            >
              <Text className="text-white text-center">
                Choose from Gallery
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="mb-4 p-4 bg-[#00B251] rounded-lg"
              onPress={selectBirImageFromCamera}
            >
              <Text className="text-white text-center">Take a Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="p-4 bg-red-500 rounded-lg"
              onPress={() => setModalVisible2(false)}
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={alertVisible3}
        onRequestClose={() => setAlertVisible3(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 bg-opacity-50">
          <View className="bg-white p-6 rounded-lg shadow-lg w-3/4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              {alertMessage3}
            </Text>
            <TouchableOpacity
              className="mt-4 p-2 bg-[#00B251] rounded-lg flex-row justify-center items-center"
              onPress={() => {
                setAlertVisible3(false);
                navigation.navigate("My Shop");
              }}
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

      {/* Alert Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={alertVisible2}
        onRequestClose={() => setAlertVisible2(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg shadow-lg w-3/4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              {alertMessage2}
            </Text>
            <View className="flex-row justify-around mt-4">
              {/* Cancel Button */}
              <TouchableOpacity
                className="p-2 bg-gray-300 rounded-lg flex-row justify-center items-center"
                onPress={() => setAlertVisible2(false)}
              >
                <Text className="text-lg text-gray-800 ml-3 mr-3 ">No</Text>
              </TouchableOpacity>

              {/* Confirm Button */}
              {alertMessage2 === "Do you really want to update this profile?" && (
                <TouchableOpacity
                  className="p-2 bg-[#00B251] rounded-lg flex-row justify-center items-center"
                  onPress={() => {
                    setAlertVisible2(false);
                    handleSubmit();  // Call handleSubmit if confirmed
                  }}
                >
                  <Text className="text-lg text-white ml-3 mr-3">Yes</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

export default ViewShopScreen;