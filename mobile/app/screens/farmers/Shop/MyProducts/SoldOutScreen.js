import React, { useEffect, useState, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
  View,
  TextInput, // Import TextInput for the search bar
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import Reports from "../../../../components/Reports";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env"; // Import API constants
import LoadingAnimation from "../../../../components/LoadingAnimation";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";

function SoldOutScreen({ navigation }) {
  const [soldOutItems, setSoldOutItems] = useState([]); // State to hold sold-out items
  const [filteredItems, setFilteredItems] = useState([]); // State for filtered items based on search
  const [loading, setLoading] = useState(true); // Loading state
  const [searchTerm, setSearchTerm] = useState(""); // State to capture search input

  // Function to fetch shop data and sold-out crops
  const getAsyncShopData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("shopData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const shop = Array.isArray(parsedData) ? parsedData[0] : parsedData;

        // Fetch crops and related data from API
        const cropsResponse = await fetch(
          `${REACT_NATIVE_API_BASE_URL}/api/crops`,
          {
            headers: { "x-api-key": REACT_NATIVE_API_KEY },
          }
        );
        const categoryResponse = await fetch(
          `${REACT_NATIVE_API_BASE_URL}/api/crop_categories`,
          {
            headers: { "x-api-key": REACT_NATIVE_API_KEY },
          }
        );
        const subcategoryResponse = await fetch(
          `${REACT_NATIVE_API_BASE_URL}/api/crop_sub_categories`,
          {
            headers: { "x-api-key": REACT_NATIVE_API_KEY },
          }
        );
        const varietyResponse = await fetch(
          `${REACT_NATIVE_API_BASE_URL}/api/crop_varieties`,
          {
            headers: { "x-api-key": REACT_NATIVE_API_KEY },
          }
        );
        const varietySizeResponse = await fetch(
          `${REACT_NATIVE_API_BASE_URL}/api/crop_variety_sizes`,
          {
            headers: { "x-api-key": REACT_NATIVE_API_KEY },
          }
        );
        const sizeResponse = await fetch(
          `${REACT_NATIVE_API_BASE_URL}/api/crop_sizes`,
          {
            headers: { "x-api-key": REACT_NATIVE_API_KEY },
          }
        );
        const metricResponse = await fetch(
          `${REACT_NATIVE_API_BASE_URL}/api/metric_systems`,
          {
            headers: { "x-api-key": REACT_NATIVE_API_KEY },
          }
        );

        const crops = await cropsResponse.json();
        const categories = await categoryResponse.json();
        const subcategories = await subcategoryResponse.json();
        const varieties = await varietyResponse.json();
        const variety_sizes = await varietySizeResponse.json();
        const sizes = await sizeResponse.json();
        const metrics = await metricResponse.json();

        // Filter sold-out items
        const filteredSoldOutItems = crops.filter(
          (crop) =>
            crop.availability === "live" &&
            crop.crop_quantity === 0 &&
            crop.shop_id === shop.shop_id
        );

        const combinedData = filteredSoldOutItems.map((crop) => {
          const categoryData = categories.find(
            (cat) => cat.crop_category_id === crop.category_id
          );
          const subcategoryData = subcategories.find(
            (sub) => sub.crop_sub_category_id === crop.sub_category_id
          );
          const varietyData = varieties.find(
            (variety) => variety.crop_variety_id === crop.crop_variety_id
          );
          const sizeData = variety_sizes.find(
            (varSize) => varSize.crop_variety_id === crop.crop_variety_id
          );
          const actualSize = sizes.find(
            (size) =>
              size.crop_size_id === (sizeData ? sizeData.crop_size_id : null)
          );
          const metricData = metrics.find(
            (metric) => metric.metric_system_id === crop.metric_system_id
          );

          return {
            ...crop,
            category: categoryData ? categoryData : null,
            subcategory: subcategoryData ? subcategoryData : null,
            variety: varietyData ? varietyData : null,
            size: actualSize ? actualSize : null,
            metric: metricData ? metricData : null,
          };
        });

        setSoldOutItems(combinedData);
        setFilteredItems(combinedData); // Set both sold-out and filtered items
      }
    } catch (error) {
      console.error("Error fetching shops:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle search input
  const handleSearch = (text) => {
    setSearchTerm(text);
    if (text) {
      const filteredData = soldOutItems.filter(
        (item) =>
          item.crop_name.toLowerCase().includes(text.toLowerCase()) ||
          (item.category &&
            item.category.crop_category_name
              .toLowerCase()
              .includes(text.toLowerCase())) ||
          (item.subcategory &&
            item.subcategory.crop_sub_category_name
              .toLowerCase()
              .includes(text.toLowerCase())) ||
          item.crop_description.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredItems(filteredData);
    } else {
      setFilteredItems(soldOutItems); // Reset filtered items if search is cleared
    }
  };

  useFocusEffect(
    useCallback(() => {
      getAsyncShopData();
    }, [])
  );

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Reports section */}
      <View className="text-center mb-4">
        <Reports data={filteredItems} dataType="soldOutItems" />
      </View>
      {/* Search bar */}
      <View className="px-4 flex-row items-center bg-white rounded-lg shadow-md mx-2 mb-2">
        <Ionicons name="search" size={20} color="#888" className="mr-2" />
        <TextInput
          placeholder="Search by name, category, or description..."
          value={searchTerm}
          onChangeText={handleSearch}
          className="flex-1 px-4 py-2"
        />
      </View>

      {/* Scroll view for sold-out items */}
      <ScrollView className="p-4 mb-16">
        {filteredItems.map((soldOutItem) => (
          <TouchableOpacity
            key={soldOutItem.crop_id}
            className="bg-white p-4 mb-4 rounded-xl shadow-md flex-row items-center transition-all duration-300 hover:shadow-lg"
            onPress={() =>
              navigation.navigate("Farmers Product Details", { soldOutItem })
            }
          >
            {/* Crop Image */}
            <Image
              source={{ uri: soldOutItem.crop_image_url || placeholderimg }}
              className="w-16 h-16 rounded-lg mr-4 object-cover bg-gray-200"
            />

            {/* Crop Information */}
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800 mb-1">
                {soldOutItem.crop_name}
              </Text>
              <Text className="text-sm text-gray-600 mb-1">
                {soldOutItem.crop_description}
              </Text>

              {/* Category and Subcategory */}
              <View className="mb-1">
                <Text className="text-xs font-medium text-green-600">
                  Category:{" "}
                  <Text className="text-gray-800">
                    {soldOutItem.category
                      ? soldOutItem.category.crop_category_name
                      : "Unknown"}
                  </Text>
                </Text>
                </View>
                <View className='mb-1'>
                <Text className="text-xs font-medium text-green-600">
                  Subcategory:{" "}
                  <Text className="text-gray-800">
                    {soldOutItem.subcategory
                      ? soldOutItem.subcategory.crop_sub_category_name
                      : "Unknown"}
                  </Text>
                </Text>
              </View>

              {/* Variety, Size, and Class */}
              <View className="mb-1">
                <Text className="text-xs font-medium text-green-600">
                  Variety:{" "}
                  <Text className="text-gray-800">
                    {soldOutItem.variety
                      ? soldOutItem.variety.crop_variety_name
                      : "Unknown"}
                  </Text>
                </Text>
                </View>
                <View className='mb-1'>
                <Text className="text-xs font-medium text-green-600">
                  Size:{" "}
                  <Text className="text-gray-800">
                    {soldOutItem.size
                      ? soldOutItem.size.crop_size_name
                      : "Unknown"}
                  </Text>
                </Text>
                </View>
                <View className='mb-1'>
                <Text className="text-xs font-medium text-green-600">
                  Class:{" "}
                  <Text className="text-gray-800">
                    {soldOutItem.crop_class || "Unknown"}
                  </Text>
                </Text>
              </View>

              {/* Quantity and Negotiation */}
              <View className="mb-1">
                <Text className="text-xs font-medium text-[#00B251]">
                  Quantity:{" "}
                  <Text className="text-gray-800">
                    {soldOutItem.crop_quantity}
                  </Text>
                </Text>
                </View>
                <View className='mb-1'>
                <Text className="text-xs font-medium text-[#00B251]">
                  Negotiation:{" "}
                  <Text className="text-gray-800">
                    {soldOutItem.negotiation_allowed
                      ? "Allowed"
                      : "Not Allowed"}
                  </Text>
                </Text>
              </View>

              {/* Price, Weight */}
              <View className="flex-row justify-between">
                <Text className="text-xs font-medium text-green-600">
                  Weight:{" "}
                  <Text className="text-gray-800">
                    {soldOutItem.metric
                      ? `${soldOutItem.metric.metric_system_name}`
                      : "Unknown"}
                  </Text>
                </Text>
                <Text className="text-sm font-semibold text-[#00B251]">
                  ₱{soldOutItem.crop_price}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default SoldOutScreen;
