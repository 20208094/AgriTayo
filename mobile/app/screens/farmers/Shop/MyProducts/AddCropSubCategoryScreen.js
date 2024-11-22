import React, { useState, useCallback, useEffect } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    ScrollView,
    Image,
  } from "react-native";
  import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
  import * as ImagePicker from "expo-image-picker";
  import Ionicons from "react-native-vector-icons/Ionicons";
  import { useFocusEffect } from "@react-navigation/native";
  
  function AddCropSubCategoryScreen({navigation}) {
    const [cropSubCategoryName, setCropSubCategoryName] = useState("");
    const [cropSubCategoryDescription, setCropSubCategoryDescription] = useState("");
    const [cropImage, setCropImage] = useState(null);
    const API_KEY = REACT_NATIVE_API_KEY;
    const [loading, setLoading] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [categories, setCategories] = useState([]);
  const [isClickedCategory, setIsClickedCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    "Select Crop Category"
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const handleCategorySelect = (category) => {
    setSelectedCategory(category.crop_category_name);
    setSelectedCategoryId(category.crop_category_id);
    setIsClickedCategory(false);
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
  
      if (!result.canceled) {
        setCropImage(result.assets[0].uri);
        setModalVisible(false);
      }
    };
  
    const removeImage = () => {
      setCropImage(null);
    };

    const fetchCategories = async () => {
        try {
          const response = await fetch(
            `${REACT_NATIVE_API_BASE_URL}/api/crop_categories`,
            {
              headers: {
                "x-api-key": API_KEY,
              },
            }
          );
          if (!response.ok) throw new Error("Network response was not ok");
    
          const data = await response.json();
          setCategories(data);
        } catch (error) {
          setAlertMessage(`Error fetching crop categories: ${error.message}`);
          setAlertVisible(true);
        }
      };

      useFocusEffect(
        useCallback(() => {
          fetchCategories();
        }, [])
      );


  
  const handleAddCropSubCategory = async() => {
      const formData = new FormData();
      formData.append('crop_sub_category_name', cropSubCategoryName)
      formData.append('crop_sub_category_description', cropSubCategoryDescription)
      formData.append('crop_category_id', selectedCategoryId)
      if (cropImage) {
          formData.append("image", {
            uri: cropImage,
            name: "shop.jpg",
            type: "image/jpeg",
          });
        }
  
        try {
          setLoading(true);
          console.log("Submitting crop sub category data: ", formData);
    
          const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_sub_categories`, {
            method: "POST",
            headers: {
              "x-api-key": API_KEY,
            },
            body: formData,
          });
    
          const responseText = await response.text();
          console.log("Response Text: ", responseText);
    
          if (response.ok) {
            const responseData = JSON.parse(responseText);
            console.log("Response data: ", responseData);
            setAlertMessage("Crop sub category added successfully!");
            setAlertVisible(true);
            navigation.navigate("Add Product");
          } else {
            console.error("Error adding crop sub category: ", responseText);
            setAlertMessage("Failed to add crop sub category. Please try again.");
            setAlertVisible(true);
          }
        } catch (error) {
          setAlertMessage(
            `An error occurred while adding the crop sub category: ${error.message}`
          );
          setAlertVisible(true);
        } finally {
          setLoading(false);
        }
  }
  
    return (
      <SafeAreaView className="bg-gray-100 flex-1">
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          <View className="p-4">
            <View className="mb-4">
              <Text className="text-sm mb-2 text-gray-800">
                Crop Sub Category Name
              </Text>
              <TextInput
                className="w-full p-2  bg-white rounded-lg shadow-md"
                placeholder="Potato"
                value={cropSubCategoryName}
                onChangeText={setCropSubCategoryName}
                multiline
              />
            </View>
            <View className="mb-4">
              <Text className="text-sm mb-2 text-gray-800">
                Crop Sub Category Description
              </Text>
              <TextInput
                className="w-full p-2  bg-white rounded-lg shadow-md"
                placeholder="Describe the crop you want to sell."
                value={cropSubCategoryDescription}
                onChangeText={setCropSubCategoryDescription}
                multiline
              />
            </View>
            {/* Category Selector */}
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">Crop Category</Text>
            <TouchableOpacity
              className="flex-row items-center w-full p-2 bg-white rounded-lg shadow-md"
              onPress={() => setIsClickedCategory(!isClickedCategory)}
            >
              <Text className="text-base text-gray-700 flex-1">
                {selectedCategory}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color="gray"
                className="ml-2"
              />
            </TouchableOpacity>
            {isClickedCategory && (
              <View className="w-full p-2 mb-4 bg-white rounded-lg shadow-md">
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.crop_category_id}
                    className="p-2"
                    onPress={() => handleCategorySelect(category)}
                  >
                    <Text className="text-base">
                      {category.crop_category_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
            <View className="mb-4">
              <Text className="text-sm mb-2 text-gray-800">
                Crop Sub Category Image
              </Text>
              <TouchableOpacity
                className="border border-dashed border-green-600 rounded-md p-4  flex-row justify-center items-center "
                onPress={() => setModalVisible(true)}
              >
                <Ionicons name="camera" size={24} color="#00b251" />
              </TouchableOpacity>
  
              {cropImage && (
                <View className="mt-4">
                  <Image
                    source={{ uri: cropImage }}
                    className="w-full h-64 rounded-lg"
                  />
                  <TouchableOpacity
                    className="mt-2 bg-red-500 p-2 rounded-lg"
                    onPress={removeImage}
                  >
                    <Text className="text-white text-center">Remove Image</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            {/* Modal for Image Selection */}
            <Modal
              visible={modalVisible}
              transparent={true}
              animationType="slide"
            >
              <View className="flex-1 justify-center items-center bg-black/50 ">
                <View className="bg-white p-6 rounded-lg">
                  <Text className="text-lg font-semibold mb-4">
                    Select Image Source
                  </Text>
                  <TouchableOpacity
                    className="mb-4 p-4 bg-[#00B251] rounded-lg"
                    onPress={selectImageFromGallery}
                  >
                    <Text className="text-white text-center">
                      Choose from Gallery
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="p-4 bg-red-500 rounded-lg"
                    onPress={() => setModalVisible(false)}
                  >
                    <Text className="text-white text-center">Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            {/* Add Product Button */}
            <TouchableOpacity
              className="bg-[#00B251] p-4 rounded-lg flex items-center mt-4"
              onPress={() => setModalVisible1(true)}
            >
              <Text className="text-white text-base">Add Crop Sub Category</Text>
            </TouchableOpacity>
  
            <Modal
              transparent={true}
              visible={modalVisible1}
              animationType="slide"
              onRequestClose={() => setModalVisible1(false)}
            >
              <View className="flex-1 justify-center items-center bg-[rgba(0,0,0,0.5)] bg-black/50">
                <View className="w-4/5 bg-white p-6 rounded-lg">
                  <Text className="text-lg font-semibold text-gray-800 mb-4">
                    Confirm Add Crop Sub Category
                  </Text>
                  <Text className="text-gray-600 mb-6">
                    Do you really want to add this crop sub category?
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
                        handleAddCropSubCategory();
                      }}
                    >
                      <Text className="text-white text-base">Yes</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
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
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
  
  export default AddCropSubCategoryScreen;
  