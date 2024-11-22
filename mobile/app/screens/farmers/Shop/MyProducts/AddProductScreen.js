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
  Switch,
} from "react-native";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PRICE_REGEX = /^\d+(\.\d{1,2})?$/;

function AddProductScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [metricSystem, setMetricSystem] = useState([]);
  const [cropSizes, setCropSizes] = useState([]);
  const [cropVarieties, setCropVarieties] = useState([]);
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_KEY = REACT_NATIVE_API_KEY;

  const [cropDescription, setCropDescription] = useState("");
  const [cropPrice, setCropPrice] = useState("");
  const [cropQuantity, setCropQuantity] = useState("");
  const [minimumNegotiation, setMinimumNegotiation] = useState("");

  const [isClickedCategory, setIsClickedCategory] = useState(false);
  const [isClickedMetricSystem, setIsClickedMetricSystem] = useState(false);
  const [isClickedSubCategory, setIsclickedSubCategory] = useState(false);

  const [selectedMetricSystem, setSelectedMetricSystem] =
    useState("Select Crop Metric");
  const [selectedCategory, setSelectedCategory] = useState(
    "Select Crop Category"
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    "Select Crop Sub Category"
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [selectedMetricSystemId, setSelectedMetricSystemId] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);

  const [cropImage, setCropImage] = useState(null);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [errors, setErrors] = useState({});

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

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

  const getAsyncShopData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("shopData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const shop = Array.isArray(parsedData) ? parsedData[0] : parsedData;
        setShopData(shop);
      }
    } catch (error) {
      setAlertMessage(`Failed to load shop data: ${error.message}`);
      setAlertVisible(true);
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
      setAlertMessage(`Error fetching metric systems: ${error.message}`);
      setAlertVisible(true);
    }
  };

  // for crop size
  const [isClickedCropSize, setIsClickedCropSize] = useState(false);
  const [selectedCropSize, setSelectedCropSize] = useState("Select Crop Size");
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
      setAlertMessage(`Error fetching crop categories: ${error.message}`);
      setAlertVisible(true);
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

  // Handle crop variety selection
  const handleCropVarietySelect = (cropVariety) => {
    setSelectedCropVariety(cropVariety.crop_variety_name);
    setSelectedCropVarietyId(cropVariety.crop_variety_id);
    setIsClickedCropVariety(false);

    // Find and set the category and subcategory based on the selected crop variety
    const selectedCategory = categories.find(
      (category) => category.crop_category_id === cropVariety.crop_category_id
    );
    const selectedSubCategory = subCategories.find(
      (subCategory) =>
        subCategory.crop_sub_category_id === cropVariety.crop_sub_category_id
    );

    // Update category and subcategory selections
    if (selectedCategory) {
      setSelectedCategory(selectedCategory.crop_category_name);
      setSelectedCategoryId(selectedCategory.crop_category_id);
      fetchSubCategories(selectedCategory.crop_category_id); // Fetch subcategories based on category
    }

    if (selectedSubCategory) {
      setSelectedSubCategory(selectedSubCategory.crop_sub_category_name);
      setSelectedSubCategoryId(selectedSubCategory.crop_sub_category_id);
    }

    // Clear any existing errors for these fields
    setErrors((prevErrors) => ({
      ...prevErrors,
      selectedCategoryId: "",
      selectedSubCategoryId: "",
    }));
  };

  useEffect(() => {
    // If a crop variety is selected, set the category and subcategory based on that
    if (selectedCropVariety) {
      const selectedCategory = categories.find(
        (category) =>
          category.crop_category_id === selectedCropVariety.crop_category_id
      );

      const selectedSubCategory = subCategories.find(
        (subCategory) =>
          subCategory.crop_sub_category_id ===
          selectedCropVariety.crop_sub_category_id
      );

      if (selectedCategory) {
        setSelectedCategory(selectedCategory.crop_category_name);
      }

      if (selectedSubCategory) {
        setSelectedSubCategory(selectedSubCategory.crop_sub_category_name);
      }
    }
  }, [selectedCropVariety, categories, subCategories]);

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
      setAlertMessage(`Error fetching crop categories: ${error.message}`);
      setAlertVisible(true);
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
  const [selectedCropClass, setSelectedCropClass] =
    useState("Select Crop Class");
  const handleCropClassSelect = (cropClass) => {
    setSelectedCropClass(cropClass.crop_class_name);
    setIsClickedCropClass(false);
  };

  const handleAddProduct = async () => {
    const errors = {};

    // Field presence and regex validation
    if (!cropPrice) {
      errors.cropPrice = "Crop Price is required.";
    } else if (!PRICE_REGEX.test(cropPrice)) {
      errors.cropPrice = "Enter a valid price (e.g., 100 or 100.00).";
    }
    if (!cropQuantity) {
      errors.cropQuantity = "Crop Quantity is required.";
    } else if (!PRICE_REGEX.test(cropQuantity)) {
      errors.cropQuantity = "Enter a valid Quantity";
    }

    if (!cropImage) {
      errors.cropImage = "Select an image.";
    }
    if (!cropDescription)
      errors.cropDescription = "Crop Description is required.";
    if (!selectedCategoryId) errors.selectedCategoryId = "Select a category.";
    if (!selectedSubCategoryId)
      errors.selectedSubCategoryId = "Select a sub-category.";
    if (!selectedMetricSystemId)
      errors.selectedMetricSystemId = "Select a metric.";
    if (!selectedCropSizeId) errors.selectedCropSizeId = "Select a crop size.";
    if (!selectedCropVarietyId)
      errors.selectedCropVarietyId = "Select a crop variety.";
    if (!selectedCropClass) errors.selectedCropClass = "Select a crop class.";

    // If there are errors, show alert and return without submitting
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      setAlertMessage("Please fill in all the required fields correctly.");
      setAlertVisible(true);
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
    formData.append("crop_price", parseFloat(cropPrice));
    formData.append("crop_quantity", parseInt(cropQuantity));
    formData.append("metric_system_id", selectedMetricSystemId);
    formData.append("crop_availability", "live");
    formData.append("crop_class", selectedCropClass);
    formData.append("negotiation_allowed", isEnabled ? "TRUE" : "FALSE");
    formData.append("minimum_negotiation", minimumNegotiation || 0);

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
        setAlertMessage("Product added successfully!");
        setAlertVisible(true);
        navigation.navigate("My Products");
      } else {
        console.error("Error adding product: ", responseText);
        setAlertMessage("Failed to add product. Please try again.");
        setAlertVisible(true);
      }
    } catch (error) {
      setAlertMessage(
        `An error occurred while adding the product: ${error.message}`
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
          {/* Crop Description */}
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              Crop Description <Text className="text-red-500 text-sm">*</Text>
              {errors.cropDescription && (
                <Text className="text-red-600 text-xs">
                  {errors.cropDescription}
                </Text>
              )}
            </Text>
            <TextInput
              className="w-full p-2  bg-white rounded-lg shadow-md"
              placeholder="Describe the crop you want to sell."
              value={cropDescription}
              onChangeText={setCropDescription}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Category Selector */}
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              Crop Category <Text className="text-red-500 text-sm">*</Text>
              {errors.selectedCategoryId && (
                <Text className="text-red-600 text-xs">
                  {errors.selectedCategoryId}
                </Text>
              )}
            </Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                className="flex-row items-center w-full p-2 bg-white rounded-lg shadow flex-1"
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
              <TouchableOpacity
                className=" ml-2 p-2 rounded-lg "
                onPress={() => navigation.navigate("Add Crop Category")}
              >
                <Ionicons name="add-outline" size={24} color="#00b251" />
              </TouchableOpacity>
            </View>
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
              Sub-Category <Text className="text-red-500 text-sm">*</Text>
              {errors.selectedSubCategoryId && (
                <Text className="text-red-600 text-xs">
                  {errors.selectedSubCategoryId}
                </Text>
              )}
            </Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                className="flex-row items-center w-full p-2 bg-white rounded-lg shadow-md flex-1"
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
              <TouchableOpacity
                className="ml-2 p-2 rounded-lg"
                onPress={() => navigation.navigate("Add Crop Sub Category")}
              >
                <Ionicons name="add-outline" size={24} color="#00b251" />
              </TouchableOpacity>
            </View>
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

          {/* Variety Selector */}
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              Crop Variety <Text className="text-red-500 text-sm">*</Text>
              {errors.selectedCropVarietyId && (
                <Text className="text-red-600 text-xs">
                  {errors.selectedCropVarietyId}
                </Text>
              )}
            </Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                className="flex-row items-center w-full p-2 mb-3 bg-white rounded-lg shadow-md flex-1"
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
              <TouchableOpacity
                className="ml-2 p-2 rounded-lg"
                onPress={() => navigation.navigate("Add Crop Variety")}
              >
                <Ionicons name="add-outline" size={24} color="#00b251" />
              </TouchableOpacity>
            </View>
            {isClickedCropVariety && (
              <View className="w-full p-2 mb-4 bg-white rounded-lg shadow-md">
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

          {/* Crop Class */}
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              Crop Class <Text className="text-red-500 text-sm">*</Text>
              {errors.selectedCropClass && (
                <Text className="text-red-600 text-xs">
                  {errors.selectedCropClass}
                </Text>
              )}
            </Text>
            <TouchableOpacity
              className="flex-row items-center w-full p-2 bg-white rounded-lg shadow-md"
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
              <View className="w-full p-2 mb-4 bg-white rounded-lg shadow-md">
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

          {/* Crop SIze */}
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              Crop Size <Text className="text-red-500 text-sm">*</Text>
              {errors.selectedCropSizeId && (
                <Text className="text-red-600 text-xs">
                  {errors.selectedCropSizeId}
                </Text>
              )}
            </Text>
            <TouchableOpacity
              className="flex-row items-center w-full p-2 bg-white rounded-lg shadow-md"
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
                    <Text className="text-base">{cropSize.crop_size_name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Crop Price */}
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              Crop Price <Text className="text-red-500 text-sm">*</Text>
              {errors.cropPrice && (
                <Text className="text-red-600 text-xs">{errors.cropPrice}</Text>
              )}
            </Text>
            <TextInput
              className="w-full p-2 bg-white rounded-lg shadow-md"
              keyboardType="numeric"
              placeholder="₱ 0.00"
              value={cropPrice}
              onChangeText={(text) => {
                setCropPrice(text);
                if (!PRICE_REGEX.test(text)) {
                  setErrors((prev) => ({
                    ...prev,
                    CropPrice: "Enter a valid price (e.g., 100 or 100.00).",
                  }));
                } else {
                  setErrors((prev) => ({ ...prev, CropPrice: "" }));
                }
              }}
            />
          </View>

          {/* Crop Quantity */}
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              Crop Quantity <Text className="text-red-500 text-sm">*</Text>
              {errors.cropQuantity && (
                <Text className="text-red-600 text-xs">
                  {errors.cropQuantity}
                </Text>
              )}
            </Text>
            <TextInput
              className="w-full p-2 bg-white rounded-lg shadow-md"
              keyboardType="numeric"
              placeholder="Enter the quantity of the crop."
              value={cropQuantity}
              onChangeText={setCropQuantity}
            />
          </View>

          {/* Metric System Selector */}
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              Crop Metric <Text className="text-red-500 text-sm">*</Text>
              {errors.selectedMetricSystemId && (
                <Text className="text-red-600 text-xs">
                  {errors.selectedMetricSystemId}
                </Text>
              )}
            </Text>
            <TouchableOpacity
              className="flex-row items-center w-full p-2 bg-white rounded-lg shadow-md"
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
              <View className="w-full p-2 mb-4 bg-white rounded-lg shadow-md">
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

          {/* Negotiation Selector */}
          <Text className="text-sm mb-2 text-gray-800">
            Open for Negotiation?
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 10,
            }}
          >
            <Text>{isEnabled ? "Yes" : "No"}</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#00b251" }}
              thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
          {isEnabled && (
            <>
              <View className="mb-4">
                <Text className="text-sm mb-2 text-gray-800">
                  Minimum Quantity for Negotiation:
                </Text>
                <TextInput
                  className="w-full p-2 bg-white rounded-lg shadow-md"
                  keyboardType="numeric"
                  placeholder="5"
                  value={minimumNegotiation}
                  onChangeText={setMinimumNegotiation}
                />
              </View>
            </>
          )}

          {/* Image Upload */}
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              Upload Crop Image <Text className="text-red-500 text-sm">*</Text>
              {errors.cropImage && (
                <Text className="text-red-600 text-xs">{errors.cropImage}</Text>
              )}
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

          {/* Add Product Button */}
          <TouchableOpacity
            className="bg-[#00B251] p-4 rounded-lg flex items-center mt-4"
            onPress={() => setModalVisible1(true)}
          >
            <Text className="text-white text-base">Add Product</Text>
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
                  Confirm Add Product
                </Text>
                <Text className="text-gray-600 mb-6">
                  Do you really want to add this product?
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
                      handleAddProduct();
                    }}
                  >
                    <Text className="text-white text-base">Yes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
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
    </SafeAreaView>
  );
}

export default AddProductScreen;
