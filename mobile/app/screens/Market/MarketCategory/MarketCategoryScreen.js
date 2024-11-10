import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, ActivityIndicator, Modal, TextInput } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import placeholderimg from '../../../assets/placeholder.png';
import Icon from "react-native-vector-icons/FontAwesome5";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import NavigationbarComponent from '../../../components/NavigationbarComponent';

const CategoryItemCard = ({ item }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      className="w-[48%] bg-white rounded-lg shadow-md mb-4"
      onPress={() => navigation.navigate('Product Details', { product: item })}
    >
      <Image
        source={item.crop_image_url ? { uri: item.crop_image_url } : placeholderimg}
        className="w-full h-40 rounded-t-lg"
        resizeMode="cover"
      />
      <View className="p-4">
        <Text className="text-lg font-semibold text-gray-800">{item.crop_name}</Text>
        <Text className="text-sm text-gray-600 mt-1">Shop: {item.shop_name}</Text>
        <Text className="text-sm text-gray-600 mt-1">Size: {item.size.crop_size_name}</Text>
        <Text className="text-sm text-gray-600 mt-1">Class: {item.crop_class}</Text>
        <Text className="text-sm text-gray-600 mt-1">{item.crop_description}</Text>
        <Text className="text-base font-bold text-green-600 mt-2">₱ {item.crop_price}</Text>
        {/* <Text className="text-sm text-gray-600">⭐ {item.crop_rating}</Text> */}
      </View>
    </TouchableOpacity>
  );
};

function MarketCategoryScreen({ route }) {
  const navigation = useNavigation();
  const { category, selectedItemId, selectedProduct: initialSelectedProduct, searchResults } = route.params || {};
  const [selectedProduct, setSelectedProduct] = useState(initialSelectedProduct); // Initialize state with route parameter
  const [crops, setCrops] = useState(searchResults || []); // Use search results from HomePageScreen if available
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [metricSystem, setMetricSystem] = useState([]);

  const API_KEY = REACT_NATIVE_API_KEY;

  useEffect(() => {
    if (selectedProduct) {
      console.log('Selected product received:', selectedProduct);
    }
    setLoading(false);
  }, [selectedProduct]);

  const fetchAllCropsWithShops = useCallback(async () => {
    try {
      setLoading(true);
  
      // Fetch crops data
      const cropsResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crops`, {
        headers: { 'x-api-key': API_KEY }
      });
      const cropsData = await cropsResponse.json();
  
      // Fetch all shop data
      const shopsResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/shops`, {
        headers: { 'x-api-key': API_KEY }
      });
      const shopsData = await shopsResponse.json();
  
      // Map shop IDs to shop names
      const shopMap = shopsData.reduce((acc, shop) => {
        acc[shop.shop_id] = shop.shop_name;
        return acc;
      }, {});
  
      // Add shop_name to each crop based on shop_id
      const cropsWithShops = cropsData.map(crop => ({
        ...crop,
        shop_name: shopMap[crop.shop_id] || 'Unknown Shop'
      }));
  
      setCrops(cropsWithShops);
    } catch (error) {
      setError(error);
      console.error('Error fetching crops or shops:', error);
    } finally {
      setLoading(false);
    }
  }, [API_KEY]);
  

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
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching crop categories:", error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_sub_categories`,
        {
          headers: {
            "x-api-key": API_KEY,
          },
        }
      );
      const data = await response.json();
      setSubCategories(data);
    } catch (error) {
      console.error("Error fetching crop sub-categories:", error);
    }
  };

  const fetchMetricSystem = async () => {
    try {
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/metric_systems`,
        {
          headers: {
            "x-api-key": API_KEY,
          },
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setMetricSystem(data);
    } catch (error) {
      alert(`Error fetching metric systems: ${error.message}`);
    }
  };

  const fetchCropsFiltering = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crops`, {
        headers: {
          'x-api-key': API_KEY
        }
      });
      const data = await response.json();

      if (selectedSubCategories.length > 0) {
        const filteredCrops = data.filter(crop => selectedSubCategories.includes(crop.sub_category_id));
        setCrops(filteredCrops);
      } else {
        setCrops([]);
      }
    } catch (error) {
      setError(error);
      console.error('Error fetching crops data:', error);
    } finally {
      setLoading(false);
    }
  }, [API_KEY, selectedSubCategories]);

  const fetchCrops = useCallback(async (selectedItemId) => {
    try {
      setLoading(true);
      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crops`, {
        headers: {
          'x-api-key': API_KEY
        }
      });
      const sizeResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_sizes`, {
        headers: {
          "x-api-key": API_KEY,
        },
      });
      const data = await response.json();
      const sizes = await sizeResponse.json();
      const filteredCrops = data.filter(crop => crop.crop_variety_id === selectedItemId);
      
      const combinedData = filteredCrops.map(crop => {
        const actualSize = sizes.find(size => size.crop_size_id === (crop ? crop.crop_size_id : null));
        return {
          ...crop,
          size: actualSize ? actualSize : null,
        };
      });
      setCrops(combinedData);
    } catch (error) {
      setError(error);
      console.error('Error fetching crops data:', error);
    } finally {
      setLoading(false);
    }
  }, [API_KEY]);

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
    fetchMetricSystem();
  
    if (!searchResults && selectedSubCategories.length === 0 && !selectedItemId) {
      fetchAllCropsWithShops();
    } else if (searchResults) {
      setCrops(searchResults);
    } else if (selectedSubCategories.length > 0) {
      fetchCropsFiltering();
    } else if (selectedItemId) {
      fetchCrops(selectedItemId);
    }
  }, [searchResults, selectedSubCategories, selectedItemId]);
  

  useEffect(() => {
    if (selectedSubCategories.length > 0) {
      fetchCropsFiltering();
    } else if (selectedItemId) {
      fetchCrops(selectedItemId);
    }
  }, [selectedSubCategories, selectedItemId, fetchCropsFiltering, fetchCrops]);

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const filteredCrops = crops.filter(crop => {
    const searchLower = searchQuery.toLowerCase();
    
    // Convert values to strings for consistent comparison and handle undefined values.
    const name = crop.crop_name?.toLowerCase() || "";
    const description = crop.crop_description?.toLowerCase() || "";
    const price = crop.crop_price?.toString() || "";
    // const rating = crop.crop_rating?.toString() || "";
    const sizeName = crop.size?.crop_size_name?.toLowerCase() || "";
    const cropClass = crop.crop_class?.toLowerCase() || "";
  
    return (
      name.includes(searchLower) ||
      description.includes(searchLower) ||
      price.includes(searchLower) ||
      // rating.includes(searchLower) ||
      cropClass.includes(searchLower) ||
      sizeName.includes(searchLower)
    );
  });
  

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
        <Text className="text-red-500">Error loading data: {error.message}</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="p-4 pb-0 flex-row align-middle items-center">
        <TouchableOpacity
          className="flex py-2 w-12 align-middle items-center rounded-xl mr-2 bg-[#00B251]"
          onPress={() => navigation.navigate("Filter Products")}
        >
          <Icon name="filter" size={30} color="white" />
        </TouchableOpacity>
        <TextInput
          placeholder="Search crops..."
          value={searchQuery}
          onChangeText={handleSearch}
          className="bg-white p-3 rounded-lg shadow-md flex-1 border border-[#00B251]"
        />
      </View>

      {/* Product List */}
      <ScrollView className="p-4">
        <View className="flex-row flex-wrap justify-between">
          {filteredCrops.map(item => (
            <CategoryItemCard key={item.crop_id} item={item} />
          ))}
        </View>
      </ScrollView>
      <NavigationbarComponent/>
    </SafeAreaView>
    </>
  );
}

export default MarketCategoryScreen;
