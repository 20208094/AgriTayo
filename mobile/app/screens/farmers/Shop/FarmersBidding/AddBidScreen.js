import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons"; // Import icon
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import { ScrollView } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";

// Constants for validation
const NAME_REGEX = /^[A-Za-z\s]{3,50}$/;
const DESCRIPTION_REGEX = /^.{5,200}$/;
const PRICE_REGEX = /^(?:[1-9]\d*|\d+\.\d{1,2}|0\.\d{1,2})$/;

function AddBidScreen({ navigation }) {
  // for inputs
  const [shopData, setShopData] = useState(null);
  const [bidCreationDate, setBidCreationDate] = useState("");
  const [bidDescription, setBidDescription] = useState("");
  const [bidName, setBidName] = useState("");
  const [bidStartingPrice, setBidStartingPrice] = useState("");
  const [bidMinimumIncrement, setBidMinimumIcrement] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [numberOfBids, setNumberOfBids] = useState(0);
  const [metricSystem, setMetricSystem] = useState([])
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [errors, setErrors] = useState({});

  const handleValidation = (field, value) => {
    // If value is empty, clear the error for this field
    if (!value || value.trim() === '') {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[field];
        return newErrors;
      });
      return;
    }

    let error = "";
    switch (field) {
      case "bidName":
        if (!NAME_REGEX.test(value)) {
          error = "Product Name must be 3-50 characters long and only letters.";
        }
        break;
      case "bidDescription":
        if (!DESCRIPTION_REGEX.test(value)) {
          error = "Description must be 5-200 characters.";
        }
        break;
      case "bidStartingPrice":
        if (!PRICE_REGEX.test(value)) {
          error = "Enter a valid price greater than 0 (e.g., 100 or 100.00).";
        }
        break;
      case "bidMinimumIncrement":
        if (!PRICE_REGEX.test(value)) {
          error = "Enter a valid minimum bid increment greater than 0 (e.g., 5 or 5.00).";
        }
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  // for end date
  const [endDate, setEndDate] = useState("");
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState("");

  // Add new state variables for time
  const [showTime, setShowTime] = useState(false);
  const [time, setTime] = useState(new Date());
  const [formattedTime, setFormattedTime] = useState("");

  // Modify handleDateChange to ensure proper date formatting
  const handleDateChange = (event, selectedDate) => {
    if (event.type === "set") {
      const currentDate = selectedDate || date;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (currentDate < today) {
        setErrors((prev) => ({
          ...prev,
          endDate: "The selected date is in the past. Please choose a future date.",
        }));
      } else {
        setShow(false);
        setDate(currentDate);
        // Format date for display
        setFormattedDate(currentDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }));
        setShowTime(true);
        setErrors((prev) => ({ ...prev, endDate: "" }));
      }
    } else {
      setShow(false);
    }
  };

  // Modify handleTimeChange to ensure proper datetime formatting
  const handleTimeChange = (event, selectedTime) => {
    if (event.type === "set") {
      const currentTime = selectedTime || time;
      setShowTime(false);
      setTime(currentTime);
      
      // Format time for display with AM/PM
      const formattedTimeStr = currentTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Manila' // Set to Philippines timezone
      });
      setFormattedTime(formattedTimeStr);
      
      // Combine date and time with proper timezone handling
      const combinedDateTime = new Date(date);
      combinedDateTime.setHours(currentTime.getHours());
      combinedDateTime.setMinutes(currentTime.getMinutes());
      combinedDateTime.setSeconds(0);
      combinedDateTime.setMilliseconds(0);

      // Convert to UTC for storage while preserving the local time
      const offset = combinedDateTime.getTimezoneOffset() * 60000; // Convert offset to milliseconds
      const localISOTime = new Date(combinedDateTime.getTime() - offset).toISOString();
      
      setEndDate(localISOTime);
    } else {
      setShowTime(false);
    }
  };

  // for categories
  const [categories, setCategories] = useState([]);
  const [isClickedCategory, setIsClickedCategory] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Category");

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.crop_category_name);
    setSelectedCategoryId(category.crop_category_id);
    setIsClickedCategory(false);
    setErrors((prev) => ({ ...prev, selectedCategoryId: "" }));
    fetchSubCategories(category.crop_category_id);
  };

  // for sub categories
  const [subCategories, setSubCategories] = useState([]);
  const [isClickedSubCategory, setIsClickedSubCategory] = useState(false);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState("Subcategory");

  const handleSubCategorySelect = (subCategory) => {
    setSelectedSubCategory(subCategory.crop_sub_category_name);
    setSelectedSubCategoryId(subCategory.crop_sub_category_id);
    setIsClickedSubCategory(false);
    setErrors((prev) => ({ ...prev, selectedSubCategoryId: "" }));
  };

  // for metric system
  const [isClickedMetricSystem, setIsClickedMetricSystem] = useState(false);
  const [selectedMetricSystem, setSelectedMetricSystem] = useState("Metric");
  const [selectedMetricSystemId, setSelectedMetricSystemId] = useState(null);

  const handleMetricSelect = (metric) => {
    setSelectedMetricSystem(metric.metric_system_name);
    setSelectedMetricSystemId(metric.metric_system_id);
    setIsClickedMetricSystem(false);
    setErrors((prev) => ({ ...prev, selectedMetricSystemId: "" }));
  };

  // for fetching
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
    }
  };

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

  const fetchMetricSystem = async () => {
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
      setMetricSystem(data);
    } catch (error) {
      alert(`Error fetching metric systems: ${error.message}`);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
      fetchSubCategories();
      getAsyncShopData();
      fetchMetricSystem();
    }, [])
  );

  useEffect(() => {
    (async () => {
      // Request media library permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const chooseImageSource = () => {
    setModalVisible(true);
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

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      const isValidSize = await validateImageSize(imageUri);
      if (isValidSize) {
        setImageUri(imageUri);
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

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      const isValidSize = await validateImageSize(imageUri);
      if (isValidSize) {
        setImageUri(imageUri);
        setModalVisible(false);
      }
    }
  };

  const openModal = () => setModalVisible1(true);
  const closeModal = () => setModalVisible1(false);

  const removeImage = () => {
    setImageUri(null);
  };

  const handleAddBid = async () => {
    // Final validation check
    const errors = {};

    // Field presence and regex validation
    if (!bidName) {
      errors.bidName = "Product Name is required.";
    } else if (!NAME_REGEX.test(bidName)) {
      errors.bidName = "Product Name must be 3-50 characters long and only letters.";
    }

    if (!bidDescription) {
      errors.bidDescription = "Product Description is required.";
    } else if (!DESCRIPTION_REGEX.test(bidDescription)) {
      errors.bidDescription = "Description must be 5-200 characters.";
    }

    if (!bidStartingPrice) {
      errors.bidStartingPrice = "Bidding Starting Price is required.";
    } else if (!PRICE_REGEX.test(bidStartingPrice)) {
      errors.bidStartingPrice = "Enter a valid price greater than 0 (e.g., 100 or 100.00).";
    }

    if (!bidMinimumIncrement) {
      errors.bidMinimumIncrement = "Minimum Bid Increment is required.";
    } else if (!PRICE_REGEX.test(bidMinimumIncrement)) {
      errors.bidMinimumIncrement = "Enter a valid minimum bid increment greater than 0 (e.g., 5 or 5.00).";
    }

    if (!imageUri) { 
      errors.imageUri = "Select an image."; 
    }
    
    if (!endDate) {
      errors.endDate = "Bidding End Date is required.";
    }
    
    if (!selectedCategoryId) {
      errors.selectedCategoryId = "Select a category.";
    }
    
    if (!selectedSubCategoryId) {
      errors.selectedSubCategoryId = "Select a sub-category.";
    }

    // If there are errors, show alert and return without submitting
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      setAlertMessage("Please fill in all the required fields correctly.");
      setAlertVisible(true);
      return;
    }

    // Preparing FormData for submission
    const formData = new FormData();
    formData.append("shop_id", shopData.shop_id);
    formData.append("creation_date", bidCreationDate);
    formData.append("end_date", endDate);
    formData.append("bid_image", {
      uri: imageUri,
      name: "shop.jpg",
      type: "image/jpeg",
    });
    formData.append("bid_description", bidDescription);
    formData.append("bid_name", bidName);
    formData.append("bid_category_id", selectedCategoryId);
    formData.append("bid_subcategory_id", selectedSubCategoryId);
    formData.append("bid_starting_price", bidStartingPrice);
    formData.append("bid_minimum_increment", bidMinimumIncrement);
    formData.append("bid_current_highest", bidStartingPrice);
    formData.append("number_of_bids", numberOfBids);

    // Submit the form
    try {
      setLoading(true);
      console.log("Submitting bid data: ", formData);

      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/biddings`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          "x-api-key": REACT_NATIVE_API_KEY,
        },
        body: formData,
      });

      const responseText = await response.text();
      console.log("Response Text: ", responseText);

      if (response.ok) {
        const responseData = JSON.parse(responseText);
        console.log("Response data: ", responseData);
        setAlertMessage("Bidding added successfully!");
        setAlertVisible(true);
      } else {
        console.error("Error adding bidding: ", responseText);
        setAlertMessage("Failed to add bidding. Please try again.");
        setAlertVisible(true);
      }
    } catch (error) {
      console.error(`An error occurred while adding the bid: ${error.message}`);
      setAlertMessage("An error occurred. Please try again.");
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
    }
    setModalVisible2(false);
  };

  const filteredItems = modalData.filter(item =>
    item.label.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="w-full max-w-md mx-auto">
          {/* Product Name */}
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-1">
              Product Name <Text className="text-red-500">*</Text>
              {errors.bidName && <Text className="text-red-600 text-xs">{errors.bidName}</Text>}
            </Text>
            <TextInput
              placeholder="e.g. Vegetables, Potatoes, etc."
              className="w-full p-2 bg-white rounded-lg border border-gray-500 mx-2"
              value={bidName}
              onChangeText={(text) => {
                setBidName(text);
                handleValidation("bidName", text);
              }}
            />
          </View>

          {/* Product Description */}
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-1">
              Product Description <Text className="text-red-500">*</Text>
              {errors.bidDescription && <Text className="text-red-600 text-xs">{errors.bidDescription}</Text>}
            </Text>
            <TextInput
              placeholder="Describe your product"
              multiline
              className="w-full p-2 bg-white rounded-lg border border-gray-500 mx-2"
              value={bidDescription}
              onChangeText={(text) => {
                setBidDescription(text);
                handleValidation("bidDescription", text);
              }}
            />
          </View>

          {/* Category Selection */}
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-1">
              Choose Category <Text className="text-red-500">*</Text>
              {errors.selectedCategoryId && <Text className="text-red-600 text-xs">{errors.selectedCategoryId}</Text>}
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
              {errors.selectedSubCategoryId && <Text className="text-red-600 text-xs">{errors.selectedSubCategoryId}</Text>}
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

          {/* Starting Price */}
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-1">
              Starting Price <Text className="text-red-500">*</Text>
              {errors.bidStartingPrice && <Text className="text-red-600 text-xs">{errors.bidStartingPrice}</Text>}
            </Text>
            <TextInput
              placeholder="₱ 0.00"
              keyboardType="numeric"
              className="w-full p-2 bg-white rounded-lg border border-gray-500 mx-2"
              value={bidStartingPrice}
              onChangeText={(text) => {
                let formattedText = text;
                if (text.startsWith('.')) {
                  formattedText = `0${text}`;
                }
                const parts = formattedText.split('.');
                if (parts[1] && parts[1].length > 2) {
                  formattedText = `${parts[0]}.${parts[1].slice(0, 2)}`;
                }
                setBidStartingPrice(formattedText);
                handleValidation("bidStartingPrice", formattedText);
              }}
            />
          </View>

          {/* Minimum Bid Increment */}
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-1">
              Minimum Bid Increment <Text className="text-red-500">*</Text>
              {errors.bidMinimumIncrement && <Text className="text-red-600 text-xs">{errors.bidMinimumIncrement}</Text>}
            </Text>
            <TextInput
              placeholder="₱ 0.00"
              keyboardType="numeric"
              className="w-full p-2 bg-white rounded-lg border border-gray-500 mx-2"
              value={bidMinimumIncrement}
              onChangeText={(text) => {
                let formattedText = text;
                if (text.startsWith('.')) {
                  formattedText = `0${text}`;
                }
                const parts = formattedText.split('.');
                if (parts[1] && parts[1].length > 2) {
                  formattedText = `${parts[0]}.${parts[1].slice(0, 2)}`;
                }
                setBidMinimumIcrement(formattedText);
                handleValidation("bidMinimumIncrement", formattedText);
              }}
            />
          </View>

          {/* End Date Selection - Keep existing implementation */}
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-1">
              Bidding End Date <Text className="text-red-500">*</Text>
              {errors.endDate && <Text className="text-red-600 text-xs">{errors.endDate}</Text>}
            </Text>
            <TouchableOpacity
              onPress={() => setShow(true)}
              className="w-full border border-gray-500 rounded-lg p-2 px-4 mx-2"
            >
              <Text className="text-base pl-2">
                {formattedDate ? `${formattedDate} ${formattedTime}` : "Select Date and Time"}
              </Text>
            </TouchableOpacity>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                is24Hour={false}
                display="default"
                onChange={handleDateChange}
              />
            )}
            {showTime && (
              <DateTimePicker
                testID="timeTimePicker"
                value={time}
                mode="time"
                is24Hour={false}
                display="spinner"
                onChange={handleTimeChange}
              />
            )}
          </View>

          {/* Image Upload Section */}
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-1">
              Upload Image <Text className="text-red-500">*</Text>
              {errors.imageUri && <Text className="text-red-600 text-xs">{errors.imageUri}</Text>}
            </Text>
            <TouchableOpacity
              className="border border-dashed border-green-600 rounded-md p-4 flex-row justify-center items-center"
              onPress={chooseImageSource}
            >
              <Ionicons name="camera" size={24} color="#00b251" />
              <Text className="mx-2 text-lg text-[#00b251]"> / </Text>
              <Ionicons name="image-outline" size={24} color="#00b251" />
            </TouchableOpacity>

            {imageUri && (
              <View className="mt-4">
                <Image
                  source={{ uri: imageUri }}
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

          {/* Add Bid Button */}
          <TouchableOpacity 
            className="bg-[#00B251] p-4 rounded-lg flex items-center mt-4"
            onPress={() => setModalVisible1(true)}
          >
            <Text className="text-white text-base">Add Bid</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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

            <TouchableOpacity
              onPress={() => setModalVisible2(false)}
              className="p-4 border-t border-gray-200"
            >
              <Text className="text-center text-gray-600 font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        transparent={true}
        visible={modalVisible1}
        animationType="slide"
        onRequestClose={() => setModalVisible1(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-4/5 bg-white p-6 rounded-lg">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Add Bid
            </Text>
            <Text className="text-gray-600 mb-6">
              Do you really want to add this bid?
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
                  handleAddBid();
                }}
              >
                <Text className="text-white text-base">Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
        onRequestClose={() => {
          setAlertVisible(false);
          if (alertMessage === "Bidding added successfully!") {
            navigation.navigate("Bidding");
          }
        }}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-[80%]">
            <Text className="text-lg mb-4 text-center">{alertMessage}</Text>
            <TouchableOpacity
              className="bg-[#00B251] p-3 rounded-lg"
              onPress={() => {
                setAlertVisible(false);
                if (alertMessage === "Bidding added successfully!") {
                  navigation.navigate("Bidding");
                }
              }}
            >
              <Text className="text-white text-center font-semibold">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Keep existing modals */}
      {/* ... confirmation modal ... */}
      {/* ... date/time picker modals ... */}
    </SafeAreaView>
  );
}

export default AddBidScreen;
