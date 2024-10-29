import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons"; // Import icon
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import { ScrollView } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";

function AddBidScreen({navigation}) {
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

  // for end date
  const [endDate, setEndDate] = useState("");
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState("");

  const handleDateChange = (event, selectedDate) => {
    if (event.type === "set") {
      const currentDate = selectedDate || date;
      setShow(false);
      setDate(currentDate);
      setFormattedDate(currentDate.toLocaleDateString());
      setEndDate(currentDate.toLocaleDateString());
    } else {
      setShow(false);
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
  };

  // for metric system
  const [isClickedMetricSystem, setIsClickedMetricSystem] = useState(false);
  const [selectedMetricSystem, setSelectedMetricSystem] = useState("Metric");
  const [selectedMetricSystemId, setSelectedMetricSystemId] = useState(null);

  const handleMetricSelect = (metric) => {
    setSelectedMetricSystem(metric.metric_system_name);
    setSelectedMetricSystemId(metric.metric_system_id);
    setIsClickedMetricSystem(false);
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
    Alert.alert(
      "Select Image Source",
      "Choose whether to take a photo or select from gallery",
      [
        {
          text: "Camera",
          onPress: () => selectImage("camera"),
        },
        {
          text: "Gallery",
          onPress: () => selectImage("gallery"),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const selectImage = async (source) => {
    if (!hasPermission) {
      Alert.alert(
        "Permission Denied",
        "You need to grant access to the media library to select images."
      );
      return;
    }

    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    };

    let result;
    if (source === "camera") {
      result = await ImagePicker.launchCameraAsync(options);
    } else {
      result = await ImagePicker.launchImageLibraryAsync(options);
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    } else {
      console.log("User cancelled image picker or no image selected");
    }
  };

  const removeImage = () => {
    setImageUri(null);
  };

  const handleAddBid = async () => {

    if (
      !bidName ||
      !bidDescription ||
      !imageUri ||
      !endDate ||
      !bidStartingPrice ||
      !selectedCategoryId ||
      !selectedSubCategoryId ||
      !selectedMetricSystemId ||
      !bidMinimumIncrement ||
      !bidStartingPrice 
    ) {
      alert("Please fill in all the required fields.");
      return;
    }

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
    formData.append('bid_category_id', selectedCategoryId)
    formData.append("bid_subcategory_id", selectedSubCategoryId);
    formData.append("bid_starting_price", bidStartingPrice);
    formData.append("bid_minimum_increment", bidMinimumIncrement);
    formData.append("bid_current_highest", bidStartingPrice);
    formData.append("number_of_bids", numberOfBids);
    formData.append('metric_system_id', selectedMetricSystemId)

    try {
      setLoading(true);
      console.log("Submitting product data: ", formData);

      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/biddings`,
        {
          method: "POST",
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
          body: formData,
        }
      );

      const responseText = await response.text();
      console.log("Response Text: ", responseText);


      if (response.ok) {
        const responseData = JSON.parse(responseText);
        console.log("Response data: ", responseData);
        alert("Bidding added successfully!");
        navigation.navigate("Bidding");
      } else {
        console.error("Error adding bidding: ", responseText);
        alert("Failed to add bidding. Please try again.");
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
          {/* Product Name */}
          <View className="mb-4">
            <Text className="text-base text-gray-700">Product Name</Text>
            <TextInput
              placeholder="e.g. Vegetables, Potatoes, etc."
              className="border border-gray-300 rounded-lg p-2 mt-1"
              value={bidName}
              onChangeText={setBidName}
            />
          </View>
  
          {/* Product Description */}
          <View className="mb-4">
            <Text className="text-base text-gray-700">Product Description</Text>
            <TextInput
              placeholder="Describe your product"
              multiline
              className="border border-gray-300 rounded-lg p-2 mt-1"
              value={bidDescription}
              onChangeText={setBidDescription}
            />
          </View>
  
          {/* Crop Category Selector */}
          <View className="mb-4">
            <Text className="text-base text-gray-700">Select Crop Category</Text>
            <TouchableOpacity
              className="flex-row items-center border border-gray-300 p-2 rounded-lg"
              onPress={() => setIsClickedCategory(!isClickedCategory)}
            >
              <Text className="text-base text-gray-700 flex-1">
                {selectedCategory}
              </Text>
              <Ionicons name="chevron-down" size={20} color="gray" className="ml-2" />
            </TouchableOpacity>
            {isClickedCategory && (
              <View className="border border-gray-300 rounded-lg p-2 mt-1">
                {categories.map((category) => (
                  <TouchableOpacity
                    className="p-2"
                    onPress={() => handleCategorySelect(category)}
                    key={category.crop_category_id}
                  >
                    <Text className="text-base">{category.crop_category_name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
  
          {/* Sub Category Selector */}
          <View className="mb-4">
            <Text className="text-base text-gray-700">Select Sub Category</Text>
            <TouchableOpacity
              className="flex-row items-center border border-gray-300 p-2 rounded-lg"
              onPress={() => setIsClickedSubCategory(!isClickedSubCategory)}
            >
              <Text className="text-base text-gray-700 flex-1">
                {selectedSubCategory}
              </Text>
              <Ionicons name="chevron-down" size={20} color="gray" className="ml-2" />
            </TouchableOpacity>
            {isClickedSubCategory && (
              <View className="border border-gray-300 rounded-lg p-2 mt-1">
                {subCategories.map((subCategory) => (
                  <TouchableOpacity
                    className="p-2"
                    onPress={() => handleSubCategorySelect(subCategory)}
                    key={subCategory.crop_sub_category_id}
                  >
                    <Text className="text-base">
                      {subCategory.crop_sub_category_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
  
          {/* Image Upload */}
          <View className="mb-4">
            <Text className='text-base text-gray-700'>Select Image</Text>
            <TouchableOpacity
              className="border border-gray-300 rounded-lg p-2"
              onPress={chooseImageSource}
            >
              <Text className="text-base text-gray-700">Upload Image</Text>
            </TouchableOpacity>
            {imageUri && (
              <View className="relative mt-4">
                <Image
                  source={{ uri: imageUri }}
                  className="w-full h-40 rounded-lg"
                  resizeMode="contain"
                />
                <TouchableOpacity
                  onPress={removeImage}
                  className="absolute top-2 right-2 bg-red-600 rounded-full p-1"
                >
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </View>
  
          {/* Bidding End Date */}
          <View className="mb-4">
            <Text className="text-base text-gray-700">Bidding End Date</Text>
            <TouchableOpacity
              onPress={() => setShow(true)}
              className="w-full p-3  bg-white rounded-lg shadow-md"
            >
              <View className='border border-gray-300 rounded-lg p-2'>
              <Text className="text-gray-800">
                {formattedDate || "Select Date"}
              </Text>
              </View>
            </TouchableOpacity>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>
  
          {/* Bidding Price */}
          <View className="mb-4">
            <Text className="text-base text-gray-700">Bidding Starting Price</Text>
            <TextInput
              placeholder="₱ 0.00"
              keyboardType="numeric"
              className="border border-gray-300 rounded-lg p-2 mt-1"
              value={bidStartingPrice}
              onChangeText={setBidStartingPrice}
            />
          </View>
  
          {/* Minimum Bid Increment */}
          <View className="mb-4">
            <Text className="text-base text-gray-700">Enter Minimum Bid</Text>
            <TextInput
              placeholder="₱ 0.00"
              keyboardType="numeric"
              className="border border-gray-300 rounded-lg p-2 mt-1"
              value={bidMinimumIncrement}
              onChangeText={setBidMinimumIcrement}
            />
          </View>
  
          {/* Metric Selector */}
          <View className="mb-4">
            <Text className="text-base text-gray-700">Select Metric</Text>
            <TouchableOpacity
              className="flex-row items-center border border-gray-300 p-2 rounded-lg"
              onPress={() => setIsClickedMetricSystem(!isClickedMetricSystem)}
            >
              <Text className="text-base text-gray-700 flex-1">
                {selectedMetricSystem}
              </Text>
              <Ionicons name="chevron-down" size={20} color="gray" className="ml-2" />
            </TouchableOpacity>
            {isClickedMetricSystem && (
              <View className="border border-gray-300 rounded-lg p-2 mt-1">
                {metricSystem.map((metric) => (
                  <TouchableOpacity
                    className="p-2"
                    onPress={() => handleMetricSelect(metric)}
                    key={metric.metric_system_id}
                  >
                    <Text className="text-base">{metric.metric_system_name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
  
          {/* Add Bid Button */}
          <TouchableOpacity
            className="bg-green-600 p-4 rounded-lg flex items-center mt-4"
            onPress={() => {
              Alert.alert(
                "Confirm Add Bid",
                "Do you really want to add this bid?",
                [
                  {
                    text: "No",
                    onPress: () => console.log("Bidding addition canceled"),
                    style: "cancel",
                  },
                  {
                    text: "Yes",
                    onPress: handleAddBid,
                  },
                ],
                { cancelable: false }
              );
            }}
          >
            <Text className="text-white text-base">Add Bid</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );  
}

export default AddBidScreen;
