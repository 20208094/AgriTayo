import React, { useState } from "react";
import {
  SafeAreaView,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  Image,
  Modal,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

// Replace these with your API URL and Key
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";

function AddProductScreen({ navigation }) {
  const [formData, setFormData] = useState({
    crop_name: "",
    crop_description: "",
    crop_price: "",
    crop_image: null,
    category_id: "",
    shop_id: "",
    crop_rating: "",
    crop_quantity: "",
    crop_weight: "",
    metric_system_id: "",
  });
  const [modalVisible, setModalVisible] = useState(false);

  // Function to handle image selection from gallery
  const selectImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, crop_image: result.assets[0].uri });
      setModalVisible(false);
    }
  };

  // Function to handle image removal
  const removeImage = () => {
    setFormData({ ...formData, crop_image: null });
  };

  // Function to handle product submission
// Function to handle product submission
const handleAddProduct = async () => {
    // Validate required fields
    if (!formData.crop_name || !formData.crop_price || !formData.category_id || !formData.shop_id) {
      alert("Please fill all required fields.");
      return;
    }
  
    const formBody = new FormData();
    formBody.append("crop_name", formData.crop_name);
    formBody.append("crop_description", formData.crop_description);
    formBody.append("crop_price", formData.crop_price);
    formBody.append("category_id", formData.category_id);
    formBody.append("shop_id", formData.shop_id);
    formBody.append("crop_rating", formData.crop_rating);
    formBody.append("crop_quantity", formData.crop_quantity);
    formBody.append("crop_weight", formData.crop_weight);
    formBody.append("metric_system_id", formData.metric_system_id);
  
    // Log form data before appending image
    console.log("Form data before image append:", {
      crop_name: formData.crop_name,
      crop_description: formData.crop_description,
      crop_price: formData.crop_price,
      category_id: formData.category_id,
      shop_id: formData.shop_id,
      crop_rating: formData.crop_rating,
      crop_quantity: formData.crop_quantity,
      crop_weight: formData.crop_weight,
      metric_system_id: formData.metric_system_id,
    });
  
    // Append image if available
    if (formData.crop_image) {
      console.log("Appending crop image:", {
        uri: formData.crop_image,
        name: "crop_image.jpg",
        type: "image/jpeg",
      });
      formBody.append("image", {
        uri: formData.crop_image,
        name: "crop_image.jpg",
        type: "image/jpeg",
      });
    } else {
      console.log("No crop image to append.");
    }
  
    // console.log("Form Data being sent:", JSON.stringify(Object.fromEntries(formBody)));

  try {
    const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crops`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        "x-api-key": REACT_NATIVE_API_KEY,
      },
      body: formBody,
    });

    console.log("Response status:", response.status);
    
    if (response.ok) {
      alert("Product added successfully!");
      navigation.goBack();
    } else {
      const errorData = await response.json();
      console.error("Error response data:", errorData);
      alert("Failed to add product: " + errorData.message);
    }
  } catch (error) {
    console.error("Failed to add product:", error);
    alert("Failed to add product: " + error.message);
  }
};
  
  
  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-4">
      <ScrollView>
        <View className="bg-white p-4 rounded-lg shadow-sm relative">
          {/* Product Name Input */}
          <View className="mb-4">
            <Text className="text-base text-gray-600">Crop Name</Text>
            <TextInput
              value={formData.crop_name}
              onChangeText={(text) => setFormData({ ...formData, crop_name: text })}
              className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
              placeholder="Enter crop name"
            />
          </View>

          {/* Product Description Input */}
          <View className="mb-4">
            <Text className="text-base text-gray-600">Crop Description</Text>
            <TextInput
              value={formData.crop_description}
              onChangeText={(text) => setFormData({ ...formData, crop_description: text })}
              className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
              placeholder="Enter crop description"
              multiline
            />
          </View>

          {/* Product Price Input */}
          <View className="mb-4">
            <Text className="text-base text-gray-600">Crop Price</Text>
            <TextInput
              value={formData.crop_price}
              onChangeText={(text) => setFormData({ ...formData, crop_price: text })}
              className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
              placeholder="Enter crop price"
              keyboardType="numeric"
              required
            />
          </View>

          {/* Category and Shop Selection (Placeholder) */}
          <View className="mb-4">
            <Text className="text-base text-gray-600">Select Category</Text>
            <TextInput
              value={formData.category_id}
              onChangeText={(text) => setFormData({ ...formData, category_id: text })}
              className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
              placeholder="Enter category ID"
              required
            />
          </View>
          <View className="mb-4">
            <Text className="text-base text-gray-600">Select Shop</Text>
            <TextInput
              value={formData.shop_id}
              onChangeText={(text) => setFormData({ ...formData, shop_id: text })}
              className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
              placeholder="Enter shop ID"
              required
            />
          </View>

          {/* Additional Fields */}
          <View className="mb-4">
            <Text className="text-base text-gray-600">Crop Rating</Text>
            <TextInput
              value={formData.crop_rating}
              onChangeText={(text) => setFormData({ ...formData, crop_rating: text })}
              className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
              placeholder="Enter crop rating"
              keyboardType="numeric"
            />
          </View>
          <View className="mb-4">
            <Text className="text-base text-gray-600">Crop Quantity</Text>
            <TextInput
              value={formData.crop_quantity}
              onChangeText={(text) => setFormData({ ...formData, crop_quantity: text })}
              className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
              placeholder="Enter crop quantity"
              keyboardType="numeric"
            />
          </View>
          <View className="mb-4">
            <Text className="text-base text-gray-600">Crop Weight</Text>
            <TextInput
              value={formData.crop_weight}
              onChangeText={(text) => setFormData({ ...formData, crop_weight: text })}
              className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
              placeholder="Enter crop weight"
              keyboardType="numeric"
            />
          </View>
          <View className="mb-4">
            <Text className="text-base text-gray-600">Metric System ID</Text>
            <TextInput
              value={formData.metric_system_id}
              onChangeText={(text) => setFormData({ ...formData, metric_system_id: text })}
              className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
              placeholder="Enter metric system ID"
              required
            />
          </View>

          {/* Image Picker and Display */}
          <View className="items-center mb-4">
            {formData.crop_image ? (
              <View className="relative w-40 h-40 rounded-lg border-2 border-gray-300">
                <Image source={{ uri: formData.crop_image }} className="w-full h-full rounded-lg" />
                <TouchableOpacity
                  className="absolute top-0 right-0 bg-red-600 p-2 rounded-full"
                  onPress={removeImage}
                >
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                className="bg-green-500 p-4 rounded-lg flex items-center justify-center"
                onPress={() => setModalVisible(true)}
              >
                <Ionicons name="image-outline" size={24} color="white" />
                <Text className="text-white text-lg ml-2">Select Image</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className="bg-green-500 py-3 rounded-lg flex-row justify-center items-center shadow-lg"
            onPress={handleAddProduct}
          >
            <Text className="text-lg text-white">Add Product</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal for selecting image */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg shadow-lg w-3/4">
            <Text className="text-lg font-semibold text-gray-900">
              Select Product Image
            </Text>
            <TouchableOpacity
              className="mt-4 p-4 bg-green-500 rounded-lg flex-row justify-center items-center"
              onPress={selectImageFromGallery}
            >
              <Ionicons name="image-outline" size={24} color="white" />
              <Text className="text-lg text-white ml-2">Select from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="mt-4 p-4 bg-red-500 rounded-lg flex-row justify-center items-center"
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close-outline" size={24} color="white" />
              <Text className="text-lg text-white ml-2">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default AddProductScreen;
