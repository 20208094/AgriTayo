import React, { useState, useCallback } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

function AddProductScreen({navigation}) {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [metricSystem, setMetricSystem] = useState([]);
  const [cropSizes, setCropSizes] = useState([]);
  const [cropVarieties, setCropVarieties] = useState([]);
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_KEY = REACT_NATIVE_API_KEY;

  const [cropName, setCropName] = useState("");
  const [cropDescription, setCropDescription] = useState("");
  const [cropPrice, setCropPrice] = useState("");
  const [cropQuantity, setCropQuantity] = useState("");
  const [availability, setAvailability] = useState("");
  const [availabilityMessage, setAvailabilityMessage] = useState(null);
  const [shopId, setShopId] = useState("");
  const [cropRating, setCropRating] = useState("");

  const [isClickedCategory, setIsClickedCategory] = useState(false);
  const [isClickedMetricSystem, setIsClickedMetricSystem] = useState(false);
  const [isClickedSubCategory, setIsclickedSubCategory] = useState(false);

  const [selectedMetricSystem, setSelectedMetricSystem] = useState("Select Crop Metric");
  const [selectedCategory, setSelectedCategory] = useState("Select Crop Category");
  const [selectedSubCategory, setSelectedSubCategory] =
    useState("Select Crop Sub Category");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [selectedMetricSystemId, setSelectedMetricSystemId] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [cropImage, setCropImage] = useState(null);

  const handleMetricSelect = (metric) => {
    setSelectedMetricSystem(metric.metric_system_name);
    setSelectedMetricSystemId(metric.metric_system_id);
    setIsClickedMetricSystem(false);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.crop_category_name);
    setSelectedCategoryId(category.crop_category_id);
    setIsClickedCategory(false);
    fetchSubCategories(category.crop_category_id);
  };

  const handleSubCategorySelect = (subCategory) => {
    setSelectedSubCategory(subCategory.crop_sub_category_name);
    setSelectedSubCategoryId(subCategory.crop_sub_category_id);
    setIsclickedSubCategory(false);
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
      setCropImage(result.assets[0].uri);
      setModalVisible(false);
    }
  };

  const removeImage = () => {
    setCropImage(null);
  };

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
      alert(`Error fetching crop categories: ${error.message}`);
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
      alert(`Error fetching crop subcategories: ${error.message}`);
    }
  };

  const getAsyncShopData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("shopData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const shop = Array.isArray(parsedData) ? parsedData[0] : parsedData;
        setShopData(shop);
      }
    } catch (error) {
      alert(`Failed to load shop data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetricSystem = async () => {
    try {
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/metric_systems`,
        {
          headers: {
            "x-api-key": API_KEY,
          },
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setMetricSystem(data);
    } catch (error) {
      alert(`Error fetching metric systems: ${error.message}`);
    }
  };

  // for crop size
  const [isClickedCropSize, setIsClickedCropSize] = useState(false);
  const [selectedCropSize, setSelectedCropSize] = useState(
    "Select Crop Size"
  );
  const [selectedCropSizeId, setSelectedCropSizeId] = useState(null);
  const handleCropSizeSelect = (cropSize) => {
    setSelectedCropSize(cropSize.crop_size_name);
    setSelectedCropSizeId(cropSize.crop_size_id);
    setIsClickedCropSize(false);
  };

  // fetching crop size
  const fetchCropSize = async () => {
    try {
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/crop_sizes`,
        {
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setCropSizes(data);
    } catch (error) {
      alert(`Error fetching crop categories: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // for crop variety
  const [isClickedCropVariety, setIsClickedCropVariety] = useState(false);
  const [selectedCropVariety, setSelectedCropVariety] = useState(
    "Select Crop Variety"
  );
  const [selectedCropVarietyId, setSelectedCropVarietyId] = useState(null);
  const handleCropVarietySelect = (cropVariety) => {
    setSelectedCropVariety(cropVariety.crop_variety_name);
    setSelectedCropVarietyId(cropVariety.crop_variety_id);
    setIsClickedCropVariety(false);
  };

  // fetching crop variety
  const fetchCropVariety = async () => {
    try {
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/crop_varieties`,
        {
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setCropVarieties(data);
    } catch (error) {
      alert(`Error fetching crop categories: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
      fetchCropSize();
      fetchCropVariety();
      fetchMetricSystem();
      getAsyncShopData();
    }, [])
  );

  const cropClasses = [
    {
      crop_class_id: 1,
      crop_class_name: "A",
    },
    {
      crop_class_id: 2,
      crop_class_name: "B",
    },
    {
      crop_class_id: 3,
      crop_class_name: "C",
    },
    {
      crop_class_id: 4,
      crop_class_name: "Mix",
    },
  ];

  // for crop size
  const [isClickedCropClass, setIsClickedCropClass] = useState(false);
  const [selectedCropClass, setSelectedCropClass] = useState(
    "Select Crop Size"
  );
  const handleCropClassSelect = (cropClass) => {
    setSelectedCropClass(cropClass.crop_class_name);
    setIsClickedCropClass(false);
  };


  const handleAddProduct = async () => {
    if (
      !cropDescription ||
      !cropPrice ||
      !cropQuantity ||
      !selectedCategoryId ||
      !selectedSubCategoryId ||
      !selectedMetricSystemId ||
      !selectedCropSizeId ||
      !selectedCropVarietyId ||
      !selectedCropClass ||
      !cropImage
    ) {
      alert("Please fill in all the required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("crop_name", selectedCropVariety);
    formData.append("crop_description", cropDescription);
    formData.append("crop_category_id", parseInt(selectedCategoryId));
    formData.append("sub_category_id", parseInt(selectedSubCategoryId));
    formData.append("shop_id", parseInt(shopData.shop_id));
    formData.append("crop_size_id", parseInt(selectedCropSizeId));
    formData.append("crop_variety_id", parseInt(selectedCropVarietyId));
    if (cropImage) {
      formData.append("image", {
        uri: cropImage,
        name: "shop.jpg",
        type: "image/jpeg",
      });
    }
    formData.append("crop_rating", parseFloat(cropRating || 0));
    formData.append("crop_price", parseFloat(cropPrice));
    formData.append("crop_quantity", parseInt(cropQuantity));
    formData.append("metric_system_id", selectedMetricSystemId);
    formData.append("crop_availability", "live");
    formData.append("crop_class", selectedCropClass);

    try {
      setLoading(true);
      console.log("Submitting product data: ", formData);

      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crops`, {
        method: "POST",
        headers: {
          "x-api-key": API_KEY,
        },
        body: formData,
      });

      const responseText = await response.text();
      console.log("Response Text: ", responseText);

      if (response.ok) {
        const responseData = JSON.parse(responseText);
        console.log("Response data: ", responseData);
        alert("Product added successfully!");
        navigation.navigate('My Products')
      } else {
        console.error("Error adding product: ", responseText);
        alert("Failed to add product. Please try again.");
      }
    } catch (error) {
      alert(`An error occurred while adding the product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="flex-1 p-4">
        <View className="bg-white p-4 rounded-lg shadow-md">
          {/* Variety Selector */}
          <View className="mb-4">
            <Text className="text-base text-gray-700">
              Crop Variety
            </Text>
            <TouchableOpacity
              className="flex-row items-center border border-gray-300 p-2 rounded-lg"
              onPress={() => setIsClickedCropVariety(!isClickedCropVariety)}
            >
              <Text className="text-base text-gray-700 flex-1">
                {selectedCropVariety}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color="gray"
                className="ml-2"
              />
            </TouchableOpacity>
            {isClickedCropVariety && (
              <View className="border border-gray-300 rounded-lg p-2 mt-1">
                {cropVarieties.map((cropVariety) => (
                  <TouchableOpacity
                    key={cropVariety.crop_variety_id}
                    className="p-2"
                    onPress={() => handleCropVarietySelect(cropVariety)}
                  >
                    <Text className="text-base">
                      {cropVariety.crop_variety_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Crop Description */}
          <View className="mb-4">
            <Text className="text-base text-gray-700">Crop Description</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-2 mt-1"
              placeholder="Describe the crop you want to sell."
              value={cropDescription}
              onChangeText={setCropDescription}
              multiline
                numberOfLines={3}
            />
          </View>

          {/* Category Selector */}
          <View className="mb-4">
            <Text className="text-base text-gray-700">
              Crop Category
            </Text>
            <TouchableOpacity
              className="flex-row items-center border border-gray-300 p-2 rounded-lg"
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
              <View className="border border-gray-300 rounded-lg p-2 mt-1">
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
            <Text className="text-base text-gray-700">Sub-Category</Text>
            <TouchableOpacity
              className="flex-row items-center border border-gray-300 p-2 rounded-lg"
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
              <View className="border border-gray-300 rounded-lg p-2 mt-1">
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

          {/* Crop SIze */}
          <View className="mb-4">
            <Text className="text-base text-gray-700">
              Crop Size
            </Text>
            <TouchableOpacity
              className="flex-row items-center border border-gray-300 p-2 rounded-lg"
              onPress={() => setIsClickedCropSize(!isClickedCropSize)}
            >
              <Text className="text-base text-gray-700 flex-1">
                {selectedCropSize}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color="gray"
                className="ml-2"
              />
            </TouchableOpacity>
            {isClickedCropSize && (
              <View className="border border-gray-300 rounded-lg p-2 mt-1">
                {cropSizes.map((cropSize) => (
                  <TouchableOpacity
                    key={cropSize.crop_size_id}
                    className="p-2"
                    onPress={() => handleCropSizeSelect(cropSize)}
                  >
                    <Text className="text-base">
                      {cropSize.crop_size_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Crop Price */}
          <View className="mb-4">
            <Text className="text-base text-gray-700">Crop Price</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-2 mt-1"
              keyboardType="numeric"
              placeholder="₱ 0.00"
              value={cropPrice}
              onChangeText={setCropPrice}
            />
          </View>

           {/* Metric System Selector */}
           <View className="mb-4">
            <Text className="text-base text-gray-700">Crop Metric</Text>
            <TouchableOpacity
              className="flex-row items-center border border-gray-300 p-2 rounded-lg"
              onPress={() => setIsClickedMetricSystem(!isClickedMetricSystem)}
            >
              <Text className="text-base text-gray-700 flex-1">
                {selectedMetricSystem}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color="gray"
                className="ml-2"
              />
            </TouchableOpacity>
            {isClickedMetricSystem && (
              <View className="border border-gray-300 rounded-lg p-2 mt-1">
                {metricSystem.map((metric) => (
                  <TouchableOpacity
                    key={metric.metric_system_id}
                    className="p-2"
                    onPress={() => handleMetricSelect(metric)}
                  >
                    <Text className="text-base">
                      {metric.metric_system_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Crop Class */}
          <View className="mb-4">
            <Text className="text-base text-gray-700">
              Crop Class
            </Text>
            <TouchableOpacity
              className="flex-row items-center border border-gray-300 p-2 rounded-lg"
              onPress={() => setIsClickedCropClass(!isClickedCropClass)}
            >
              <Text className="text-base text-gray-700 flex-1">
                {selectedCropClass}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color="gray"
                className="ml-2"
              />
            </TouchableOpacity>
            {isClickedCropClass && (
              <View className="border border-gray-300 rounded-lg p-2 mt-1">
                {cropClasses.map((cropClass) => (
                  <TouchableOpacity
                    key={cropClass.crop_class_id}
                    className="p-2"
                    onPress={() => handleCropClassSelect(cropClass)}
                  >
                    <Text className="text-base">
                      {cropClass.crop_class_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Crop Quantity */}
          <View className="mb-4">
            <Text className="text-base text-gray-700">Crop Quantity</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-2 mt-1"
              keyboardType="numeric"
              placeholder="Enter the quantity of the crop."
              value={cropQuantity}
              onChangeText={setCropQuantity}
            />
          </View>

          {/* Image Upload */}
          <View className="mb-4">
            <Text className="text-base text-gray-700 mb-2">
              Upload Crop Image
            </Text>
            <TouchableOpacity
              className="rounded-lg p-2 items-center"
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

          {/* Add Product Button */}
          <TouchableOpacity
            className="bg-green-600 p-4 rounded-lg"
            onPress={() => {
              Alert.alert(
                "Confirm Add Product",
                "Do you really want to add this product?",
                [
                  {
                    text: "No",
                    onPress: () => console.log("Product addition canceled"),
                    style: "cancel",
                  },
                  {
                    text: "Yes",
                    onPress: handleAddProduct,
                  },
                ],
                { cancelable: false }
              );
            }}
          >
            <Text className="text-white text-center">Add Product</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal for Image Selection */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/50 ">
          <View className="bg-white p-6 rounded-lg">
            <Text className="text-lg font-semibold mb-4">
              Select Image Source
            </Text>
            <TouchableOpacity
              className="mb-4 p-4 bg-[#00B251] rounded-lg"
              onPress={selectImageFromGallery}
            >
              <Text className="text-white text-center">Choose from Gallery</Text>
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
    </SafeAreaView>
  );
}

export default AddProductScreen;
