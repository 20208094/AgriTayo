import React, { useState, useCallback, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "react-native-vector-icons/Ionicons";

function AddCropCategoryScreen({ navigation }) {
  const [cropCategoryName, setCropCategoryName] = useState("");
  const [cropCategoryDescription, setCropCategoryDescription] = useState("");
  const [cropImage, setCropImage] = useState(null);

  // for sub category
  const [cropSubCategoryName, setCropSubCategoryName] = useState("");
  const [cropSubCategoryDescription, setCropSubCategoryDescription] =
    useState("");

  // for variety
  const [cropVarietyName, setCropVarietyName] = useState("");
  const [cropVarietyDescription, setCropVarietyDescription] = useState("");

  // for category, subcategory, variety list

  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [varietyList, setVarietyList] = useState([]);

  const API_KEY = REACT_NATIVE_API_KEY;
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [errors, setErrors] = useState({});

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
      const isValidSize = await validateImageSize(result.assets[0].uri);
      if (isValidSize) {
        setCropImage(result.assets[0].uri);
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
      const isValidSize = await validateImageSize(result.assets[0].uri);
      if (isValidSize) {
        setCropImage(result.assets[0].uri);
        setModalVisible(false);
      }
    }
  };

  const removeImage = () => {
    setCropImage(null);
  };

  const validateFields = () => {
    let validationErrors = {};
    if (!cropCategoryName.trim())
      validationErrors.cropCategoryName = "Crop Category Name is required.";
    if (!cropSubCategoryName.trim())
      validationErrors.cropSubCategoryName =
        "Crop Sub Category Name is required.";
    if (!cropVarietyName.trim())
      validationErrors.cropVarietyName = "Crop Variety Name is required.";
    if (!cropCategoryDescription.trim())
      validationErrors.cropCategoryDescription =
        "Crop Category Description is required.";
    if (!cropImage)
      validationErrors.cropImage = "Crop Category Image is required.";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0; // Return true if no errors
  };

  const handleFieldChange = (field, value) => {
    switch (field) {
      case "cropCategoryName":
        setCropCategoryName(value);
        break;
      case "cropSubCategoryName":
        setCropSubCategoryName(value);
        break;
      case "cropVarietyName":
        setCropVarietyName(value);
        break;
      case "cropCategoryDescription":
        setCropCategoryDescription(value);
        break;
      default:
        break;
    }

    // Clear error for the specific field if it's valid
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (value.trim()) delete updatedErrors[field];
      return updatedErrors;
    });
  };


  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        const response = await fetch(
          `${REACT_NATIVE_API_BASE_URL}/api/crop_categories`,
          {
            headers: { "x-api-key": REACT_NATIVE_API_KEY },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const categories = data.map((user) => user.crop_category_name);
          setCategoryList(categories);
        } else {
          console.error("Failed to fetch crop categories");
        }
      } catch (error) {
        console.error("Error fetching crop categories:", error);
      }
    };

    fetchCategoryList();
  }, []);

  useEffect(() => {
    const fetchSubCategoryList = async () => {
      try {
        const response = await fetch(
          `${REACT_NATIVE_API_BASE_URL}/api/crop_sub_categories`,
          {
            headers: { "x-api-key": REACT_NATIVE_API_KEY },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const subCategories = data.map((user) => user.crop_sub_category_name);
          setSubCategoryList(subCategories);
        } else {
          console.error("Failed to fetch crop sub categories");
        }
      } catch (error) {
        console.error("Error fetching crop sub categories:", error);
      }
    };

    fetchSubCategoryList();
  }, []);

  useEffect(() => {
    const fetchVarietyList = async () => {
      try {
        const response = await fetch(
          `${REACT_NATIVE_API_BASE_URL}/api/crop_varieties`,
          {
            headers: { "x-api-key": REACT_NATIVE_API_KEY },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const varieties = data.map((user) => user.crop_variety_name);
          setVarietyList(varieties);
        } else {
          console.error("Failed to fetch crop varieties");
        }
      } catch (error) {
        console.error("Error fetching crop varieties:", error);
      }
    };

    fetchVarietyList();
  }, []);

  const handleAddCropCategory = async () => {
    if (!validateFields()) return;
    if (
      categoryList &&
      subCategoryList &&
      varietyList &&
      categoryList.includes(cropCategoryName) &&
      subCategoryList.includes(cropSubCategoryName) &&
      varietyList.includes(cropVarietyName)
    ) {
      setAlertMessage(
        "The category, subcategory, and variety names are already included in the app. Please try again."
      );
      setAlertVisible(true);
      return;
    }
    if (
      categoryList &&
      subCategoryList &&
      categoryList.includes(cropCategoryName) &&
      subCategoryList.includes(cropSubCategoryName)
    ) {
      setAlertMessage(
        "Both category and subcategory are already included in the app. Please try again."
      );
      setAlertVisible(true);
      return;
    }
    if (
      subCategoryList &&
      varietyList &&
      subCategoryList.includes(cropSubCategoryName) &&
      varietyList.includes(cropVarietyName)
    ) {
      setAlertMessage(
        "Both subcategory and variety names are already included in the app. Please try again."
      );
      setAlertVisible(true);
      return;
    }

    if (
      categoryList &&
      varietyList &&
      categoryList.includes(cropCategoryName) &&
      varietyList.includes(cropVarietyName)
    ) {
      setAlertMessage(
        "Both category and variety names are already included in the app. Please try again."
      );
      setAlertVisible(true);
      return;
    }

    if (categoryList && categoryList.includes(cropCategoryName)) {
      setAlertMessage(
        "The category name is already included in the app. Please try again."
      );
      setAlertVisible(true);
      return;
    }

    if (subCategoryList && subCategoryList.includes(cropSubCategoryName)) {
      setAlertMessage(
        "The subcategory name is already included in the app. Please try again."
      );
      setAlertVisible(true);
      return;
    }

    if (varietyList && varietyList.includes(cropVarietyName)) {
      setAlertMessage(
        "The variety name is already included in the app. Please try again."
      );
      setAlertVisible(true);
      return;
    }
    const formData = new FormData();
    formData.append("crop_category_name", cropCategoryName);
    formData.append("crop_category_description", cropCategoryDescription);
    if (cropImage) {
      formData.append("image", {
        uri: cropImage,
        name: "category_image.jpg",
        type: "image/jpeg",
      });
    }
    formData.append("crop_sub_category_name", cropSubCategoryName);
    formData.append("crop_sub_category_description", cropCategoryDescription);
    if (cropImage) {
      formData.append("subImage", {
        uri: cropImage,
        name: "subcategory_image.jpg",
        type: "image/jpeg",
      });
    }
    formData.append("crop_variety_name", cropVarietyName);
    formData.append("crop_variety_description", cropCategoryDescription);
    if (cropImage) {
      formData.append("varImage", {
        uri: cropImage,
        name: "variety_image.jpg",
        type: "image/jpeg",
      });
    }
    try {
      setLoading(true);
      console.log("Submitting crop category data: ", formData);

      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/crop_categories_app`,
        {
          method: "POST",
          headers: {
            "x-api-key": API_KEY,
          },
          body: formData,
        }
      );

      const responseText = await response.text();
      console.log("Response Text: ", responseText);

      if (response.ok) {
        const responseData = JSON.parse(responseText);
        console.log("Response data: ", responseData);
        setAlertMessage("Crop category added successfully!");
        setAlertVisible(true);
        
        // Navigate back with the new data
        navigation.navigate("Add Product", {
          newCategory: {
            crop_category_id: responseData.categoryId, // Adjust based on your API response
            crop_category_name: cropCategoryName
          },
          newSubCategory: {
            crop_sub_category_id: responseData.subCategoryId,
            crop_sub_category_name: cropSubCategoryName,
            crop_category_id: responseData.categoryId
          },
          newVariety: {
            crop_variety_id: responseData.varietyId,
            crop_variety_name: cropVarietyName,
            crop_sub_category_id: responseData.subCategoryId,
            crop_category_id: responseData.categoryId
          }
        });
      } else {
        console.error("Error adding crop category: ", responseText);
        setAlertMessage("Failed to add crop category. Please try again.");
        setAlertVisible(true);
      }
    } catch (error) {
      setAlertMessage(
        `An error occurred while adding the crop category: ${error.message}`
      );
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-gray-100 flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="p-4">
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              New category <Text className="text-red-500 text-sm">*</Text>
              {errors.cropCategoryName && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.cropCategoryName}
                </Text>
              )}
            </Text>
            <TextInput
              className="w-full p-2  bg-white rounded-lg shadow-md"
              placeholder="Vegetable"
              value={cropCategoryName}
              onChangeText={(value) =>
                handleFieldChange("cropCategoryName", value)
              }
              multiline
            />
          </View>
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              Type a Subcategory of {cropCategoryName && ` ${cropCategoryName}`} <Text className="text-red-500 text-sm">*</Text>
              {errors.cropSubCategoryName && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.cropSubCategoryName}
                </Text>
              )}
            </Text>
            <TextInput
              className="w-full p-2  bg-white rounded-lg shadow-md"
              placeholder="Potato"
              value={cropSubCategoryName}
              onChangeText={(value) =>
                handleFieldChange("cropSubCategoryName", value)
              }
              multiline
            />
          </View>
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              Type a Variety of {cropSubCategoryName && ` ${cropSubCategoryName}`} <Text className="text-red-500 text-sm">*</Text>
              {errors.cropVarietyName && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.cropVarietyName}
                </Text>
              )}
            </Text>
            <TextInput
              className="w-full p-2  bg-white rounded-lg shadow-md"
              placeholder="Purple Potato"
              value={cropVarietyName}
              onChangeText={(value) =>
                handleFieldChange("cropVarietyName", value)
              }
              multiline
            />
          </View>
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              Type a Description of the Category{cropCategoryName && ` ${cropCategoryName}`} <Text className="text-red-500 text-sm">*</Text>
              {errors.cropCategoryDescription && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.cropCategoryDescription}
                </Text>
              )}
            </Text>
            <TextInput
              className="w-full p-2  bg-white rounded-lg shadow-md"
              placeholder="Describe the crop you want to sell."
              value={cropCategoryDescription}
              onChangeText={(value) =>
                handleFieldChange("cropCategoryDescription", value)
              }
              multiline
            />
          </View>
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              Select an Image for the Category {cropCategoryName && ` ${cropCategoryName}`} <Text className="text-red-500 text-sm">*</Text>
              {errors.cropImage && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.cropImage}
                </Text>
              )}
            </Text>
            <TouchableOpacity
              className="border border-dashed border-green-600 rounded-md p-4  flex-row justify-center items-center "
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="camera" size={24} color="#00b251" />
              <Text className="mx-2 text-lg text-[#00b251]"> / </Text>
              <Ionicons name="image-outline" size={24} color="#00b251" className="ml-2" />
            </TouchableOpacity>

            {cropImage && (
              <View className="mt-4">
                <Image
                  source={{ uri: cropImage }}
                  className="w-full h-64 rounded-lg"
                />
                <TouchableOpacity
                  className="mt-2 bg-red-500 p-2 rounded-lg"
                  onPress={removeImage}
                >
                  <Text className="text-white text-center">Remove Image</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Modal for Image Selection */}
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

          {/* Add Product Button */}
          <TouchableOpacity
            className="bg-[#00B251] p-4 rounded-lg flex items-center mt-4"
            onPress={() => setModalVisible1(true)}
          >
            <Text className="text-white text-base">Add Crop Category</Text>
          </TouchableOpacity>
          <Modal
            transparent={true}
            visible={modalVisible1}
            animationType="slide"
            onRequestClose={() => setModalVisible1(false)}
          >
            <View className="flex-1 justify-center items-center bg-[rgba(0,0,0,0.5)] bg-black/50">
              <View className="w-4/5 bg-white p-6 rounded-lg">
                <Text className="text-lg font-semibold text-gray-800 mb-4">
                  Confirm Add Crop Category
                </Text>
                <Text className="text-gray-600 mb-6">
                  Do you really want to add this crop category?
                </Text>
                <View className="flex-row justify-end space-x-4">
                  <TouchableOpacity
                    className="px-4 py-2 rounded-md bg-gray-200"
                    onPress={() => setModalVisible1(false)}
                  >
                    <Text className="text-gray-700 text-base">No</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="px-4 py-2 rounded-md bg-[#00B251]"
                    onPress={() => {
                      setModalVisible1(false);
                      handleAddCropCategory();
                    }}
                  >
                    <Text className="text-white text-base">Yes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default AddCropCategoryScreen;
