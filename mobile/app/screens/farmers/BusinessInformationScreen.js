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
import { Ionicons } from "@expo/vector-icons";
import { Icon } from "react-native-elements";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from '@env';

function BusinessInformationScreen({ navigation, route }) {
  const { userData, shopName } = route.params;

  const [birCertificate, setBirCertificate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBusinessInformation, setSelectedBusinessInformation] =
    useState("");
  const [tin, setTin] = useState("");
  const [registeredAddress, setRegisteredAddress] = useState(""); // Text input for Registered Address
  const [errors, setErrors] = useState({
    businessInformation: "",
    tin: "",
    birCertificate: "",
    registeredAddress: "",
  });
  const [attemptedSubmit, setAttemptedSubmit] = useState(false); // Track whether the user has attempted to submit

  // Validation logic for the form
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validate Business Information selection
    if (!selectedBusinessInformation) {
      newErrors.businessInformation = "Business Information option is required.";
      isValid = false;
    } else {
      newErrors.businessInformation = "";
    }

    if (selectedBusinessInformation === "now") {
      const tinRegex = /^[0-9]{3}-?[0-9]{3}-?[0-9]{3}$/;
      if (!tin) {
        newErrors.tin = "TIN is required";
        isValid = false;
      } else if (!tinRegex.test(tin)) {
        newErrors.tin = "TIN must be 9 digits (e.g., 123456789 or 123-456-789)";
        isValid = false;
      } else {
        newErrors.tin = "";
      }

      if (!registeredAddress) {
        newErrors.registeredAddress = "Registered Address is required.";
        isValid = false;
      } else {
        newErrors.registeredAddress = "";
      }

      if (!birCertificate) {
        newErrors.birCertificate = "BIR Certificate of Registration is required.";
        isValid = false;
      } else {
        newErrors.birCertificate = "";
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Real-time validation handler for each field
  useEffect(() => {
    validateForm();
  }, [selectedBusinessInformation, tin, registeredAddress, birCertificate]);

  // Selecting image from the gallery or taking a photo
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
      setBirCertificate({ uri: result.assets[0].uri });
      setModalVisible(false);
    }
  };

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
      setBirCertificate({ uri: result.assets[0].uri });
      setModalVisible(false);
    }
  };

  // Submit business information form logic
  const handleSubmit = async () => {
    setAttemptedSubmit(true); // Trigger error display on submit attempt

    // Ensure form is only submitted on "Submit Later" and all fields are filled
    if (selectedBusinessInformation !== "later") {
      Alert.alert("Sorry", "You must select 'Submit Later' or 'Submit now' to create the shop.");
      return;
    }

    if (!validateForm()) {
      Alert.alert("Sorry", "Please fill in all required fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("shop_name", shopName);
      formData.append("shop_description", "Shop Desc");
      formData.append("longitude", 120.59337385538859);
      formData.append("latitude", 16.41197917848812);
      formData.append("user_id", userData.user_id);
      formData.append("tin", tin);
      formData.append("registered_address", registeredAddress); // Registered address added
      // formData.append("bir_certificate", {
      //   uri: birCertificate.uri,
      //   name: "bir_certificate.jpg",
      //   type: "image/jpeg",
      // });

      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/shops`, {
        method: "POST",
        body: formData,
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Shop created successfully!");
        await AsyncStorage.setItem("shopData", JSON.stringify(formData));

        // Prevent going back to BusinessInformationScreen
        navigation.reset({
          index: 0,
          routes: [{ name: "My Shop" }],
        });
      } else {
        Alert.alert("Error", data.message || "Failed to create shop");
      }
    } catch (error) {
      console.error("An error occurred while creating the shop:", error);
      Alert.alert("Error", "An error occurred while creating the shop");
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

        {/* Registered Address */}
        <Text className="text-lg font-semibold text-green-600">
          Registered Address <Text className="text-red-500 text-sm">*</Text> {attemptedSubmit && errors.registeredAddress && (
            <Text className="text-sm w-4/5 text-red-500 mb-4">{errors.registeredAddress}</Text>
          )}
        </Text>
        <TextInput
          className="w-full p-2 mb-4 mt-3 bg-white rounded-lg shadow-md text-gray-800"
          placeholder="Enter your registered address"
          value={registeredAddress}
          onChangeText={setRegisteredAddress}
        />

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
          your branch code if you don't have one (e.g. 999-999-999-000)
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
          <Text className="text-green-600">+ Upload (0/1)</Text>
        </TouchableOpacity>

        {birCertificate && (
          <Image source={{ uri: birCertificate.uri }} className="w-24 h-24 mb-4" />
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
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-md p-4">
            <Text className="text-lg font-semibold text-center mb-4">
              Upload Image
            </Text>
            <TouchableOpacity
              className="bg-green-600 p-4 rounded-md mb-4"
              onPress={takePicture}
            >
              <Text className="text-white text-center">Take a Picture</Text>
            </TouchableOpacity>
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
    </SafeAreaView>
  );
}

export default BusinessInformationScreen;
