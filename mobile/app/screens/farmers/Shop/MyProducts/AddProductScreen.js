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
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_KEY = REACT_NATIVE_API_KEY;

  const [cropName, setCropName] = useState("");
  const [cropDescription, setCropDescription] = useState("");
  const [cropPrice, setCropPrice] = useState("");
  const [cropQuantity, setCropQuantity] = useState("");
  const [cropWeight, setCropWeight] = useState("");
  const [stocks, setStocks] = useState("");
  const [availability, setAvailability] = useState("live");
  const [availabilityMessage, setAvailabilityMessage] = useState(null);
  const [shopId, setShopId] = useState("");
  const [cropRating, setCropRating] = useState("");

  const [isClickedCategory, setIsClickedCategory] = useState(false);
  const [isClickedMetricSystem, setIsClickedMetricSystem] = useState(false);
  const [isClickedSubCategory, setIsclickedSubCategory] = useState(false);

  const [selectedMetricSystem, setSelectedMetricSystem] = useState("Metric");
  const [selectedCategory, setSelectedCategory] = useState("Category");
  const [selectedSubCategory, setSelectedSubCategory] =
    useState("Sub Category");
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

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
      fetchMetricSystem();
      getAsyncShopData();
    }, [])
  );

  const handleAddProduct = async () => {
    console.log("Crop Image URI: ", cropImage);
    if (
      !cropName ||
      !cropDescription ||
      !cropPrice ||
      !cropQuantity ||
      !cropWeight ||
      !selectedCategoryId ||
      !selectedSubCategoryId ||
      !selectedMetricSystemId ||
      !cropImage ||
      !stocks
    ) {
      alert("Please fill in all the required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("crop_name", cropName);
    formData.append("crop_description", cropDescription);
    formData.append("sub_category_id", selectedSubCategoryId);
    formData.append("shop_id", shopData.shop_id);
    if (cropImage) {
      formData.append("image", {
        uri: cropImage,
        name: "shop.jpg",
        type: "image/jpeg",
      });
    }
    formData.append("crop_rating", cropRating || 0);
    formData.append("crop_price", parseFloat(cropPrice));
    formData.append("crop_quantity", parseInt(cropQuantity));
    formData.append("crop_weight", parseFloat(cropWeight));
    formData.append("metric_system_id", selectedMetricSystemId);
    formData.append("stocks", parseInt(stocks));
    formData.append("availability", availability);
    formData.append("availability_message", availabilityMessage || "Available");

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
              placeholder="0"
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
