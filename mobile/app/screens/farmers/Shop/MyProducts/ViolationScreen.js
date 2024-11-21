import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
  View,
  Alert,
  TextInput, // Import TextInput for search bar
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Reports from "../../../../components/Reports";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import placeholderimg from "../../../../assets/placeholder.png";
import LoadingAnimation from "../../../../components/LoadingAnimation";
import Ionicons from "react-native-vector-icons/Ionicons";

function ViolationScreen({ navigation }) {
  const [violationItems, setViolationItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // State for capturing search input
  const [filteredItems, setFilteredItems] = useState([]); // State for filtered items

  // Function to fetch shop data and crops under violation
  const getAsyncShopData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("shopData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const shop = Array.isArray(parsedData) ? parsedData[0] : parsedData;

        // Fetch crops and other data from API
        const cropsResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crops`, {
          headers: { "x-api-key": REACT_NATIVE_API_KEY },
        });
        const categoryResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_categories`, {
          headers: { "x-api-key": REACT_NATIVE_API_KEY },
        });
        const subcategoryResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_sub_categories`, {
          headers: { "x-api-key": REACT_NATIVE_API_KEY },
        });
        const varietyResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_varieties`, {
          headers: { "x-api-key": REACT_NATIVE_API_KEY },
        });
        const varietySizeResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_variety_sizes`, {
          headers: { "x-api-key": REACT_NATIVE_API_KEY },
        });
        const sizeResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_sizes`, {
          headers: { "x-api-key": REACT_NATIVE_API_KEY },
        });
        const metricResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/metric_systems`, {
          headers: { "x-api-key": REACT_NATIVE_API_KEY },
        });

        const crops = await cropsResponse.json();
        const categories = await categoryResponse.json();
        const subcategories = await subcategoryResponse.json();
        const varieties = await varietyResponse.json();
        const variety_sizes = await varietySizeResponse.json();
        const sizes = await sizeResponse.json();
        const metrics = await metricResponse.json();

        // Filter items under violation
        const filteredViolationItems = crops.filter(
          (crop) => crop.availability === "violation" && crop.shop_id === shop.shop_id
        );

        // Combine data for the UI
        const combinedData = filteredViolationItems.map((crop) => {
          const categoryData = categories.find((cat) => cat.crop_category_id === crop.category_id);
          const subcategoryData = subcategories.find((sub) => sub.crop_sub_category_id === crop.sub_category_id);
          const varietyData = varieties.find((variety) => variety.crop_variety_id === crop.crop_variety_id);
          const sizeData = variety_sizes.find((varSize) => varSize.crop_variety_id === crop.crop_variety_id);
          const actualSize = sizes.find((size) => size.crop_size_id === (sizeData ? sizeData.crop_size_id : null));
          const metricData = metrics.find((metric) => metric.metric_system_id === crop.metric_system_id);

          return {
            ...crop,
            category: categoryData || null,
            subcategory: subcategoryData || null,
            variety: varietyData || null,
            size: actualSize || null,
            metric: metricData || null,
          };
        });

        setViolationItems(combinedData);
      }
    } catch (error) {
      console.error("Error fetching shops:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAsyncShopData();
  }, []);

  useEffect(() => {
    setFilteredItems(violationItems); // Initialize filteredItems with all violationItems
  }, [violationItems]);

  // Function to delete crop
  const deleteCrop = async (cropId) => {
    try {
      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crops/${cropId}`, {
        method: "DELETE",
        headers: { "x-api-key": REACT_NATIVE_API_KEY },
      });

      if (response.ok) {
        setViolationItems((prevItems) => prevItems.filter((item) => item.crop_id !== cropId));
        Alert.alert("Deleted Successfully!", "Crop Deleted Successfully.");
      } else {
        console.error("Failed to delete crop:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting crop:", error);
    }
  };

  const confirmDelete = (cropId) => {
    Alert.alert("Delete Crop", "Are you sure you want to delete this crop?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteCrop(cropId) },
    ]);
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
    if (text) {
      const filteredData = violationItems.filter(
        (item) =>
          item.crop_name.toLowerCase().includes(text.toLowerCase()) ||
          (item.category && item.category.crop_category_name.toLowerCase().includes(text.toLowerCase())) ||
          (item.subcategory && item.subcategory.crop_sub_category_name.toLowerCase().includes(text.toLowerCase())) ||
          item.crop_description.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredItems(filteredData);
    } else {
      setFilteredItems(violationItems); // Reset to all items if search is cleared
    }
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Reports section */}
      <View className="text-center mb-4">
        <Reports data={filteredItems} dataType="violationItems" />
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

      {/* Scroll view for violation items */}
      <ScrollView className="p-4 mb-16">
        {filteredItems.map((violationItem) => (
          <TouchableOpacity
            key={violationItem.crop_id}
            className="bg-white p-4 mb-4 rounded-xl shadow-md flex-row items-center transition-all duration-300 hover:shadow-lg"
            onPress={() => navigation.navigate("Farmers Product Details", { violationItem })}
          >
            {/* Delete Icon */}
            <TouchableOpacity
              style={{ position: "absolute", top: 8, right: 8 }}
              onPress={() => confirmDelete(violationItem.crop_id)}
            >
              <Ionicons name="trash-outline" size={20} color="red" />
            </TouchableOpacity>

            {/* Crop Image */}
            <Image
              source={{ uri: violationItem.crop_image_url || placeholderimg }}
              className="w-16 h-16 rounded-lg mr-4 object-cover bg-gray-200"
            />

            {/* Crop Information */}
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800 mb-1">
                {violationItem.crop_name}
              </Text>
              <Text className="text-sm text-gray-600 mb-1">
                {violationItem.crop_description}
              </Text>

              {/* Category and Subcategory */}
              <View className="flex-row flex-wrap gap-2 mb-1">
                <Text className="text-xs font-medium text-red-600">
                  Violation: <Text className="text-gray-800">{violationItem.violation || 'Unknown'}</Text>
                </Text>
                <Text className="text-xs font-medium text-green-600">
                  Category: <Text className="text-gray-800">{violationItem.category ? violationItem.category.crop_category_name : 'Unknown'}</Text>
                </Text>
                <Text className="text-xs font-medium text-green-600">
                  Subcategory: <Text className="text-gray-800">{violationItem.subcategory ? violationItem.subcategory.crop_sub_category_name : 'Unknown'}</Text>
                </Text>
              </View>

              {/* Variety, Size, and Class */}
              <View className="flex-row flex-wrap gap-2 mb-1">
                <Text className="text-xs font-medium text-green-600">
                  Variety: <Text className="text-gray-800">{violationItem.variety ? violationItem.variety.crop_variety_name : 'Unknown'}</Text>
                </Text>
                <Text className="text-xs font-medium text-green-600">
                  Size: <Text className="text-gray-800">{violationItem.size ? violationItem.size.crop_size_name : 'Unknown'}</Text>
                </Text>
                <Text className="text-xs font-medium text-green-600">
                  Class: <Text className="text-gray-800">{violationItem.crop_class || 'Unknown'}</Text>
                </Text>
              </View>

              {/* Quantity and Negotiation */}
              <View className="flex-row justify-between mt-2">
                <Text className="text-xs font-medium text-[#00B251]">
                  Quantity:{" "}
                  <Text className="text-gray-800">
                    {violationItem.crop_quantity}
                  </Text>
                </Text>
                <Text className="text-xs font-medium text-[#00B251]">
                  Negotiation:{" "}
                  <Text className="text-gray-800">
                    {violationItem.negotiation_allowed ? "Allowed" : "Not Allowed"}
                  </Text>
                </Text>
              </View>

              {/* Price, Weight */}
              <View className="flex-row justify-between mt-2">
                <Text className="text-xs font-medium text-green-600">
                  Weight: <Text className="text-gray-800">{violationItem.metric ? `${violationItem.metric.metric_system_name}` : 'Unknown'}</Text>
                </Text>
                <Text className="text-sm font-semibold text-[#00B251]">
                  ₱{violationItem.crop_price}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default ViolationScreen;
