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
import LoadingAnimation from "../../../../components/LoadingAnimation";

const PRICE_REGEX = /^(?:[1-9]\d*|\d+\.\d{1,2}|0\.\d{1,2})$/;
const QUANTITY_REGEX = /^[1-9]\d*$/;

function AddProductScreen({ navigation, route }) {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [metricSystem, setMetricSystem] = useState([]);
  const [cropSizes, setCropSizes] = useState([]);
  const [cropVarieties, setCropVarieties] = useState([]);
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);
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

    setErrors((prevErrors) => ({ ...prevErrors, selectedMetricSystemId: "" }));
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.crop_category_name);
    setSelectedCategoryId(category.crop_category_id);
    setIsClickedCategory(false);
    fetchSubCategories(category.crop_category_id);

    setErrors((prevErrors) => ({ ...prevErrors, selectedCategoryId: "" }));
  };

  const handleSubCategorySelect = (subCategory) => {
    setSelectedSubCategory(subCategory.crop_sub_category_name);
    setSelectedSubCategoryId(subCategory.crop_sub_category_id);
    setIsclickedSubCategory(false);
    fetchCropVariety(subCategory.crop_sub_category_id);

    setErrors((prevErrors) => ({ ...prevErrors, selectedSubCategoryId: "" }));
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
  const handleCropSizeSelect = (size) => {
    setSelectedCropSize(size.crop_size_name);
    setSelectedCropSizeId(size.crop_size_id);
    setErrors(prev => ({ ...prev, selectedCropSizeId: "" }));
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

    setErrors((prevErrors) => ({ ...prevErrors, selectedCropVarietyId: "" }));

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
  const fetchCropVariety = async (subCategoryId) => {
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
      const filteredData = data.filter(
        (subCategory) => subCategory.crop_sub_category_id === subCategoryId
      );
      setCropVarieties(filteredData);
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
      fetchSubCategories();
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

    setErrors((prevErrors) => ({ ...prevErrors, selectedCropClass: "" }));
  };

  const handleInputValidation = (field, value) => {
    let error = "";

    if (!value) {
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[field];
        return updatedErrors;
      });
      return;
    }

    switch (field) {
      case "cropPrice":
        // Format the text if it starts with a dot
        let formattedPrice = value;
        if (value.startsWith('.')) {
          formattedPrice = `0${value}`;
        }
        // Limit to 2 decimal places
        const priceParts = formattedPrice.split('.');
        if (priceParts[1] && priceParts[1].length > 2) {
          formattedPrice = `${priceParts[0]}.${priceParts[1].slice(0, 2)}`;
        }
        if (!PRICE_REGEX.test(formattedPrice)) {
          error = "Enter a valid price greater than 0 (e.g., 100 or 100.00).";
        }
        break;
      case "cropQuantity":
        if (!QUANTITY_REGEX.test(value)) {
          error = "Enter a valid whole number greater than 0.";
        }
        break;
      case "cropDescription":
        // No additional rules for description
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error,
    }));
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
    if (!selectedCropClass || selectedCropClass === "Select Crop Class") {
      errors.selectedCropClass = "Select a crop class.";
    }

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

  // Add new state for modal and search
  const [modalVisible2, setModalVisible2] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [modalData, setModalData] = useState([]);

  // Helper function for modal data
  const handleOpenModal = (field) => {
    let data = [];
    switch (field) {
      case 'category':
        data = categories.map(cat => ({
          label: cat.crop_category_name,
          value: cat.crop_category_id,
          original: cat
        }));
        break;
      case 'subcategory':
        data = subCategories.map(sub => ({
          label: sub.crop_sub_category_name,
          value: sub.crop_sub_category_id,
          original: sub
        }));
        break;
      case 'variety':
        data = cropVarieties.map(variety => ({
          label: variety.crop_variety_name,
          value: variety.crop_variety_id,
          original: variety
        }));
        break;
      case 'metric':
        data = metricSystem.map(metric => ({
          label: metric.metric_system_name,
          value: metric.metric_system_id,
          original: metric
        }));
        break;
    }
    setModalData(data);
    setActiveField(field);
    setSearchText('');
    setModalVisible2(true);
  };

  const handleModalItemSelect = (item) => {
    switch (activeField) {
      case 'category':
        handleCategorySelect(item.original);
        break;
      case 'subcategory':
        handleSubCategorySelect(item.original);
        break;
      case 'variety':
        handleCropVarietySelect(item.original);
        break;
      case 'metric':
        handleMetricSelect(item.original);
        break;
    }
    setModalVisible2(false);
  };

  const filteredItems = modalData.filter(item =>
    item.label.toLowerCase().includes(searchText.toLowerCase())
  );

  // Add this useEffect to handle all incoming new data
  useEffect(() => {
    // Handle new category
    if (route.params?.newCategory) {
      setCategories(prev => {
        const exists = prev.some(cat => cat.crop_category_id === route.params.newCategory.crop_category_id);
        if (!exists) return [...prev, route.params.newCategory];
        return prev;
      });
      setSelectedCategory(route.params.newCategory.crop_category_name);
      setSelectedCategoryId(route.params.newCategory.crop_category_id);
    }

    // Handle new subcategory
    if (route.params?.newSubCategory) {
      setSubCategories(prev => {
        const exists = prev.some(sub => sub.crop_sub_category_id === route.params.newSubCategory.crop_sub_category_id);
        if (!exists) return [...prev, route.params.newSubCategory];
        return prev;
      });
      setSelectedSubCategory(route.params.newSubCategory.crop_sub_category_name);
      setSelectedSubCategoryId(route.params.newSubCategory.crop_sub_category_id);
    }

    // Handle new variety
    if (route.params?.newVariety) {
      setCropVarieties(prev => {
        const exists = prev.some(variety => variety.crop_variety_id === route.params.newVariety.crop_variety_id);
        if (!exists) return [...prev, route.params.newVariety];
        return prev;
      });
      setSelectedCropVariety(route.params.newVariety.crop_variety_name);
      setSelectedCropVarietyId(route.params.newVariety.crop_variety_id);
    }
  }, [route.params]);

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <SafeAreaView className="bg-gray-100 ">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="p-4 ml-2 mr-4">

          {/* Category Selection */}
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-1">
              Choose Category <Text className="text-red-500">*</Text>
              {errors.selectedCategoryId && (
                <Text className="text-red-600 text-xs">{errors.selectedCategoryId}</Text>
              )}
            </Text>
            <TouchableOpacity
              onPress={() => handleOpenModal('category')}
              className="w-full border border-gray-500 rounded-lg p-2 px-4 mx-2"
            >
              <Text className="text-base pl-2">
                {selectedCategory || "Select a category"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Subcategory Selection */}
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-1">
              Choose Subcategory <Text className="text-red-500">*</Text>
              {errors.selectedSubCategoryId && (
                <Text className="text-red-600 text-xs">{errors.selectedSubCategoryId}</Text>
              )}
            </Text>
            <TouchableOpacity
              onPress={() => handleOpenModal('subcategory')}
              className="w-full border border-gray-500 rounded-lg p-2 px-4 mx-2"
            >
              <Text className="text-base pl-2">
                {selectedSubCategory || "Select a subcategory"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Variety Selection */}
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-1">
              Choose Variety <Text className="text-red-500">*</Text>
              {errors.selectedCropVarietyId && (
                <Text className="text-red-600 text-xs">{errors.selectedCropVarietyId}</Text>
              )}
            </Text>
            <TouchableOpacity
              onPress={() => handleOpenModal('variety')}
              className="w-full border border-gray-500 rounded-lg p-2 px-4 mx-2"
            >
              <Text className="text-base pl-2">
                {selectedCropVariety || "Select a variety"}
              </Text>
            </TouchableOpacity>
          </View>

          
          {/* Crop Description */}
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-1">
              Crop Description <Text className="text-red-500">*</Text>
              {errors.cropDescription && (
                <Text className="text-red-600 text-xs">{errors.cropDescription}</Text>
              )}
            </Text>
            <TextInput
              className="w-full p-2 bg-white rounded-lg border border-gray-500 mx-2"
              placeholder="Describe the crop you want to sell."
              value={cropDescription}
              onChangeText={(text) => {
                setCropDescription(text);
                handleInputValidation("cropDescription", text);
              }}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Class Selection */}
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-1">
              Choose Class: <Text className="text-red-500">*</Text>
              {errors.selectedCropClass && (
                <Text className="text-red-600 text-xs">{errors.selectedCropClass}</Text>
              )}
            </Text>
            <View className="flex-row flex-wrap mx-2" style={{ gap: 8 }}>
              {cropClasses.map((cropClass) => (
                <TouchableOpacity
                  key={cropClass.crop_class_id}
                  onPress={() => handleCropClassSelect(cropClass)}
                  className={`px-4 py-2 flex-1 rounded-lg ${selectedCropClass === cropClass.crop_class_name
                      ? 'bg-[#00B251]'
                      : 'bg-[#8f8d8d]'
                    }`}
                >
                  <Text className="text-white font-semibold text-center">{cropClass.crop_class_name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Size Selection */}
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-1">
              Choose Size: <Text className="text-red-500">*</Text>
              {errors.selectedCropSizeId && (
                <Text className="text-red-600 text-xs">{errors.selectedCropSizeId}</Text>
              )}
            </Text>
            <View className="flex-row flex-wrap mx-2" style={{ gap: 8 }}>
              {cropSizes.map((size) => (
                <TouchableOpacity
                  key={size.crop_size_id}
                  onPress={() => handleCropSizeSelect(size)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedCropSizeId === size.crop_size_id
                      ? 'bg-[#00B251]'
                      : 'bg-[#8f8d8d]'
                  }`}
                >
                  <Text className="text-white font-semibold text-center">
                    {size.crop_size_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Crop Price */}
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-1">
              Crop Price <Text className="text-red-500">*</Text>
              {errors.cropPrice && (
                <Text className="text-red-600 text-xs">{errors.cropPrice}</Text>
              )}
            </Text>
            <TextInput
              className="w-full p-2 bg-white rounded-lg border border-gray-500 mx-2"
              keyboardType="numeric"
              placeholder="₱ 0.00"
              value={cropPrice}
              onChangeText={(text) => {
                // Format the text if it starts with a dot
                let formattedText = text;
                if (text.startsWith('.')) {
                  formattedText = `0${text}`;
                }
                // Limit to 2 decimal places
                const parts = formattedText.split('.');
                if (parts[1] && parts[1].length > 2) {
                  formattedText = `${parts[0]}.${parts[1].slice(0, 2)}`;
                }
                setCropPrice(formattedText);
                handleInputValidation("cropPrice", formattedText);
              }}
            />
          </View>

          {/* Crop Quantity and Metric System Row */}
          <View className="flex-row mb-4 mx-2" style={{ gap: 8 }}>
            {/* Crop Quantity - Left Side */}
            <View className="flex-1">
              <Text className="text-lg font-semibold mb-1">
                Crop Quantity <Text className="text-red-500">*</Text>
                {errors.cropQuantity && (
                  <Text className="text-red-600 text-xs">{errors.cropQuantity}</Text>
                )}
              </Text>
              <TextInput
                className="w-full p-2 bg-white rounded-lg border border-gray-500"
                keyboardType="numeric"
                placeholder="Enter quantity"
                value={cropQuantity}
                onChangeText={(text) => {
                  const numericText = text.replace(/[^0-9]/g, '');
                  setCropQuantity(numericText);
                  handleInputValidation("cropQuantity", numericText);
                }}
              />
            </View>

            {/* Metric System - Right Side */}
            <View className="flex-1">
              <Text className="text-lg font-semibold mb-1">
                Choose Metric <Text className="text-red-500">*</Text>
                {errors.selectedMetricSystemId && (
                  <Text className="text-red-600 text-xs">{errors.selectedMetricSystemId}</Text>
                )}
              </Text>
              <TouchableOpacity
                onPress={() => handleOpenModal('metric')}
                className="w-full p-2 bg-white rounded-lg border border-gray-500"
              >
                <Text className="text-base pl-2">
                  {selectedMetricSystem || "Select a metric"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Negotiation Section */}
          <View className="mb-4">
            <Text className="text-lg font-semibold">Open for Negotiation?</Text>
            <View className="flex-row items-center px-2">
              <Text className="text-base mr-2">{isEnabled ? "Yes" : "No"}</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#7edeaa" }}
                thumbColor={isEnabled ? "#00b251" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
          </View>

          {isEnabled && (
            <View className="mb-4">
              <Text className="text-lg font-semibold mb-1">
                Minimum Quantity for Negotiation
              </Text>
              <TextInput
                className="w-full p-2 bg-white rounded-lg border border-gray-500 mx-2"
                keyboardType="numeric"
                placeholder="5"
                value={minimumNegotiation}
                onChangeText={setMinimumNegotiation}
              />
            </View>
          )}

          {/* Image Upload Section */}
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-1">
              Upload Crop Image <Text className="text-red-500">*</Text>
              {errors.cropImage && (
                <Text className="text-red-600 text-xs">{errors.cropImage}</Text>
              )}
            </Text>
            <TouchableOpacity
              className="border border-dashed border-green-600 rounded-md p-4 flex-row justify-center items-center"
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
                  className="w-full h-48 rounded-lg"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={removeImage}
                  className="absolute top-2 right-2 bg-red-500 rounded-full w-8 h-8 justify-center items-center"
                >
                  <Ionicons name="close-outline" size={24} color="white" />
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
            <View className="flex-1 justify-center items-center bg-black/50">
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

          {/* Selection Modal */}
          <Modal
            visible={modalVisible2}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible2(false)}
          >
            <View className="flex-1 justify-center items-center bg-black/50">
              <View className="w-11/12 bg-white rounded-lg" style={{ maxHeight: '80%' }}>
                <View className="p-4 border-b border-gray-200">
                  <TextInput
                    className="w-full p-2 bg-gray-100 rounded-lg"
                    placeholder="Search..."
                    value={searchText}
                    onChangeText={setSearchText}
                  />
                </View>
                
                {activeField === 'category' && (
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible2(false);
                      navigation.navigate("Add Crop Category");
                    }}
                    className="p-4 bg-gray-100 flex-row items-center justify-center border-b border-gray-200"
                  >
                    <Text className="ml-2 text-[#00B251]">Missing category? Add it here</Text>
                  </TouchableOpacity>
                )}
                
                {activeField === 'subcategory' && (
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible2(false);
                      navigation.navigate("Add Crop Sub Category", {
                        selectedCategory: selectedCategory,
                        selectedCategoryId: selectedCategoryId,
                      });
                    }}
                    className="p-4 bg-gray-100 flex-row items-center justify-center border-b border-gray-200"
                  >
                    <Text className="ml-2 text-[#00B251]">Missing subcategory? Add it here</Text>
                  </TouchableOpacity>
                )}
                
                {activeField === 'variety' && (
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible2(false);
                      navigation.navigate("Add Crop Variety", {
                        selectedCategory: selectedCategory,
                        selectedCategoryId: selectedCategoryId,
                        selectedSubCategory: selectedSubCategory,
                        selectedSubCategoryId: selectedSubCategoryId,
                      });
                    }}
                    className="p-4 bg-gray-100 flex-row items-center justify-center border-b border-gray-200"
                  >
                    <Text className="ml-2 text-[#00B251]">Missing variety? Add it here</Text>
                  </TouchableOpacity>
                )}

                <ScrollView>
                  {filteredItems.map((item) => (
                    <TouchableOpacity
                      key={item.value}
                      className="p-3 mx-4 border-b border-gray-200"
                      onPress={() => handleModalItemSelect(item)}
                    >
                      <Text className="text-base">{item.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Close button at bottom */}
                <TouchableOpacity
                  onPress={() => setModalVisible2(false)}
                  className="p-4 border-t border-gray-200"
                >
                  <Text className="text-center text-gray-600 font-semibold">Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>

      {/* Image Selection Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-[80%]">
            <Text className="text-lg font-semibold mb-4 text-center">
              Select Image Source
            </Text>
            
            <TouchableOpacity
              className="bg-[#00B251] p-3 rounded-lg mb-3"
              onPress={selectImageFromGallery}
            >
              <Text className="text-white text-center font-semibold">
                Choose from Gallery
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="bg-[#00B251] p-3 rounded-lg mb-3"
              onPress={selectImageFromCamera}
            >
              <Text className="text-white text-center font-semibold">
                Take a Photo
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="bg-gray-400 p-3 rounded-lg"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-white text-center font-semibold">Cancel</Text>
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
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-[80%]">
            <Text className="text-lg mb-4 text-center">{alertMessage}</Text>
            <TouchableOpacity
              className="bg-[#00B251] p-3 rounded-lg"
              onPress={() => setAlertVisible(false)}
            >
              <Text className="text-white text-center font-semibold">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default AddProductScreen;
