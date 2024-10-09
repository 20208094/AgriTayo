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
} from "react-native";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL} from "@env";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "react-native-vector-icons/Ionicons";

function AddProductScreen() {
  // for fetching
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [metricSystem, setMetricSystem] = useState([]);
  const API_KEY = REACT_NATIVE_API_KEY;

  // for user inputs
  const [cropName, setCropName] = useState("");
  const [cropDescription, setCropDescription] = useState("");
  const [cropPrice, setCropPrice] = useState("");
  const [cropQuantity, setCropQuantity] = useState("");
  const [cropWeight, setCropWeight] = useState("");
  const [stocks, setStocks] = useState("");
  const [availability, setAvailability] = useState('live')
  const [availablityMessage, setAvailabilityMessage] = useState(null)
  const [cropId, setCropId] = useState('')
  const [shopId, setShopId] = useState('')
  const [cropRating, setCropRating] = useState('')


  // for clicked or checked
  const [isClickedCategory, setIsClickedCategory] = useState(false);
  const [isClickedMetricSystem, setIsClickedMetricSystem] = useState(false);
  const [isClickedSubCategory, setIsclickedSubCategory] = useState(false);

  const [selectedMetricSystem, setSelectedMetricSystem] = useState("Metric");
  const [selectedCategory, setSelectedCategory] = useState("Category");
  const [selectedSubCategory, setSelectedSubCategory] =
    useState("Sub Category");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // State for selected category ID

  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({});

  const handleMetricSelect = (metric) => {
    setSelectedMetricSystem(metric.metric_system_name);
    setIsClickedMetricSystem(false);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.crop_category_name);
    setSelectedCategoryId(category.crop_category_id); // Set selected category ID
    setIsClickedCategory(false);
    fetchSubCategories(category.crop_category_id); // Fetch subcategories for the selected category
  };

  const handleSubCategorySelect = (subCategory) => {
    setSelectedSubCategory(subCategory.crop_sub_category_name);
    setIsclickedSubCategory(false);
  };

  // Function to handle image selection from gallery
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
      setFormData({ ...formData, crop_image: result.assets[0].uri });
      setModalVisible(false);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, crop_image: null });
  };

  // fetching categories
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
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching crop categories:", error);
    }
  };

  // fetching sub categories
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
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const filteredData = data.filter(
        (subCategory) => subCategory.crop_category_id === categoryId
      );
      setSubCategories(filteredData);
    } catch (error) {
      console.error("Error fetching crop sub categories:", error);
    }
  };

  // fetch Metric System
  const fetchMetricSystem = async () => {
    try {
      const response = await fetch(
        "https://agritayo.azurewebsites.net/api/metric_systems",
        {
          headers: {
            "x-api-key": API_KEY,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setMetricSystem(data);
    } catch (error) {
      console.error("Error fetching metric systems:", error);
    }
  };

  // Fetch categories when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchCategories();
      fetchMetricSystem();
    }, [])
  );

  const handleAddProduct = async () => {
    const productData = {
      crop_id: cropId,
      crop_name: cropName,
      crop_description: cropDescription, 
      sub_category_id: selectedSubCategory,
      shop_id: shopId,
      crop_image_url: cropImage,
      crop_rating: cropRating,
      crop_price: cropPrice,
      crop_quantity: cropQuantity,
      crop_weight: cropWeight,
      metric_system_id: metricSystem,
      stocks: stocks,
      availability: availability,
      availability_message: availablityMessage
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="flex-1 p-4">
        <View className="bg-white p-4 rounded-lg shadow-md">
          {/* Crop Name */}
          <View className="mb-4">
            <Text className="text-base text-gray-700">Crop Name</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-2 mt-1"
              placeholder="e.g. Potato, Carrots, Cabbage, etc."
              value={cropName}
              onChangeText={setCropName}
            />
          </View>

          {/* Crop Description */}
          <View className="mb-4">
            <Text className="text-base text-gray-700">Crop Description</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-2 mt-1"
              placeholder="Describe the crop you want to sell."
              value={cropDescription}
              onChangeText={setCropDescription}
            />
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

          {/* Category Selector */}
          <View className="mb-4">
            <Text className="text-base text-gray-700">
              Select Crop Category
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
            <Text className="text-base text-gray-700">Select Sub-Category</Text>
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

          {/* Crop Weight */}
          <View className="mb-4">
            <Text className="text-base text-gray-700">Crop Weight</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-2 mt-1"
              keyboardType="numeric"
              placeholder="Enter the weight of the crop."
              value={cropWeight}
              onChangeText={setCropWeight}
            />
          </View>

          {/* Metric System Selector */}
          <View className="mb-4">
            <Text className="text-base text-gray-700">Select Crop Metric</Text>
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

          {/* Stocks Text Input */}
          <View className="mb-4">
            <Text className="text-base text-gray-700">Stock/s</Text>
            <TextInput
              placeholder='0'
              className="border border-gray-300 rounded-lg p-2 mt-1"
              keyboardType="numeric"
              value={stocks}
              onChangeText={setStocks}
            />
          </View>
          {/* Availability Text Input */}
          <View className="mb-4">
            <Text className="text-base text-gray-700">Availability</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-2 mt-1"
              editable={false}
              value={availability}
              onChangeText={setAvailability}
            />
          </View>

          {/* Image Upload */}
          <View className="mb-4">
            <Text className="text-base text-gray-700 mb-2">
              Upload Crop Image
            </Text>
            <TouchableOpacity
              className="border border-gray-300 rounded-lg p-2"
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="camera" size={24} color="#00b251" />
            </TouchableOpacity>

            {formData.crop_image && (
              <View className="mt-4">
                <Image
                  source={{ uri: formData.crop_image }}
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
            onPress={handleAddProduct}
          >
            <Text className="text-white text-center">Add Product</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal for Image Selection */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg">
            <Text className="text-lg font-semibold mb-4">
              Select Image Source
            </Text>
            <TouchableOpacity
              className="mb-4 p-4 bg-gray-100 rounded-lg"
              onPress={selectImageFromGallery}
            >
              <Text className="text-base">Choose from Gallery</Text>
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
