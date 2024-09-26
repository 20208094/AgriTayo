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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f0f0f0', padding: 16 }}>
      <ScrollView>
        <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 }}>
          {/* Crop Name Input */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, color: '#666' }}>Crop Name</Text>
            <TextInput
              value={formData.crop_name}
              onChangeText={(text) => setFormData({ ...formData, crop_name: text })}
              style={{ marginTop: 8, fontSize: 18, color: '#333', borderColor: '#ccc', borderWidth: 1, borderRadius: 4, padding: 8 }}
              placeholder="Enter crop name"
            />
          </View>

          {/* Crop Description Input */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, color: '#666' }}>Crop Description</Text>
            <TextInput
              value={formData.crop_description}
              onChangeText={(text) => setFormData({ ...formData, crop_description: text })}
              style={{ marginTop: 8, fontSize: 18, color: '#333', borderColor: '#ccc', borderWidth: 1, borderRadius: 4, padding: 8 }}
              placeholder="Enter crop description"
              multiline
            />
          </View>

          {/* Crop Price Input */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, color: '#666' }}>Crop Price</Text>
            <TextInput
              value={formData.crop_price}
              onChangeText={(text) => setFormData({ ...formData, crop_price: text })}
              style={{ marginTop: 8, fontSize: 18, color: '#333', borderColor: '#ccc', borderWidth: 1, borderRadius: 4, padding: 8 }}
              placeholder="Enter crop price"
              keyboardType="numeric"
            />
          </View>

          {/* Category ID Input */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, color: '#666' }}>Select Category ID</Text>
            <TextInput
              value={formData.category_id}
              onChangeText={(text) => setFormData({ ...formData, category_id: text })}
              style={{ marginTop: 8, fontSize: 18, color: '#333', borderColor: '#ccc', borderWidth: 1, borderRadius: 4, padding: 8 }}
              placeholder="Enter category ID"
            />
          </View>

          {/* Shop ID Input */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, color: '#666' }}>Select Shop ID</Text>
            <TextInput
              value={formData.shop_id}
              onChangeText={(text) => setFormData({ ...formData, shop_id: text })}
              style={{ marginTop: 8, fontSize: 18, color: '#333', borderColor: '#ccc', borderWidth: 1, borderRadius: 4, padding: 8 }}
              placeholder="Enter shop ID"
            />
          </View>

          {/* Additional Fields */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, color: '#666' }}>Crop Rating</Text>
            <TextInput
              value={formData.crop_rating}
              onChangeText={(text) => setFormData({ ...formData, crop_rating: text })}
              style={{ marginTop: 8, fontSize: 18, color: '#333', borderColor: '#ccc', borderWidth: 1, borderRadius: 4, padding: 8 }}
              placeholder="Enter crop rating"
              keyboardType="numeric"
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, color: '#666' }}>Crop Quantity</Text>
            <TextInput
              value={formData.crop_quantity}
              onChangeText={(text) => setFormData({ ...formData, crop_quantity: text })}
              style={{ marginTop: 8, fontSize: 18, color: '#333', borderColor: '#ccc', borderWidth: 1, borderRadius: 4, padding: 8 }}
              placeholder="Enter crop quantity"
              keyboardType="numeric"
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, color: '#666' }}>Crop Weight</Text>
            <TextInput
              value={formData.crop_weight}
              onChangeText={(text) => setFormData({ ...formData, crop_weight: text })}
              style={{ marginTop: 8, fontSize: 18, color: '#333', borderColor: '#ccc', borderWidth: 1, borderRadius: 4, padding: 8 }}
              placeholder="Enter crop weight"
              keyboardType="numeric"
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, color: '#666' }}>Metric System ID</Text>
            <TextInput
              value={formData.metric_system_id}
              onChangeText={(text) => setFormData({ ...formData, metric_system_id: text })}
              style={{ marginTop: 8, fontSize: 18, color: '#333', borderColor: '#ccc', borderWidth: 1, borderRadius: 4, padding: 8 }}
              placeholder="Enter metric system ID"
            />
          </View>

          {/* Image Picker and Display */}
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            {formData.crop_image ? (
              <View style={{ width: 160, height: 160, borderRadius: 8, borderColor: '#ccc', borderWidth: 2 }}>
                <Image source={{ uri: formData.crop_image }} style={{ width: '100%', height: '100%', borderRadius: 8 }} />
                <TouchableOpacity
                  style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'red', borderRadius: 50, padding: 8 }}
                  onPress={removeImage}
                >
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={{ backgroundColor: 'green', padding: 16, borderRadius: 8, flexDirection: 'row', alignItems: 'center' }}
                onPress={() => setModalVisible(true)}
              >
                <Ionicons name="image-outline" size={24} color="white" />
                <Text style={{ color: 'white', fontSize: 18, marginLeft: 8 }}>Select Image</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={{ backgroundColor: 'green', paddingVertical: 12, borderRadius: 8, alignItems: 'center' }}
            onPress={handleAddProduct}
          >
            <Text style={{ fontSize: 18, color: 'white' }}>Add Product</Text>
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 24, borderRadius: 8, width: '80%' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333' }}>Select Product Image</Text>
            <TouchableOpacity
              style={{ marginTop: 16, padding: 16, backgroundColor: 'green', borderRadius: 8, flexDirection: 'row', alignItems: 'center' }}
              onPress={selectImageFromGallery}
            >
              <Ionicons name="image-outline" size={24} color="white" />
              <Text style={{ color: 'white', fontSize: 18, marginLeft: 8 }}>Select from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: 16, padding: 16, backgroundColor: 'red', borderRadius: 8, flexDirection: 'row', alignItems: 'center' }}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close-outline" size={24} color="white" />
              <Text style={{ color: 'white', fontSize: 18, marginLeft: 8 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default AddProductScreen;
