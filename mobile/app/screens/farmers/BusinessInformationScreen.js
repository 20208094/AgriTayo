import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Alert,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

function BusinessInformationScreen({ navigation, route }) {
  const { userData, shopData } = route.params;

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [selectedBusinessInformation, setSelectedBusinessInformation] = useState("");
  const [tin, setTin] = useState("");
  const [birCertificate, setBirCertificate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [errors, setErrors] = useState({
    businessInformation: "",
    tin: "",
    birCertificate: "",
  });
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!selectedBusinessInformation) {
      newErrors.businessInformation = "Please select 'Submit Later' or 'Submit Now'.";
      isValid = false;
    } else {
      newErrors.businessInformation = "";
    }

    if (selectedBusinessInformation === "now") {
      if (!tin) {
        newErrors.tin = "TIN is required";
        isValid = false;
      } else if (!/^[0-9]{3}-?[0-9]{3}-?[0-9]{3}$/.test(tin)) {
        newErrors.tin = "TIN must be in the format 123-456-789";
        isValid = false;
      } else {
        newErrors.tin = "";
      }

      if (!birCertificate) {
        newErrors.birCertificate = "BIR Certificate image is required.";
        isValid = false;
      } else {
        newErrors.birCertificate = "";
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    validateForm();
  }, [selectedBusinessInformation, tin, birCertificate]);

  // Image Picker Handlers
  const selectImageFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      setAlertMessage("Permission Required", "Permission to access the gallery is required.");
      setAlertVisible(true);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });


    if (!result.canceled) {
      setBirCertificate(result.assets[0].uri);
      setModalVisible(false);
    }
  };


  const handleSubmit = async () => {
    setAttemptedSubmit(true);
  
    if (!validateForm()) {
      setAlertMessage("Error", "Please complete all required fields.");
      setAlertVisible(true);
      return;
    }
  
    try {
      const formData = new FormData();
      
      formData.append("shop_name", shopData.shop_name);
      formData.append("shop_description", shopData.shop_description);
      formData.append("shop_address", shopData.shop_address);
      formData.append("shop_number", shopData.shop_number);
  
      formData.append("delivery", shopData.delivery);
      formData.append("delivery_price", shopData.delivery ? shopData.delivery_price : null);
      formData.append("pickup", shopData.pickup);
      formData.append("pickup_price", shopData.pickup ? shopData.pickup_price : null);
      formData.append("gcash", shopData.gcash);
      formData.append("cod", shopData.cod);
      formData.append("bank", shopData.bank);
  
      formData.append("user_id", userData.user_id);
      formData.append("submit_later", selectedBusinessInformation === "later" ? 1 : 0);
      console.log(shopData.shop_image);
      
      if (shopData.shop_image) {
        formData.append('shop_image', {
          uri: shopData.shop_image,
          name: 'profile.jpg',
          type: 'image/jpeg',
        });
      }
  
      if (selectedBusinessInformation === "now") {
        formData.append("tin_number", tin);
  
        if (birCertificate) {
          formData.append('bir_image', {
            uri: birCertificate,
            name: 'profile.jpg',
            type: 'image/jpeg',
          });
        }

      }
  
      // Log the formData to verify it's correctly populated
      console.log("FormData before submission:", formData);
  
      // Make the API request
      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/shops`, {
        method: "POST",
        body: formData,
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });
  
      const data = await response.json();
      if (response.ok) {
        const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/shops`, {
          headers: {
            'x-api-key': REACT_NATIVE_API_KEY,
          },
        });
  
        const shops = await response.json();
        // get user data of the logged in user
        const filteredShops = shops.filter(shop => shop.user_id === userData.user_id);
        // save user data to assync storage userData
        try {
          await AsyncStorage.setItem('shopData', JSON.stringify(filteredShops));
        } catch (error) {
          console.error('Error saving shopData:', error);
        }
        setAlertMessage("Success, Shop created successfully!");
        setAlertVisible(true);
        navigation.pop(3)
      } else {
        setAlertMessage("Error, Failed to create shop");
        setAlertVisible(true);
      }
    } catch (error) {
      console.error("Error while creating shop:", error);
      setAlertMessage("Error, Failed to create shop. Please try again.");
      setAlertVisible(true);
    }
  };
  

  
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["bottom", "left", "right"]}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="flex-row justify-between items-center">
          <View className="flex-1 border-b-2 border-gray-300 pb-2">
            <Text className="text-center text-gray-400">Shop Information</Text>
          </View>
          <View className="flex-1 border-b-2 border-green-600 pb-2">
            <Text className="text-center text-green-600">Business Information</Text>
          </View>
        </View>

        <Text className="text-2xl font-semibold text-green-600 text-center mt-4">
          Business Information
        </Text>
        <Text className="text-sm text-center text-gray-500 my-4">
          The information will be used to ensure proper compliance to seller
          onboarding requirements to e-marketplace and invoicing purposes.
          (Note: We will not re-issue any invoices or tax documents due to
          incomplete or incorrect information provided by sellers.)
        </Text>

        <View className="mt-4">
          <Text className="text-lg font-semibold text-green-600 mb-2">
            Submit Business Information? <Text className="text-red-500 text-sm">*</Text> {attemptedSubmit && errors.businessInformation && (
              <Text className="text-sm w-4/5 text-red-500 mb-4">{errors.businessInformation}</Text>
            )}
          </Text>
          {["now", "later"].map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => setSelectedBusinessInformation(option)}
              className="flex-row items-center mb-2"
            >
              <View
                className={`w-6 h-6 rounded-full border-2 ${selectedBusinessInformation === option
                  ? "border-green-600"
                  : "border-gray-400"
                  } justify-center items-center`}
              >
                {selectedBusinessInformation === option && (
                  <FontAwesome name="check-circle" size={20} color="#00B251" />
                )}
              </View>
              <Text className="ml-2 text-black">
                {option === "now" ? "Submit Now" : "Submit Later"}
              </Text>
            </TouchableOpacity>
          ))}

          <Text className="text-sm text-gray-500 mb-4">
            You may choose to submit your Business Information some other time if
            you're not yet ready. However, you will not be allowed to start
            selling on our platform until you do so.
          </Text>
        </View>

        <Text className="text-lg font-semibold text-green-600">
          Taxpayer Identification Number (TIN) <Text className="text-red-500 text-sm">*</Text> {attemptedSubmit && errors.tin && (
            <Text className="text-sm w-4/5 text-red-500 mb-4">{errors.tin}</Text>
          )}

        </Text>
        <TextInput
          className="w-full p-2 mb-4 mt-3 bg-white rounded-lg shadow-md text-gray-800"
          keyboardType="numeric"
          placeholder="TIN"
          value={tin}
          onChangeText={setTin}
        />

        <Text className="text-sm text-gray-500 mb-4">
          Your 9-digit TIN and 3 to 5 digit branch code. Please use '000' as
          your branch code if you don't have one (e.g. 999-999-000)
        </Text>


        <Text className="text-lg font-semibold text-green-600">
          BIR Certificate of Registration <Text className="text-red-500 text-sm">* {attemptedSubmit && errors.birCertificate && (
            <Text className="text-sm w-4/5 text-red-500 mb-4">{errors.birCertificate}</Text>
          )}
          </Text>
        </Text>
        <TouchableOpacity
          className="border border-dashed border-green-600 rounded-md p-4 my-4 flex-row justify-center items-center"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-green-600">+ Upload</Text>
        </TouchableOpacity>

        {birCertificate && (
          <Image source={{ uri: birCertificate }} className="w-24 h-24 mb-4" />
        )}

        <Text className="text-sm text-gray-500 mb-4">
          Choose a file that is not more than 1 MB in size.
        </Text>
        <Text className="text-sm text-gray-500 mb-4">
          If Business Name/Trade is not applicable, please enter your Taxpayer
          Name as indicated on your BIR CoR instead (e.g Acme, Inc.)
        </Text>

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
            <Text className="text-white text-lg font-semibold">Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-md p-4">
            <Text className="text-lg font-semibold text-center mb-4">
              Upload Image
            </Text>
            <TouchableOpacity
              className="bg-green-600 p-4 rounded-md mb-4"
              onPress={selectImageFromGallery}
            >
              <Text className="text-white text-center">Select from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-gray-400 p-4 rounded-md"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-black text-center">Cancel</Text>
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

export default BusinessInformationScreen;
