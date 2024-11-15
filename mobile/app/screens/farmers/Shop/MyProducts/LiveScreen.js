import React, { useEffect, useState, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
  View,
  TextInput, // Import TextInput for the search bar
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Reports from "../../../../components/Reports";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import { useFocusEffect } from "@react-navigation/native";
import LoadingAnimation from "../../../../components/LoadingAnimation";
import GenerateAllReports from "../../../../components/GenerateAllReports";
import Ionicons from "react-native-vector-icons/Ionicons";

function LiveScreen({ navigation }) {
  const [liveItems, setLiveItems] = useState([]); // State to hold live items
  const [filteredItems, setFilteredItems] = useState([]); // State for filtered items based on search
  const [loading, setLoading] = useState(true); // Loading state
  const [shopId, setShopId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State to capture search input

  // Function to fetch shop data
  const getAsyncShopData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("shopData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const shop = Array.isArray(parsedData) ? parsedData[0] : parsedData;
        setShopId(shop);

        const cropsResponse = await fetch(
          `${REACT_NATIVE_API_BASE_URL}/api/crops`,
          {
            headers: {
              "x-api-key": REACT_NATIVE_API_KEY,
            },
          }
        );

        const categoryResponse = await fetch(
          `${REACT_NATIVE_API_BASE_URL}/api/crop_categories`,
          {
            headers: {
              "x-api-key": REACT_NATIVE_API_KEY,
            },
          }
        );

        const subcategoryResponse = await fetch(
          `${REACT_NATIVE_API_BASE_URL}/api/crop_sub_categories`,
          {
            headers: {
              "x-api-key": REACT_NATIVE_API_KEY,
            },
          }
        );

        const varietyResponse = await fetch(
          `${REACT_NATIVE_API_BASE_URL}/api/crop_varieties`,
          {
            headers: {
              "x-api-key": REACT_NATIVE_API_KEY,
            },
          }
        );

        const varietySizeResponse = await fetch(
          `${REACT_NATIVE_API_BASE_URL}/api/crop_variety_sizes`,
          {
            headers: {
              "x-api-key": REACT_NATIVE_API_KEY,
            },
          }
        );

        const sizeResponse = await fetch(
          `${REACT_NATIVE_API_BASE_URL}/api/crop_sizes`,
          {
            headers: {
              "x-api-key": REACT_NATIVE_API_KEY,
            },
          }
        );

        const metricResponse = await fetch(
          `${REACT_NATIVE_API_BASE_URL}/api/metric_systems`,
          {
            headers: {
              "x-api-key": REACT_NATIVE_API_KEY,
            },
          }
        );

        const crops = await cropsResponse.json();
        const categories = await categoryResponse.json();
        const subcategories = await subcategoryResponse.json();
        const varieties = await varietyResponse.json();
        const variety_sizes = await varietySizeResponse.json();
        const sizes = await sizeResponse.json();
        const metrics = await metricResponse.json();

        const filteredLiveItems = crops.filter(
          (crop) =>
            crop.availability === "live" &&
            crop.crop_quantity !== 0 &&
            crop.shop_id === shop.shop_id
        );

        const combinedData = filteredLiveItems.map((crop) => {
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
        setLiveItems(combinedData);
        setFilteredItems(combinedData); // Set both live and filtered items
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
      const filteredData = liveItems.filter(
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
      setFilteredItems(liveItems); // Reset filtered items if search is cleared
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
      {/* Header section with Add Product button and Reports */}
      <View className="text-center">
        <GenerateAllReports shopId={shopId} dataType="Crops Report" />
      </View>
      <View className="flex-row justify-between items-center px-4 mb-4">
        {/* Add New Product button */}
        <TouchableOpacity
          className="bg-[#00B251] mt-auto py-3 px-3 rounded-lg shadow-lg"
          onPress={() => navigation.navigate("Add Product")}
        >
          <Text className="text-white font-semibold text-center">
            Add New Product
          </Text>
        </TouchableOpacity>

        {/* Reports section */}
        <Reports data={filteredItems} dataType="liveItems" />
      </View>

      {/* Search bar */}
      <View className="px-4 flex-row items-center bg-white rounded-lg shadow-md mx-2">
        <Ionicons name="search" size={20} color="#888" className="mr-2" />
        <TextInput
          placeholder="Search by name, category, or description..."
          value={searchTerm}
          onChangeText={handleSearch}
          className="flex-1 px-4 py-2"
        />
      </View>


      {/* Scroll view for live items */}
      <ScrollView className="p-4">
        {filteredItems.map((liveItem) => (
          <TouchableOpacity
            key={liveItem.crop_id}
            className="bg-white p-4 mb-4 rounded-xl shadow-md flex-row items-center transition-all duration-300 hover:shadow-lg"
            onPress={() =>
              navigation.navigate("Farmers Product Details", { liveItem })
            }
          >
            <Image
              source={{ uri: liveItem.crop_image_url }}
              className="w-16 h-16 rounded-lg mr-4 object-cover bg-gray-200"
            />

            {/* Crop Information */}
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800 mb-1">
                {liveItem.crop_name}
              </Text>
              <Text className="text-sm text-gray-600 mb-1">
                {liveItem.crop_description}
              </Text>

              {/* Category and Subcategory */}
              <View className="flex-row flex-wrap gap-2 mb-1">
                <Text className="text-xs font-medium text-[#00B251]">
                  Category:{" "}
                  <Text className="text-gray-800">
                    {liveItem.category
                      ? liveItem.category.crop_category_name
                      : "Unknown"}
                  </Text>
                </Text>
                <Text className="text-xs font-medium text-[#00B251]">
                  Subcategory:{" "}
                  <Text className="text-gray-800">
                    {liveItem.subcategory
                      ? liveItem.subcategory.crop_sub_category_name
                      : "Unknown"}
                  </Text>
                </Text>
              </View>

              {/* Variety, Size, and Class */}
              <View className="flex-row flex-wrap gap-2 mb-1">
                <Text className="text-xs font-medium text-[#00B251]">
                  Variety:{" "}
                  <Text className="text-gray-800">
                    {liveItem.variety
                      ? liveItem.variety.crop_variety_name
                      : "Unknown"}
                  </Text>
                </Text>
                <Text className="text-xs font-medium text-[#00B251]">
                  Size:{" "}
                  <Text className="text-gray-800">
                    {liveItem.size ? liveItem.size.crop_size_name : "Unknown"}
                  </Text>
                </Text>
                <Text className="text-xs font-medium text-[#00B251]">
                  Class:{" "}
                  <Text className="text-gray-800">
                    {liveItem.crop_class || "Unknown"}
                  </Text>
                </Text>
                <Text className="text-xs font-medium text-[#00B251]">
                  Quantity:{" "}
                  <Text className="text-gray-800">
                    {liveItem.crop_quantity} {liveItem.metric.metric_system_symbol}
                  </Text>
                </Text>
                <Text className="text-xs font-medium text-[#00B251]">
                  Negotiation:{" "}
                  <Text className="text-gray-800">
                    {liveItem.negotiation_allowed ? "Allowed" : "Not Allowed"}
                  </Text>
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default LiveScreen;
