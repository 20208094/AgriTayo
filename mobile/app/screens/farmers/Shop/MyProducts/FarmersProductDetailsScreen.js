import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
  Modal,
} from "react-native";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import LoadingAnimation from "../../../../components/LoadingAnimation";

function FarmersProductDetailScreen({ route, navigation }) {
  const { liveItem, reviewingItem, violationItem, delistedItem, soldOutItem } = route.params;

  const product = liveItem || reviewingItem || violationItem || delistedItem || soldOutItem;

  console.log(product);

  // for data fetching
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [cropSizes, setCropSizes] = useState([]);
  const [cropVarieties, setCropVarieties] = useState([]);
  const [cropMetrics, setCropMetrics] = useState([]);
  const [searchAvailability, setSearchAvailability] = useState("");


  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);

  // for user inputs
  const [cropDescription, setCropDescription] = useState(
    product?.crop_description || ""
  );
  const [imageSource, setImageSource] = useState(null);
  const [cropPrice, setCropPrice] = useState(
    String(product?.crop_price || "")
  );
  const [cropQuantity, setCropQuantity] = useState(
    String(product?.crop_quantity || "")
  );

  const [minimumNegotiation, setMinimumNegotiation] = useState(
    String(product?.minimum_negotiation || "")
  );

  const [isEnabled, setIsEnabled] = useState(
    product?.negotiation_allowed || false
  );
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const [loading, setLoading] = useState(true);

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

  // Handle image selection from gallery
  const handleImagePickFromGallery = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      setAlertMessage("Permission to access camera roll denied");
      setAlertVisible(true);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;

      // Validate the image size before proceeding
      const isValidSize = await validateImageSize(imageUri);
      if (isValidSize) {
        setImageSource({ uri: imageUri });
        setModalVisible2(false);
      }
    }
  };

  // Handle image selection from camera
  const handleImagePickFromCamera = async () => {
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

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;

      // Validate the image size before proceeding
      const isValidSize = await validateImageSize(imageUri);
      if (isValidSize) {
        setImageSource({ uri: imageUri });
        setModalVisible2(false);
      }
    }
  };
  // for crop category
  const [isClickedCategory, setIsClickedCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    product?.category?.crop_category_name || "Select Category"
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const handleCategorySelect = (category) => {
    setSelectedCategory(category.crop_category_name);
    setSelectedCategoryId(category.crop_category_id);
    setIsClickedCategory(false);
    fetchSubCategories(category.crop_category_id);
  };
  // fetching category
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/crop_categories`,
        {
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      alert(`Error fetching crop categories: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // for sub category
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [isClickedSubCategory, setIsclickedSubCategory] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    product?.subcategory?.crop_sub_category_name || "Select Sub Category"
  );
  const handleSubCategorySelect = (subCategory) => {
    setSelectedSubCategory(subCategory.crop_sub_category_name);
    setSelectedSubCategoryId(subCategory.crop_sub_category_id);
    setIsclickedSubCategory(false);
    fetchCropVariety(subCategory.crop_sub_category_id)
  };

  // fetching sub category with filter depending on selected category
  const fetchSubCategories = async (categoryId) => {
    try {
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/crop_sub_categories`,
        {
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
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

  // for crop size
  const [isClickedCropSize, setIsClickedCropSize] = useState(false);
  const [selectedCropSize, setSelectedCropSize] = useState(
    product?.size?.crop_size_name || "Select Crop Size"
  );
  const [selectedCropSizeId, setSelectedCropSizeId] = useState(
    product?.size?.crop_size_id || null
  );
  const handleCropSizeSelect = (size) => {
    if (!size) return;
    setSelectedCropSize(size.crop_size_name);
    setSelectedCropSizeId(size.crop_size_id);
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
    product?.variety?.crop_variety_name || "Select Crop Variety"
  );
  const [selectedCropVarietyId, setSelectedCropVarietyId] = useState(
    product?.variety?.crop_variety_id || null
  );
  const handleCropVarietySelect = (variety) => {
    if (!variety) return;
    setSelectedCropVariety(variety.crop_variety_name);
    setSelectedCropVarietyId(variety.crop_variety_id);
    setIsClickedCropVariety(false);
  };

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
      setCropVarieties(data);
    } catch (error) {
      alert(`Error fetching crop categories: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // for metric
  const [isClickedCropMetric, setIsClickedCropMetric] = useState(false);
  const [selectedCropMetric, setSelectedCropMetric] = useState(
    product?.metric?.metric_system_name || "Select Metric"
  );
  const [selectedCropMetricId, setSelectedCropMetricId] = useState(
    product?.metric?.metric_system_id || null
  );
  const handleCropMetricSelect = (metric) => {
    if (!metric) return;
    setSelectedCropMetric(metric.metric_system_name);
    setSelectedCropMetricId(metric.metric_system_id);
    setIsClickedCropMetric(false);
  };

  // fetching metric
  const fetchCropMetric = async () => {
    try {
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/metric_systems`,
        {
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setCropMetrics(data);
    } catch (error) {
      alert(`Error fetching crop categories: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
    fetchCropSize();
    fetchCropVariety();
    fetchCropMetric();
  }, []);

  const cropAvailability = [
    {
      crop_availability_id: 1,
      crop_availability_name: "live",
    },
    {
      crop_availability_id: 2,
      crop_availability_name: "reviewing",
    },
    {
      crop_availability_id: 3,
      crop_availability_name: "violation",
    },
    {
      crop_availability_id: 4,
      crop_availability_name: "delisted",
    },
  ];

  // for crop size
  const [isClickedCropAvailability, setIsClickedCropAvailability] = useState(false);
  const [selectedCropAvailability, setSelectedCropAvailability] = useState(
    product?.availability || "Select Availability"
  );

  const handleCropAvailabilitySelect = (availability) => {
    setSelectedCropAvailability(availability.crop_availability_name);
    setIsClickedCropAvailability(false);
    setSearchAvailability("");
  };

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
    product?.crop_class || "Select Crop Class"
  );
  const handleCropClassSelect = (cropClass) => {
    if (!cropClass) return;
    setSelectedCropClass(cropClass.crop_class_name);
    setIsClickedCropClass(false);
  };

  const handleEditProduct = async () => {
    setLoading(true);
    const formData = new FormData();

    // Append form data fields
    formData.append("crop_name", selectedCropVariety);
    formData.append("crop_id", product.crop_id);
    formData.append("shop_id", product.shop_id);
    formData.append("crop_description", cropDescription);
    formData.append("availability", selectedCropAvailability);
    formData.append(
      "crop_image",
      imageSource
        ? {
            uri: imageSource.uri,
            type: "image/jpeg",
            name: "product-image.jpg",
          }
        : product.crop_image_url
    );
    formData.append("crop_price", parseFloat(cropPrice));
    formData.append("crop_quantity", parseInt(cropQuantity));
    formData.append(
      "crop_category_id",
      parseInt(selectedCategoryId) || product.category.crop_category_id
    );
    formData.append(
      "sub_category_id",
      parseInt(selectedSubCategoryId) ||
        product.subcategory.crop_sub_category_id
    );
    formData.append(
      "crop_size_id",
      parseInt(selectedCropSizeId) || product.size.crop_size_id
    );
    formData.append(
      "crop_variety_id",
      parseInt(selectedCropVarietyId) || product.variety.crop_variety_id
    );
    formData.append(
      "metric_system_id",
      parseInt(selectedCropMetricId) || product.metric.metric_system_id
    );
    formData.append("crop_class", selectedCropClass);
    formData.append("crop_availability", selectedCropAvailability);
    formData.append("negotiation_allowed", isEnabled ? "TRUE" : "FALSE");
    formData.append("minimum_negotiation", parseInt(minimumNegotiation));

    console.log("Form Data:", formData);

    try {
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/crops/${product.crop_id}`,
        {
          method: "PUT",
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
          body: formData,
        }
      );

      console.log("Response Status:", response.status);
      console.log("Response Headers:", response.headers);

      if (!response.ok) {
        const errorDetails = await response.json();
        console.log("Error Details:", errorDetails);
        throw new Error("Failed to update product");
      }

      const updatedProduct = await response.json();
      console.log("Updated Product:", updatedProduct);
      Alert.alert("Success!, Product Updated Successfully");
      setAlertVisible(true);
      navigation.navigate("My Products", { refresh: true });
    } catch (error) {
      console.error(`Error updating product: ${error.message}`);
    }
  };

  // Add these new states for modal and search
  const [activeField, setActiveField] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [modalData, setModalData] = useState([]);

  // Add validation regex
  const PRICE_REGEX = /^(?:[1-9]\d*|\d+\.\d{1,2}|0\.\d{1,2})$/;
  const QUANTITY_REGEX = /^[1-9]\d*$/;

  // Add error state
  const [errors, setErrors] = useState({});

  // Add input validation handler
  const handleInputValidation = (field, value) => {
    let error = "";
    
    if (!value) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
      return;
    }

    switch (field) {
      case "cropPrice":
        if (!PRICE_REGEX.test(value)) {
          error = "Enter a valid price greater than 0 (e.g., 100 or 100.00).";
        }
        break;
      case "cropQuantity":
        if (!QUANTITY_REGEX.test(value)) {
          error = "Enter a valid whole number greater than 0.";
        }
        break;
      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  // Add new state for searchable modal
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  // Update handleOpenModal function
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
        data = cropMetrics.map(metric => ({
          label: metric.metric_system_name,
          value: metric.metric_system_id,
          original: metric
        }));
        break;
    }
    setModalData(data);
    setActiveField(field);
    setSearchText('');
    setSearchModalVisible(true);
  };

  // Update handleModalItemSelect
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
        handleCropMetricSelect(item.original);
        break;
    }
    setSearchModalVisible(false);
  };

  const filteredItems = modalData.filter(item =>
    item.label.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <SafeAreaView className="bg-gray-100 flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="p-4">
          {product ? (
            <>
              {/* Image Section */}
              <View className="mb-4">
                <Text className="text-lg font-semibold mb-1">
                  Upload Crop Image <Text className="text-red-500">*</Text>
                  {errors.cropImage && (
                    <Text className="text-red-600 text-xs">{errors.cropImage}</Text>
                  )}
                </Text>
                {imageSource?.uri || product.crop_image_url ? (
                  <View className="mx-2 relative">
                    <Image
                      source={{ uri: imageSource?.uri || product.crop_image_url }}
                      className="w-full h-48 rounded-lg"
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      onPress={() => setModalVisible2(true)}
                      className="absolute bottom-2 right-2 bg-[#00B251] rounded-full w-8 h-8 justify-center items-center"
                    >
                      <Ionicons name="camera-outline" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    className="border-2 border-dashed border-[#00B251] rounded-lg p-4 flex items-center justify-center mx-2"
                    onPress={() => setModalVisible2(true)}
                  >
                    <View className="flex-row items-center">
                      <Ionicons name="camera-outline" size={24} color="#00B251" />
                      <Text className="text-[#00B251] mx-2 text-lg">/</Text>
                      <Ionicons name="image-outline" size={24} color="#00B251" />
                    </View>
                    <Text className="text-[#00B251] mt-2">Upload Image</Text>
                  </TouchableOpacity>
                )}
              </View>
              {/* Description Section */}
              <View className="mb-4">
                <Text className="text-lg font-semibold mb-1">
                  Crop Description <Text className="text-red-500">*</Text>
                  {errors.cropDescription && (
                    <Text className="text-red-600 text-xs">{errors.cropDescription}</Text>
                  )}
                </Text>
                <TextInput
                  className="w-full p-2 bg-white rounded-lg border border-gray-500 mx-2"
                  value={cropDescription}
                  onChangeText={setCropDescription}
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Category Section */}
              <View className="mb-4">
                <Text className="text-lg font-semibold mb-1">
                  Choose Category <Text className="text-red-500">*</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => handleOpenModal('category')}
                  className="flex-1 border border-gray-500 rounded-lg p-2 px-4 mx-2"
                >
                  <Text className="text-base pl-2">
                    {selectedCategory || "Select a category"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Sub Category Section */}
              <View className="mb-4">
                <Text className="text-lg font-semibold mb-1">
                  Choose Sub Category <Text className="text-red-500">*</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => handleOpenModal('subcategory')}
                  className="flex-1 border border-gray-500 rounded-lg p-2 px-4 mx-2"
                >
                  <Text className="text-base pl-2">
                    {selectedSubCategory || "Select a sub category"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Variety Section */}
              <View className="mb-4">
                <Text className="text-lg font-semibold mb-1">
                  Choose Variety <Text className="text-red-500">*</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => handleOpenModal('variety')}
                  className="flex-1 border border-gray-500 rounded-lg p-2 px-4 mx-2"
                >
                  <Text className="text-base pl-2">
                    {selectedCropVariety || "Select a variety"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Class Selection */}
              <View className="mb-4">
                <Text className="text-lg font-semibold mb-1">
                  Choose Class <Text className="text-red-500">*</Text>
                </Text>
                <View className="flex-row flex-wrap mx-2" style={{ gap: 8 }}>
                  {cropClasses.map((cropClass) => (
                    <TouchableOpacity
                      key={cropClass.crop_class_id}
                      onPress={() => handleCropClassSelect(cropClass)}
                      className={`px-4 py-2 rounded-lg ${
                        selectedCropClass === cropClass.crop_class_name
                          ? 'bg-[#00B251]'
                          : 'bg-[#8f8d8d]'
                      }`}
                    >
                      <Text className="text-white font-semibold text-center">
                        {cropClass.crop_class_name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Size Selection */}
              <View className="mb-4">
                <Text className="text-lg font-semibold mb-1">
                  Choose Size <Text className="text-red-500">*</Text>
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

              {/* Price Section */}
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
                    let formattedText = text;
                    if (text.startsWith('.')) {
                      formattedText = `0${text}`;
                    }
                    const parts = formattedText.split('.');
                    if (parts[1] && parts[1].length > 2) {
                      formattedText = `${parts[0]}.${parts[1].slice(0, 2)}`;
                    }
                    setCropPrice(formattedText);
                    handleInputValidation("cropPrice", formattedText);
                  }}
                />
              </View>

              {/* Quantity Section */}
              <View className="mb-4">
                <Text className="text-lg font-semibold mb-1">
                  Crop Quantity <Text className="text-red-500">*</Text>
                  {errors.cropQuantity && (
                    <Text className="text-red-600 text-xs">{errors.cropQuantity}</Text>
                  )}
                </Text>
                <TextInput
                  className="w-full p-2 bg-white rounded-lg border border-gray-500 mx-2"
                  keyboardType="numeric"
                  placeholder="Enter the quantity of the crop"
                  value={cropQuantity}
                  onChangeText={(text) => {
                    const numericText = text.replace(/[^0-9]/g, '');
                    setCropQuantity(numericText);
                    handleInputValidation("cropQuantity", numericText);
                  }}
                />
              </View>

              {/* Metric Section */}
              <View className="mb-4">
                <Text className="text-lg font-semibold mb-1">
                  Choose Metric <Text className="text-red-500">*</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => handleOpenModal('metric')}
                  className="w-full p-2 bg-white rounded-lg border border-gray-500 mx-2"
                >
                  <Text className="text-base pl-2">
                    {selectedCropMetric || "Select a metric"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Negotiation Section */}
              <View className="mb-4">
                <Text className="text-lg font-semibold mb-1">Open for Negotiation?</Text>
                <View className="flex-row items-center p-2">
                  <Text className="text-base mr-2">{isEnabled ? "Yes" : "No"}</Text>
                  <Switch
                    trackColor={{ false: "#767577", true: "#00b251" }}
                    thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
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

              {/* Crop Availability Section */}
              <View className="mb-4">
                <Text className="text-lg font-semibold mb-1">
                  Crop Availability <Text className="text-red-500">*</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => setIsClickedCropAvailability(true)}
                  className="w-full p-2 bg-white rounded-lg border border-gray-500 mx-2"
                >
                  <Text className="text-base pl-2">
                    {selectedCropAvailability}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Crop Availability Modal */}
              <Modal
                transparent={true}
                visible={isClickedCropAvailability}
                onRequestClose={() => {
                  setIsClickedCropAvailability(false);
                  setSearchAvailability("");
                }}
                animationType="slide"
              >
                <View className="flex-1 justify-center items-center bg-black/50">
                  <View className="bg-white w-[90%] rounded-lg p-4">
                    <Text className="text-lg font-semibold mb-4">
                      Select Availability
                    </Text>
                    
                    {/* Search Input */}
                    <View className="mb-4">
                      <TextInput
                        className="border border-gray-300 rounded-lg p-2"
                        placeholder="Search availability..."
                        value={searchAvailability}
                        onChangeText={setSearchAvailability}
                      />
                    </View>

                    {/* Availability List */}
                    <ScrollView className="max-h-64">
                      {cropAvailability
                        .filter(item =>
                          item.crop_availability_name
                            .toLowerCase()
                            .includes(searchAvailability.toLowerCase())
                        )
                        .map((availability) => (
                          <TouchableOpacity
                            key={availability.crop_availability_id}
                            className="py-3 border-b border-gray-200"
                            onPress={() => handleCropAvailabilitySelect(availability)}
                          >
                            <Text className="text-gray-700">
                              {availability.crop_availability_name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Cancel Button */}
                    <TouchableOpacity
                      className="mt-4 bg-gray-500 p-3 rounded-lg"
                      onPress={() => {
                        setIsClickedCropAvailability(false);
                        setSearchAvailability("");
                      }}
                    >
                      <Text className="text-white text-center font-semibold">
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              {/* Submit Button */}
              <TouchableOpacity
                className="bg-[#00B251] p-4 rounded-lg flex items-center mt-4"
                onPress={() => setModalVisible(true)}
              >
                <Text className="text-white text-base">Update Product</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text className="text-center text-gray-600">No item available</Text>
          )}
        </View>
      </ScrollView>

      {/* Search Modal */}
      <Modal
        visible={searchModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSearchModalVisible(false)}
      >
        <View className="flex-1 justify-center bg-black/50">
          <View className="bg-white mx-4 rounded-lg p-6 shadow-lg h-screen max-h-[80%]">
            <TextInput
              placeholder="Search..."
              value={searchText}
              onChangeText={setSearchText}
              className="border border-gray-300 p-3 rounded-lg mb-4"
            />
            <ScrollView>
              {filteredItems.map(item => (
                <TouchableOpacity
                  key={item.value}
                  onPress={() => handleModalItemSelect(item)}
                  className="px-4 py-3 border-b border-gray-200"
                >
                  <Text className="text-base">{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setSearchModalVisible(false)}
              className="mt-4 bg-gray-400 p-3 rounded-lg"
            >
              <Text className="text-white text-center font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Image Selection Modal */}
      <Modal
        visible={modalVisible2}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible2(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-[80%]">
            <Text className="text-lg font-semibold mb-4 text-center">
              Select Image Source
            </Text>
            
            <TouchableOpacity
              className="bg-[#00B251] p-3 rounded-lg mb-3"
              onPress={handleImagePickFromGallery}
            >
              <Text className="text-white text-center font-semibold">
                Choose from Gallery
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="bg-[#00B251] p-3 rounded-lg mb-3"
              onPress={handleImagePickFromCamera}
            >
              <Text className="text-white text-center font-semibold">
                Take a Photo
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="bg-gray-400 p-3 rounded-lg"
              onPress={() => setModalVisible2(false)}
            >
              <Text className="text-white text-center font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-4/5 bg-white p-6 rounded-lg">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Update Product
            </Text>
            <Text className="text-gray-600 mb-6">
              Do you really want to update this product?
            </Text>
            <View className="flex-row justify-end space-x-4">
              <TouchableOpacity
                className="px-4 py-2 rounded-md bg-gray-200"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-gray-700 text-base">No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-4 py-2 rounded-md bg-[#00B251]"
                onPress={() => {
                  setModalVisible(false);
                  handleEditProduct();
                }}
              >
                <Text className="text-white text-base">Yes</Text>
              </TouchableOpacity>
            </View>
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

export default FarmersProductDetailScreen;
