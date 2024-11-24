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
  Alert
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

  const [categories, setCategories] = useState([]);
  const [isClickedCategory, setIsClickedCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    "Select Crop Category"
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const handleCategorySelect = (category) => {
    setSelectedCategory(category.crop_category_name);
    setSelectedCategoryId(category.crop_category_id);
    setIsClickedCategory(false);
    fetchSubCategories(category.crop_category_id);
  };

  const [subCategories, setSubCategories] = useState([]);
  const [isClickedSubCategory, setIsclickedSubCategory] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    "Select Crop Sub Category"
  );
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const handleSubCategorySelect = (subCategory) => {
    setSelectedSubCategory(subCategory.crop_sub_category_name);
    setSelectedSubCategoryId(subCategory.crop_sub_category_id);
    setIsclickedSubCategory(false);
  };

  // for category, subcategory, variety list

  const [categoryList, setCategoryList] = useState([])
  const [subCategoryList, setSubCategoryList] = useState([])
  const [varietyList, setVarietyList] = useState([])

  const API_KEY = REACT_NATIVE_API_KEY;
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

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
      setCropImage(result.assets[0].uri);
      setModalVisible(false);
    }
  };

  const removeImage = () => {
    setCropImage(null);
  };

  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_categories`, {
          headers: { "x-api-key": REACT_NATIVE_API_KEY },
        });
        if (response.ok) {
          const data = await response.json();
          const categories = data.map((user) => user.crop_category_name);
          setCategoryList(categories);
        } else {
          console.error("Failed to fetch phone numbers");
        }
      } catch (error) {
        console.error("Error fetching phone numbers:", error);
      }
    };

    fetchCategoryList();
  }, []);

  useEffect(() => {
    const fetchSubCategoryList = async () => {
      try {
        const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_sub_categories`, {
          headers: { "x-api-key": REACT_NATIVE_API_KEY },
        });
        if (response.ok) {
          const data = await response.json();
          const subCategories = data.map((user) => user.crop_sub_category_name);
          setSubCategoryList(categories);
        } else {
          console.error("Failed to fetch phone numbers");
        }
      } catch (error) {
        console.error("Error fetching phone numbers:", error);
      }
    };

    fetchSubCategoryList();
  }, []);

  useEffect(() => {
    const fetchVarietyList = async () => {
      try {
        const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_varieties`, {
          headers: { "x-api-key": REACT_NATIVE_API_KEY },
        });
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

  const handleAddCropCategory = async () => {
    if (categoryList && subCategoryList && varietyList && categoryList.includes(cropCategoryName) && subCategoryList.includes(cropSubCategoryName) && varietyList.includes(cropVarietyName)){
      Alert.alert("", "The category, subcategory, and variety names are already included in the app. \nPlease try again.")
    }
    if (categoryList && subCategoryList && categoryList.includes(cropCategoryName) && subCategoryList.includes(cropSubCategoryName)){
      Alert.alert("", "Both category and subcategory are already included in the app. \nPlease try again.")
    }
    if (subCategoryList && varietyList && subCategoryList.includes(cropSubCategoryName) && varietyList.includes(cropVarietyName)){
      Alert.alert("", "Both subcategory and variety names are already included in the app. \nPlease try again.")
    }

    if (categoryList && varietyList && categoryList.includes(cropCategoryName) && varietyList.includes(cropVarietyName)){
      Alert.alert("", "Both category and variety names are already included in the app. \nPlease try again.")
    }

    if (categoryList && categoryList.includes(cropCategoryName)){
      Alert.alert("", "The category name is already included in the app. \nPlease try again.")
    }

    if (subCategoryList && subCategoryList.includes(cropSubCategoryName)) {
      Alert.alert("", "The subcategory name is already included in the app. \nPlease try again.")
    }

    if (varietyList && varietyList.includes(cropVarietyName)) {
      Alert.alert("", "The variety name is already included in the app. \nPlease try again.")
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
    formData.append("crop_sub_category_name", cropSubCategoryName)
    if (cropImage) {
      formData.append("subImage", {
        uri: cropImage,
        name: "subcategory_image.jpg",
        type: "image/jpeg",
      });
    }
    formData.append("crop_variety_name", cropVarietyName)
    formData.append("crop_variety_description", cropVarietyDescription)
    formData.append("crop_sub_category_id", selectedSubCategoryId)
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
        navigation.navigate("Add Product");
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

  console.log("selectedCategoryId: ", selectedCategoryId);
console.log("selectedSubCategoryId: ", selectedSubCategoryId);

  return (
    <SafeAreaView className="bg-gray-100 flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="p-4">
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              Crop Category Name
            </Text>
            <TextInput
              className="w-full p-2  bg-white rounded-lg shadow-md"
              placeholder="Vegetable"
              value={cropCategoryName}
              onChangeText={setCropCategoryName}
              multiline
            />
          </View>
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              Crop Category Description
            </Text>
            <TextInput
              className="w-full p-2  bg-white rounded-lg shadow-md"
              placeholder="Describe the crop you want to sell."
              value={cropCategoryDescription}
              onChangeText={setCropCategoryDescription}
              multiline
            />
          </View>
          <View className="mb-4">
              <Text className="text-sm mb-2 text-gray-800">
                Crop Sub Category Name
              </Text>
              <TextInput
                className="w-full p-2  bg-white rounded-lg shadow-md"
                placeholder="Potato"
                value={cropSubCategoryName}
                onChangeText={setCropSubCategoryName}
                multiline
              />
            </View>
            <View className="mb-4">
              <Text className="text-sm mb-2 text-gray-800">
                Crop Sub Category Description
              </Text>
              <TextInput
                className="w-full p-2  bg-white rounded-lg shadow-md"
                placeholder="Describe the crop you want to sell."
                value={cropSubCategoryDescription}
                onChangeText={setCropSubCategoryDescription}
                multiline
              />
            </View>
            {/* Category Selector */}
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">Crop Category</Text>
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
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              Crop Variety Name
            </Text>
            <TextInput
              className="w-full p-2  bg-white rounded-lg shadow-md"
              placeholder="Purple Potato"
              value={cropVarietyName}
              onChangeText={setCropVarietyName}
              multiline
            />
          </View>
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              Crop Variety Description
            </Text>
            <TextInput
              className="w-full p-2  bg-white rounded-lg shadow-md"
              placeholder="Describe the crop you want to sell."
              value={cropVarietyDescription}
              onChangeText={setCropVarietyDescription}
              multiline
            />
          </View>
           {/* Sub-Category Selector */}
           <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">Sub-Category</Text>
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
                {subCategories.map((subCategory) => (
                  <TouchableOpacity
                    key={subCategory.crop_sub_category_id}
                    className="p-2"
                    onPress={() => handleSubCategorySelect(subCategory)}
                  >
                    <Text className="text-base">
                      {subCategory.crop_sub_category_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              Crop Category Image
            </Text>
            <TouchableOpacity
              className="border border-dashed border-green-600 rounded-md p-4  flex-row justify-center items-center "
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="camera" size={24} color="#00b251" />
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
            <View className="flex-1 justify-center items-center bg-black/50 ">
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
