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
import LoadingAnimation from "../../../components/LoadingAnimation";

function MarketVarietyListScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { subcategoryId } = route.params;
  const API_KEY = REACT_NATIVE_API_KEY;

  // Fetch crop sub category data from API
  const fetchCropVarieties = async () => {
    try {
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/crop_varieties`,
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

      const filteredItems = data.filter(
        (item) => item.crop_sub_category_id === subcategoryId
      );
      setItems(filteredItems);
    } catch (error) {
      setError(error);
      console.error("Error fetching crop data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCropVarieties();
  }, [subcategoryId]);

  const handleSubmit = (item) => {
    const filter_category_id = item.crop_category_id;
    const filter_sub_category_id = item.crop_sub_category_id;
    const filter_variety_id = item.crop_variety_id;
    const filter_class = [];
    const filter_size_id = '';
    const filter_price_range = [];
    const filter_quantity = '';

    navigation.navigate("Compare Shops", { filter_category_id, filter_sub_category_id, filter_variety_id, filter_class, filter_size_id, filter_price_range, filter_quantity });
  };

  if (loading) {
    return (
      <LoadingAnimation />
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
      <SafeAreaView className="flex-1 p-4 bg-gray-200">
        <ScrollView>
          <View className="flex-col">
            {items.length > 0 ? (
              items.map((item) => (
                <TouchableOpacity
                  key={item.crop_variety_id}
                  onPress={() => handleSubmit(item)}
                  className="bg-white rounded-lg shadow-md flex-row items-start p-4 mb-4 border border-gray-300"
                  style={{ elevation: 3 }}
                  activeOpacity={0.8}
                >
                  <Image
                    source={
                      item.crop_variety_image_url
                        ? { uri: item.crop_variety_image_url }
                        : placeholderimg
                    }
                    className="w-24 h-24 rounded-lg mr-4"
                    resizeMode="cover"
                  />
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-800 mb-1">
                      {item.crop_variety_name}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {item.crop_variety_description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text className="text-center text-gray-600">No crop variety found</Text>
            )}
          </View>

        </ScrollView>
      </SafeAreaView>
      <NavigationbarComponent />
    </>
  );
}

export default MarketVarietyListScreen;
