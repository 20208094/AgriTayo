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
  const { liveItem, reviewingItem, violationItem, delistedItem } = route.params;

  const product = liveItem || reviewingItem || violationItem || delistedItem;

  console.log(product)

  // for data fetching
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [cropSizes, setCropSizes] = useState([]);
  const [cropVarieties, setCropVarieties] = useState([]);
  const [cropMetrics, setCropMetrics] = useState([]);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [modalVisible, setModalVisible] = useState(false);

  // for user inputs
  const [cropDescription, setCropDescription] = useState(
    product.crop_description
  );
  const [imageSource, setImageSource] = useState(null);
  const [cropPrice, setCropPrice] = useState(String(product.crop_price));
  const [cropQuantity, setCropQuantity] = useState(
    String(product.crop_quantity)
  );

const [minimumNegotiation, setMinimumNegotiation] = useState(String(product.minimum_negotiation))

const [isEnabled, setIsEnabled] = useState(product.negotiation_allowed);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const [loading, setLoading] = useState(true);

  const handleImagePick = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      setAlertMessage("Permission to access camera roll denied");
      setAlertVisible(true);
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageSource({ uri: result.assets[0].uri });
    }
  };

  // for crop category
  const [isClickedCategory, setIsClickedCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    product.category.crop_category_name
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
    product.subcategory.crop_sub_category_name
  );
  const handleSubCategorySelect = (subCategory) => {
    setSelectedSubCategory(subCategory.crop_sub_category_name);
    setSelectedSubCategoryId(subCategory.crop_sub_category_id);
    setIsclickedSubCategory(false);
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
    product.size.crop_size_name
  );
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
      alert(`Error fetching crop categories: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // for crop variety
  const [isClickedCropVariety, setIsClickedCropVariety] = useState(false);
  const [selectedCropVariety, setSelectedCropVariety] = useState(
    product.variety.crop_variety_name
  );
  const [selectedCropVarietyId, setSelectedCropVarietyId] = useState(null);
  const handleCropVarietySelect = (cropVariety) => {
    setSelectedCropVariety(cropVariety.crop_variety_name);
    setSelectedCropVarietyId(cropVariety.crop_variety_id);
    setIsClickedCropVariety(false);
  };

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
      alert(`Error fetching crop categories: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // for metric
  const [isClickedCropMetric, setIsClickedCropMetric] = useState(false);
  const [selectedCropMetric, setSelectedCropMetric] = useState(
    product.metric.metric_system_name
  );
  const [selectedCropMetricId, setSelectedCropMetricId] = useState(null);
  const handleCropMetricSelect = (cropMetric) => {
    setSelectedCropMetric(cropMetric.metric_system_name);
    setSelectedCropMetricId(cropMetric.metric_system_id);
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
  const [isClickedCropAvailability, setIsClickedCropAvailability] =
    useState(false);
  const [selectedCropAvailability, setSelectedCropAvailability] = useState(
    product.availability
  );
  const handleCropAvailabilitySelect = (cropAvailability) => {
    setSelectedCropAvailability(cropAvailability.crop_availability_name);
    setIsClickedCropAvailability(false);
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
    product.crop_class
  );
  const handleCropClassSelect = (cropClass) => {
    setSelectedCropClass(cropClass.crop_class_name);
    setIsClickedCropClass(false);
  };

  const handleEditProduct = async () => {
    const formData = new FormData();

    // Append form data fields
    formData.append("crop_name", selectedCropVariety);
    formData.append("crop_id", product.crop_id);
    formData.append("shop_id", product.shop_id);
    formData.append("crop_description", cropDescription);
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
    formData.append("negotiation_allowed", isEnabled ? 'TRUE' : 'FALSE')
    formData.append("minimum_negotiation", parseInt(minimumNegotiation))

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
      setAlertMessage("Success!, Product Updated Successfully");
      setAlertVisible(true);
      navigation.navigate("My Products");
    } catch (error) {
      console.error(`Error updating product: ${error.message}`);
    }
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <SafeAreaView className="bg-gray-100 flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="p-4">
          {product ? (
            <>
              <View className="mb-4">
                <TouchableOpacity
                  onPress={handleImagePick}
                  className="rounded-lg overflow-hidden shadow"
                >
                  <Image
                    className="w-full h-72 object-cover"
                    source={{ uri: imageSource?.uri || product.crop_image_url }}
                  />
                </TouchableOpacity>
              </View>
              

              <View className="mb-4">
                <Text className="text-sm mb-2 text-gray-800">
                  Crop Description
                </Text>
                <TextInput
                  className="flex-row items-center w-full p-2 bg-white rounded-lg shadow-md"
                  value={cropDescription}
                  onChangeText={setCropDescription}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm mb-2 text-gray-800">
                  Crop Category
                </Text>
                <TouchableOpacity
                  className="flex-row items-center w-full p-2 bg-white rounded-lg shadow-md"
                  onPress={() => setIsClickedCategory(!isClickedCategory)}
                >
                  <Text className="flex-1 text-gray-700">
                    {selectedCategory}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="gray" />
                </TouchableOpacity>
                {isClickedCategory && (
                  <View className="bg-gray-100 p-2 rounded">
                    {categories.map((category) => (
                      <TouchableOpacity
                        className="py-1"
                        key={category.crop_category_id}
                        onPress={() => handleCategorySelect(category)}
                      >
                        <Text className="text-gray-600">
                          {category.crop_category_name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View className="mb-4">
                <Text className="text-sm mb-2 text-gray-800">
                  Crop Sub Category
                </Text>
                <TouchableOpacity
                  className="flex-row items-center w-full p-2 bg-white rounded-lg shadow-md"
                  onPress={() => setIsclickedSubCategory(!isClickedSubCategory)}
                >
                  <Text className="flex-1 text-gray-700">
                    {selectedSubCategory}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="gray" />
                </TouchableOpacity>
                {isClickedSubCategory && (
                  <View className="bg-gray-100 p-2 rounded">
                    {subCategories.map((subCategory) => (
                      <TouchableOpacity
                        className="py-1"
                        key={subCategory.crop_sub_category_id}
                        onPress={() => handleSubCategorySelect(subCategory)}
                      >
                        <Text className="text-gray-600">
                          {subCategory.crop_sub_category_name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View className="mb-4">
                <Text className="text-sm mb-2 text-gray-800">Crop Variety</Text>
                <TouchableOpacity
                  className="flex-row items-center w-full p-2 bg-white rounded-lg shadow-md"
                  onPress={() => setIsClickedCropVariety(!isClickedCropVariety)}
                >
                  <Text className="flex-1 text-gray-700">
                    {selectedCropVariety}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="gray" />
                </TouchableOpacity>
                {isClickedCropVariety && (
                  <View className="bg-gray-100 p-2 rounded ">
                    {cropVarieties.map((cropVariety) => (
                      <TouchableOpacity
                        className="py-1"
                        key={cropVariety.crop_variety_id}
                        onPress={() => handleCropVarietySelect(cropVariety)}
                      >
                        <Text className="text-gray-600">
                          {cropVariety.crop_variety_name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View className="mb-4">
                <Text className="text-sm mb-2 text-gray-800">Crop Class</Text>
                <TouchableOpacity
                  className="flex-row items-center w-full p-2 bg-white rounded-lg shadow-md"
                  onPress={() => setIsClickedCropClass(!isClickedCropClass)}
                >
                  <Text className="flex-1 text-gray-700">
                    {selectedCropClass}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="gray" />
                </TouchableOpacity>
                {isClickedCropClass && (
                  <View className="bg-gray-100 p-2 rounded">
                    {cropClasses.map((cropClass) => (
                      <TouchableOpacity
                        className="py-1"
                        key={cropClass.crop_class_id}
                        onPress={() => handleCropClassSelect(cropClass)}
                      >
                        <Text className="text-gray-600">
                          {cropClass.crop_class_name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View className="mb-4">
                <Text className="text-sm mb-2 text-gray-800">Crop Size</Text>
                <TouchableOpacity
                  className="flex-row items-center w-full p-2 bg-white rounded-lg shadow-md"
                  onPress={() => setIsClickedCropSize(!isClickedCropSize)}
                >
                  <Text className="flex-1 text-gray-700">
                    {selectedCropSize}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="gray" />
                </TouchableOpacity>
                {isClickedCropSize && (
                  <View className="bg-gray-100 p-2 rounded">
                    {cropSizes.map((cropSize) => (
                      <TouchableOpacity
                        className="py-1"
                        key={cropSize.crop_size_id}
                        onPress={() => handleCropSizeSelect(cropSize)}
                      >
                        <Text className="text-gray-600">
                          {cropSize.crop_size_name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View className="mb-4">
                <Text className="text-sm mb-2 text-gray-800">Crop Price</Text>
                <TextInput
                  className="flex-row items-center w-full p-2 bg-white rounded-lg shadow-md"
                  value={cropPrice}
                  onChangeText={setCropPrice}
                  keyboardType="numeric"
                />
              </View>

              


              <View className="mb-4">
                <Text className="text-sm mb-2 text-gray-800">
                  Crop Quantity
                </Text>
                <TextInput
                  className="flex-row items-center w-full p-2 bg-white rounded-lg shadow-md"
                  value={cropQuantity}
                  onChangeText={setCropQuantity}
                  keyboardType="numeric"
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm mb-2 text-gray-800">Crop Metric</Text>
                <TouchableOpacity
                  className="flex-row items-center w-full p-2 bg-white rounded-lg shadow-md"
                  onPress={() => setIsClickedCropMetric(!isClickedCropMetric)}
                >
                  <Text className="flex-1 text-gray-700">
                    {selectedCropMetric}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="gray" />
                </TouchableOpacity>
                {isClickedCropMetric && (
                  <View className="bg-gray-100 p-2 rounded">
                    {cropMetrics.map((cropMetric) => (
                      <TouchableOpacity
                        className="py-1"
                        key={cropMetric.metric_system_id}
                        onPress={() => handleCropMetricSelect(cropMetric)}
                      >
                        <Text className="text-gray-600">
                          {cropMetric.metric_system_name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Negotiation Selector */}
          <Text className='text-sm mb-2 text-gray-800'>Open for Negotiation?</Text>
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
            <View className='mb-4'>
            <Text className="text-sm mb-2 text-gray-800">
              Crop Minimum Negotiation
            </Text>
            <TextInput
              className="w-full p-2 bg-white rounded-lg shadow-md"
              keyboardType="numeric"
              placeholder="₱5"
              value={minimumNegotiation}
              onChangeText={setMinimumNegotiation}
            />
            </View>
            </>
          )}

              <View className="mb-4">
                <Text className="text-sm mb-2 text-gray-800">
                  Crop Availability
                </Text>
                <TouchableOpacity
                  className="flex-row items-center w-full p-2 bg-white rounded-lg shadow-md"
                  onPress={() =>
                    setIsClickedCropAvailability(!isClickedCropAvailability)
                  }
                >
                  <Text className="flex-1 text-gray-700">
                    {selectedCropAvailability}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="gray" />
                </TouchableOpacity>
                {isClickedCropAvailability && (
                  <View className="bg-gray-100 p-2 rounded">
                    {cropAvailability.map((availability) => (
                      <TouchableOpacity
                        className="py-1"
                        key={availability.crop_availability_id}
                        onPress={() =>
                          handleCropAvailabilitySelect(availability)
                        }
                      >
                        <Text className="text-gray-600">
                          {availability.crop_availability_name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              {/* Add Product Button */}
              <TouchableOpacity
                className="bg-[#00B251] p-4 rounded-lg flex items-center mt-4"
                onPress={() => setModalVisible(true)}
              >
                <Text className="text-white text-base">Submit</Text>
              </TouchableOpacity>

              <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
              >
                <View className="flex-1 justify-center items-center bg-[rgba(0,0,0,0.5)] bg-black/50">
                  <View className="w-4/5 bg-white p-6 rounded-lg">
                    <Text className="text-lg font-semibold text-gray-800 mb-4">
                      Confirm Edit Product
                    </Text>
                    <Text className="text-gray-600 mb-6">
                      Do you really want to edit this product?
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
            </>
          ) : (
            <Text className="text-center text-gray-600">No item available</Text>
          )}
        </View>
      </ScrollView>
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

export default FarmersProductDetailScreen;
