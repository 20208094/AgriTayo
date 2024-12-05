import React, { useEffect, useState, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
  View,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Reports from "../../../../components/Reports";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import placeholderimg from "../../../../assets/placeholder.png";
import LoadingAnimation from "../../../../components/LoadingAnimation";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";

function DelistedScreen({ navigation }) {
  const [delistedItems, setDelistedItems] = useState([]); // State to hold delisted items
  const [loading, setLoading] = useState(true); // Loading state
  const [searchTerm, setSearchTerm] = useState(""); // State to capture search input
  const [filteredItems, setFilteredItems] = useState([]); // State for filtered items
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedCropId, setSelectedCropId] = useState(null);

  // Function to fetch shop data and crops that are delisted
  const getAsyncShopData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("shopData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const shop = Array.isArray(parsedData) ? parsedData[0] : parsedData;

        // Fetch crops from API
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

        // Filter items that are delisted
        const filteredDelistedItems = crops.filter(
          (crop) =>
            crop.availability === "delisted" && crop.shop_id === shop.shop_id
        );

        // Combine data for the UI
        const combinedData = filteredDelistedItems.map((crop) => {
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

        setDelistedItems(combinedData);
      }
    } catch (error) {
      console.error("Error fetching shops:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getAsyncShopData();
    }, [])
  );

  useEffect(() => {
    setFilteredItems(delistedItems); // Initialize filteredItems on first load
  }, [delistedItems]);

  // Function to delete crop
  const deleteCrop = async (cropId) => {
    try {
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/crops/${cropId}`,
        {
          method: "DELETE",
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
        }
      );

      if (response.ok) {
        setDelistedItems((prevItems) =>
          prevItems.filter((item) => item.crop_id !== cropId)
        );
        setAlertMessage("Crop Deleted Successfully.");
        setAlertVisible(true);
      } else {
        setAlertMessage("Failed to delete crop.");
        setAlertVisible(true);
      }
    } catch (error) {
      setAlertMessage(`Error deleting crop: ${error.message}`);
      setAlertVisible(true);
    }
  };

  const confirmDelete = (cropId) => {
    setSelectedCropId(cropId);
    setAlertMessage("Are you sure you want to delete this crop?");
    setConfirmModalVisible(true);
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
    if (text) {
      const filteredData = delistedItems.filter(
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
      setFilteredItems(delistedItems); // Reset filtered items if search is cleared
    }
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Reports section */}
      <View className="text-center mb-4">
        <Reports data={filteredItems} dataType="delistedItems" />
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

      {/* Scroll view for delisted items */}
      <ScrollView className="p-4 mb-16">
        {filteredItems.map((delistedItem) => (
          <TouchableOpacity
            key={delistedItem.crop_id}
            className="bg-white p-4 mb-4 rounded-xl shadow-md flex-row items-center transition-all duration-300 hover:shadow-lg"
            onPress={() => {
              const delistedItemWithDefaults = {
                ...delistedItem,
                category: delistedItem.category || { crop_category_name: null },
                subcategory: delistedItem.subcategory || { crop_sub_category_name: null },
                variety: delistedItem.variety || { crop_variety_name: null },
                size: delistedItem.size || { crop_size_name: null, crop_size_id: null },
                metric: delistedItem.metric || { metric_system_name: null, metric_system_id: null },
              };
              
              navigation.navigate("Farmers Product Details", { delistedItem: delistedItemWithDefaults });
            }}
          >
            {/* Delete Icon */}
            <TouchableOpacity
              style={{ position: "absolute", top: 8, right: 8 }}
              onPress={() => confirmDelete(delistedItem.crop_id)}
            >
              <Ionicons name="trash-outline" size={20} color="red" />
            </TouchableOpacity>

            {/* Crop Image */}
            <Image
              source={{ uri: delistedItem.crop_image_url || placeholderimg }}
              className="w-16 h-16 rounded-lg mr-4 object-cover bg-gray-200"
            />

            {/* Crop Information */}
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800 mb-1">
                {delistedItem.crop_name}
              </Text>
              <Text className="text-sm text-gray-600 mb-1">
                {delistedItem.crop_description}
              </Text>

              {/* Category and Subcategory */}
              <View className="mb-1">
                <Text className="text-xs font-medium text-green-600">
                  Category:{" "}
                  <Text className="text-gray-800">
                    {delistedItem.category
                      ? delistedItem.category.crop_category_name
                      : "Unknown"}
                  </Text>
                </Text>
                </View>
                <View className='mb-1'>
                <Text className="text-xs font-medium text-green-600">
                  Subcategory:{" "}
                  <Text className="text-gray-800">
                    {delistedItem.subcategory
                      ? delistedItem.subcategory.crop_sub_category_name
                      : "Unknown"}
                  </Text>
                </Text>
              </View>

              {/* Variety, Size, and Class */}
              <View className="mb-1">
                <Text className="text-xs font-medium text-green-600">
                  Variety:{" "}
                  <Text className="text-gray-800">
                    {delistedItem.variety
                      ? delistedItem.variety.crop_variety_name
                      : "Unknown"}
                  </Text>
                </Text>
                </View>
                <View className='mb-1'>
                <Text className="text-xs font-medium text-green-600">
                  Size:{" "}
                  <Text className="text-gray-800">
                    {delistedItem.size
                      ? delistedItem.size.crop_size_name
                      : "Unknown"}
                  </Text>
                </Text>
                </View>
                <View className='mb-1'>
                <Text className="text-xs font-medium text-green-600">
                  Class:{" "}
                  <Text className="text-gray-800">
                    {delistedItem.crop_class || "Unknown"}
                  </Text>
                </Text>
              </View>

              {/* Quantity and Negotiation */}
              <View className="mb-1">
                <Text className="text-xs font-medium text-[#00B251]">
                  Quantity:{" "}
                  <Text className="text-gray-800">
                    {delistedItem.crop_quantity}
                  </Text>
                </Text>
                </View>
                <View className='mb-1'>
                <Text className="text-xs font-medium text-[#00B251]">
                  Negotiation:{" "}
                  <Text className="text-gray-800">
                    {delistedItem.negotiation_allowed
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
                    {delistedItem.metric
                      ? `${delistedItem.metric.metric_system_name}`
                      : "Unknown"}
                  </Text>
                </Text>
                <Text className="text-sm font-semibold text-[#00B251]">
                  ₱{delistedItem.crop_price}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 bg-opacity-50">
          <View className="bg-white p-6 rounded-lg shadow-lg w-3/4">
            <Text className="text-lg font-semibold text-gray-900 mb-4 text-center">
              {alertMessage}
            </Text>
            <View className="flex-row justify-between mt-4">
              <TouchableOpacity
                className="p-2 bg-gray-300 rounded-lg flex-row justify-center items-center w-1/3"
                onPress={() => setConfirmModalVisible(false)}
              >
                <Text className="text-lg text-gray-800 text-center">No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="p-2 bg-[#00B251] rounded-lg flex-row justify-center items-center w-1/3"
                onPress={() => {
                  setConfirmModalVisible(false);
                  deleteCrop(selectedCropId);
                }}
              >
                <Text className="text-lg text-white text-center">Yes</Text>
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
        <View className="flex-1 justify-center items-center bg-black/50 bg-opacity-50">
          <View className="bg-white p-6 rounded-lg shadow-lg w-3/4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              {alertMessage}
            </Text>
            <TouchableOpacity
              className="mt-4 p-2 bg-[#00B251] rounded-lg flex-row justify-center items-center"
              onPress={() => setAlertVisible(false)}
            >
              <Ionicons name="checkmark-circle-outline" size={24} color="white" />
              <Text className="text-lg text-white ml-2">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default DelistedScreen;
