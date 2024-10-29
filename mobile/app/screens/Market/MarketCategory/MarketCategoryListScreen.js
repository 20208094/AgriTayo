import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import placeholderimg from "../../../assets/placeholder.png";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import NavigationbarComponent from "../../../components/NavigationbarComponent";

function MarketCategoryListScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { category } = route.params;
  const API_KEY = REACT_NATIVE_API_KEY;

  // Fetch crop sub category data from API
  const fetchCropSubCategories = async () => {
    try {
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/crop_sub_categories`,
        {
          headers: {
            "x-api-key": API_KEY,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // Filter crops based on the category_id
      const filteredItems = data.filter(
        (item) => item.crop_category_id === category
      );
      setItems(filteredItems);
    } catch (error) {
      setError(error);
      console.error("Error fetching crop data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch crops when screen is focused
  useEffect(() => {
    fetchCropSubCategories();
  }, [category]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-200 pb-14">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-200">
        <Text className="text-red-500">
          Error loading data: {error.message}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <>
    <SafeAreaView className="p-4 bg-gray-200">
      <ScrollView>
        <View className="flex-col">
          {items.map((item) => (
            <TouchableOpacity
              key={item.crop_sub_category_id}
              onPress={() =>
                navigation.navigate("Market Variety", {
                  subcategoryId: item.crop_sub_category_id,
                })
              }
              className="bg-white rounded-lg shadow-md flex-row items-start p-4 mb-4 border border-gray-300"
              style={{ elevation: 3 }} // Adds shadow effect
              activeOpacity={0.8} // Provides visual feedback when pressed
            >
              <Image
                source={
                  item.crop_sub_category_image_url
                    ? { uri: item.crop_sub_category_image_url }
                    : placeholderimg
                }
                className="w-24 h-24 rounded-lg mr-4"
                resizeMode="cover"
              />
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800 mb-1">
                  {item.crop_sub_category_name}
                </Text>
                <Text className="text-sm text-gray-600">
                  {item.crop_sub_category_description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
    <NavigationbarComponent/>
    </>
  );
}

export default MarketCategoryListScreen;
