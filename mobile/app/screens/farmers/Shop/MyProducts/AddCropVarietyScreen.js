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

function AddCropVarietyScreen({ navigation, route }) {
  const [cropVarietyName, setCropVarietyName] = useState("");
  const [cropVarietyDescription, setCropVarietyDescription] = useState("");
  const [cropImage, setCropImage] = useState(null);
  const API_KEY = REACT_NATIVE_API_KEY;
  const [loading, setLoading] = useState(false);

  const [varietyList, setVarietyList] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [categories, setCategories] = useState([]);
  const [isClickedCategory, setIsClickedCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    route.params?.selectedCategory || "Select Crop Category"
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    route.params?.selectedCategoryId || null
  );
  const handleCategorySelect = (category) => {
    setSelectedCategory(category.crop_category_name);
    setSelectedCategoryId(category.crop_category_id);
    setIsClickedCategory(false);
    fetchSubCategories(category.crop_category_id);

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedCategory;
      return updatedErrors;
    });
  };

  const [subCategories, setSubCategories] = useState([]);
  const [isClickedSubCategory, setIsclickedSubCategory] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    route.params?.selectedSubCategory || "Select Crop Sub Category"
  );

  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(
    route.params?.selectedSubCategoryId || null
  );
  const handleSubCategorySelect = (subCategory) => {
    setSelectedSubCategory(subCategory.crop_sub_category_name);
    setSelectedSubCategoryId(subCategory.crop_sub_category_id);
    setIsclickedSubCategory(false);

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedSubCategory;
      return updatedErrors;
    });
  };
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
    if (!cropVarietyName.trim())
      validationErrors.cropVarietyName = "Variety Name is required.";
    if (!cropVarietyDescription.trim())
      validationErrors.cropVarietyDescription = "Description is required.";
    if (!cropImage) validationErrors.cropImage = "Image is required.";
    if (selectedCategory === "Select Crop Category")
      validationErrors.selectedCategory = "Please select a category.";
    if (selectedSubCategory === "Select Crop Sub Category")
      validationErrors.selectedSubCategory = "Please select a subcategory.";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0; // Return true if no errors
  };

  const handleFieldChange = (field, value) => {
    switch (field) {
      case "cropVarietyName":
        setCropVarietyName(value);
        break;
      case "cropVarietyDescription":
        setCropVarietyDescription(value);
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
          console.error("Failed to fetch phone numbers");
        }
      } catch (error) {
        console.error("Error fetching phone numbers:", error);
      }
    };

    fetchVarietyList();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/crop_categories`,
        {
          headers: {
            "x-api-key": API_KEY,
          },
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      setAlertMessage(`Error fetching crop categories: ${error.message}`);
      setAlertVisible(true);
    }
  };

  const fetchSubCategories = async (categoryId) => {
    try {
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/crop_sub_categories`,
        {
          headers: {
            "x-api-key": API_KEY,
          },
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      const filteredData = data.filter(
        (subCategory) => subCategory.crop_category_id === categoryId
      );
      setSubCategories(filteredData);
    } catch (error) {
      setAlertMessage(`Error fetching crop subcategories: ${error.message}`);
      setAlertVisible(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [])
  );

  const handleAddCropVariety = async () => {
    // Validate fields first
    if (!validateFields()) {
      return;
    }

    // Add validation for category and subcategory selection
    if (!selectedCategoryId || !selectedSubCategoryId) {
      console.log("Selected Category ID:", selectedCategoryId);
      console.log("Selected SubCategory ID:", selectedSubCategoryId);
      setAlertMessage("Please ensure both category and subcategory are selected.");
      setAlertVisible(true);
      return;
    }

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append("crop_variety_name", cropVarietyName);
      formData.append("crop_variety_description", cropVarietyDescription);
      formData.append("crop_category_id", selectedCategoryId.toString());
      formData.append("crop_sub_category_id", selectedSubCategoryId.toString());

      if (cropImage) {
        formData.append("varietyImage", {
          uri: cropImage,
          name: "variety_image.jpg",
          type: "image/jpeg",
        });
      }

      console.log("Sending data:", {
        crop_variety_name: cropVarietyName,
        crop_variety_description: cropVarietyDescription,
        crop_category_id: selectedCategoryId,
        crop_sub_category_id: selectedSubCategoryId,
      });

      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/crop_varieties_app`,
        {
          method: "POST",
          headers: {
            "x-api-key": API_KEY,
          },
          body: formData,
        }
      );

      const responseText = await response.text();
      console.log("Response Text:", responseText);

      if (response.ok) {
        const responseData = JSON.parse(responseText);
        console.log("Response data:", responseData);

        const newVariety = {
          crop_variety_id: responseData.varietyId,
          crop_variety_name: cropVarietyName,
          crop_sub_category_id: selectedSubCategoryId,
          crop_category_id: selectedCategoryId,
        };

        // Navigate back with the new variety data
        navigation.navigate("Add Product", {
          selectedCategory: selectedCategory,
          selectedCategoryId: selectedCategoryId,
          selectedSubCategory: selectedSubCategory,
          selectedSubCategoryId: selectedSubCategoryId,
          newVariety: newVariety
        });

        setAlertMessage("Crop variety added successfully!");
        setAlertVisible(true);
      } else {
        console.error("Error adding crop variety:", responseText);
        setAlertMessage("Failed to add crop variety. Please try again.");
        setAlertVisible(true);
      }
    } catch (error) {
      console.error("Error adding crop variety:", error);
      setAlertMessage(
        `An error occurred while adding the crop variety: ${error.message}`
      );
      setAlertVisible(true);
    }
  };

  // Add this useEffect to handle incoming category and subcategory data
  useEffect(() => {
    if (route.params?.selectedCategory && route.params?.selectedCategoryId) {
      setSelectedCategory(route.params.selectedCategory);
      setSelectedCategoryId(route.params.selectedCategoryId);
    }

    if (route.params?.selectedSubCategory && route.params?.selectedSubCategoryId) {
      setSelectedSubCategory(route.params.selectedSubCategory);
      setSelectedSubCategoryId(route.params.selectedSubCategoryId);
    }
  }, [route.params]);

  return (
    <SafeAreaView className="bg-gray-100 flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="p-4">
          {/* Category Selector */}
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              Select a Category for the Variety
              {cropVarietyName && ` ${cropVarietyName}`}{" "}
              <Text className="text-red-500">*</Text>
              {errors.selectedCategory && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.selectedCategory}
                </Text>
              )}
            </Text>
            <TouchableOpacity
              className="flex-row items-center w-full p-2 bg-white rounded-lg shadow-md"
              onPress={() => setIsClickedCategory(!isClickedCategory)}
            >
              <Text className="text-base text-gray-700 flex-1">
                {selectedCategory}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color="gray"
                className="ml-2"
              />
            </TouchableOpacity>
            {isClickedCategory && (
              <View className="w-full p-2 mb-4 bg-white rounded-lg shadow-md">
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.crop_category_id}
                    className="p-2"
                    onPress={() => handleCategorySelect(category)}
                  >
                    <Text className="text-base">
                      {category.crop_category_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Sub-Category Selector */}
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              Select a Sub-Category for the Variety{" "}
              {cropVarietyName && ` ${cropVarietyName}`}{" "}
              <Text className="text-red-500">*</Text>
              {errors.selectedSubCategory && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.selectedSubCategory}
                </Text>
              )}
            </Text>
            <TouchableOpacity
              className="flex-row items-center w-full p-2 bg-white rounded-lg shadow-md"
              onPress={() => setIsclickedSubCategory(!isClickedSubCategory)}
            >
              <Text className="text-base text-gray-700 flex-1">
                {selectedSubCategory}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color="gray"
                className="ml-2"
              />
            </TouchableOpacity>
            {isClickedSubCategory && (
              <View className="w-full p-2 mb-4 bg-white rounded-lg shadow-md">
                {selectedCategoryId ? (
                  subCategories.map((subCategory) => (
                    <TouchableOpacity
                      key={subCategory.crop_sub_category_id}
                      className="p-2"
                      onPress={() => handleSubCategorySelect(subCategory)}
                    >
                      <Text className="text-base">
                        {subCategory.crop_sub_category_name}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text className="text-base text-red-600">
                    Select a crop category first
                  </Text>
                )}
              </View>
            )}
          </View>

          {/* New Variety Input */}
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              New Variety <Text className="text-red-500">*</Text>
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

          {/* Description */}
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              Type a Description of the Variety
              {cropVarietyName && ` ${cropVarietyName}`}{" "}
              <Text className="text-red-500">*</Text>
              {errors.cropVarietyDescription && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.cropVarietyDescription}
                </Text>
              )}
            </Text>
            <TextInput
              className="w-full p-2  bg-white rounded-lg shadow-md"
              placeholder="Describe the crop you want to sell."
              value={cropVarietyDescription}
              onChangeText={(value) =>
                handleFieldChange("cropVarietyDescription", value)
              }
              multiline
            />
          </View>



          {/* Image Selection */}
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              Select an image for the Variety
              {cropVarietyName && ` ${cropVarietyName}`}{" "}
              <Text className="text-red-500">*</Text>
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
              <Ionicons
                name="image-outline"
                size={24}
                color="#00b251"
                className="ml-2"
              />
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
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
          >
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
            <Text className="text-white text-base">Add Crop Variety</Text>
          </TouchableOpacity>

          <Modal
            transparent={true}
            visible={modalVisible1}
            animationType="slide"
            onRequestClose={() => setModalVisible1(false)}
          >
            <View className="flex-1 justify-center items-center bg-black/50">
              <View className="w-4/5 bg-white p-6 rounded-lg">
                <Text className="text-lg font-semibold text-gray-800 mb-4">
                  Confirm Add Crop Variety
                </Text>
                <Text className="text-gray-600 mb-6">
                  Do you really want to add this crop variety?
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
                      handleAddCropVariety();
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

export default AddCropVarietyScreen;
