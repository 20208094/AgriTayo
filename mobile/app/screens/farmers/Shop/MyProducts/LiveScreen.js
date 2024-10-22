import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import Reports from "../../../../components/Reports";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env"; // Import API constants

function LiveScreen({ navigation }) {
  const [liveItems, setLiveItems] = useState([]); // State to hold live items
  const [loading, setLoading] = useState(true); // Loading state
  const [metricSystems, setMetricSystems] = useState([]); // State to hold metric systems
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [varieties, setVarieties] = useState([])

  // Function to fetch shop data
  const getAsyncShopData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("shopData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const shop = Array.isArray(parsedData) ? parsedData[0] : parsedData;

        const cropsResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crops?shop_id=${shop.shop_id}`, {
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
        });

        if (!cropsResponse.ok) throw new Error("Network response was not ok");

        const cropsData = await cropsResponse.json();

        const metricResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/metric_systems`, {
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
        });
        
        const categoryResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_categories`, {
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
        });

        const subCategoryResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_sub_categories`, {
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
        });

        const varietyResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/varieties`, {
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
        });

        if (!metricResponse.ok) throw new Error("Network response was not ok");

        if (!categoryResponse.ok) throw new Error("Network response was not ok");

        if (!subCategoryResponse.ok) throw new Error("Network response was not ok");
        
        if (!varieties.ok) throw new Error("Network response was not ok");

        const metricData = await metricResponse.json();
        setMetricSystems(metricData); 

        const categoryData = await categoryResponse.json();
        setCategories(categoryData)

        const subCategoryData = await subCategoryResponse.json();
        setSubCategories(subCategoryData)


        const filteredLiveItems = cropsData.filter(crop => 
          crop.availability === 'live' && crop.shop_id === shop.shop_id
        );

        const formattedItems = filteredLiveItems.map(item => {
          const category = categories.find(crop_category => crop_category.crop_category_id === item.category_id);
          const subCategory = subCategories.find(sub => sub.crop_sub_category_id === item.crop_sub_category_id);
          const metricSystem = metricSystems.find(metric => metric.metric_system_id === item.metric_system_id);
          return {
            id: item.crop_id,
            name: item.crop_name,
            description: item.crop_description,
            image: { uri: item.crop_image_url },
            price: item.crop_price,
            quantity: item.crop_quantity,
            weight: item.crop_weight,
            metricName: metricSystem.metric_system_name,
          };
        });

        setLiveItems(formattedItems);
      }
    } catch (error) {
      alert(`Failed to load shop data: ${error.message}`);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    getAsyncShopData();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>; 
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
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
        <Reports data={liveItems} dataType="liveItems" />
      </View>

      {/* Scroll view for live items */}
      <ScrollView className="p-4">
        {liveItems.map((liveItem) => (
          <TouchableOpacity
            key={liveItem.id}
            className="bg-white p-4 mb-4 rounded-lg shadow-lg flex-row items-center"
            onPress={() =>
              navigation.navigate("Farmers Product Details", { liveItem })
            }
          >
            <Image
              source={liveItem.image}
              className="w-16 h-16 rounded-lg mr-4"
            />
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">
                {liveItem.name}
              </Text>
              <Text className="text-lg font-semibold text-gray-800">
                {liveItem.metricName}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default LiveScreen;
