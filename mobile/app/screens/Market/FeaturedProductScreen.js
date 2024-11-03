import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, ActivityIndicator, Modal, TextInput, Pressable } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import placeholderimg from '../../assets/placeholder.png';
import Icon from "react-native-vector-icons/FontAwesome5";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from '@env';
import LoadingAnimation from '../../components/LoadingAnimation';
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
        {/* <Text className="text-sm text-gray-600 mt-1">Size: {item.size.crop_size_name}</Text> */}
        <Text className="text-sm text-gray-600 mt-1">Class: {item.crop_class}</Text>
        <Text className="text-sm text-gray-600 mt-1">{item.crop_description}</Text>
        <Text className="text-base font-bold text-green-600 mt-2">₱ {item.crop_price}</Text>
        <Text className="text-sm text-gray-600">⭐ {item.crop_rating}</Text>
      </View>
    </TouchableOpacity>
  );
};

function FeaturedProductScreen({ route }) {
  const { category, selectedItemId, selectedProduct: initialSelectedProduct, searchResults } = route.params || {};
  const [selectedProduct, setSelectedProduct] = useState(initialSelectedProduct);
  const [crops, setCrops] = useState(searchResults || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [activeSubCategories, setActiveSubCategories] = useState({});
  const [openDropdown, setOpenDropdown] = useState({});
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSort, setCurrentSort] = useState({ method: 'price', order: 'asc' });
  const [shopData, setShopData] = useState(null);

  const API_KEY = REACT_NATIVE_API_KEY;

  useEffect(() => {
    if (selectedProduct) {
      console.log('Selected product received:', selectedProduct);
    }
    setLoading(false);
  }, [selectedProduct]);

  const fetchAllCrops = useCallback(async () => {
    try {
      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crops`, {
        headers: {
          'x-api-key': API_KEY
        }
      });
      const data = await response.json();
      setCrops(data);
    } catch (error) {
      setError(error);
      console.error('Error fetching all crops:', error);
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
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/crop_sub_categories`,
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
        const filteredCrops = data.filter(crop => selectedSubCategories.includes(crop.sub_variety_id));
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

    if (!searchResults && selectedSubCategories.length === 0 && !selectedItemId) {
      // Fetch all crops if no search results, no selected subcategories, and no specific item selected
      fetchAllCrops();
    } else if (searchResults) {
      setCrops(searchResults);  // If there are search results, show them
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

  const getAsyncShopData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("shopData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const shop = Array.isArray(parsedData) ? parsedData[0] : parsedData;
        setShopData(shop);
      }
    } catch (error) {
      alert(`Failed to load shop data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getAsyncShopData();
    }, [])
  );

  const filteredCrops = crops.filter(crop => {
    const searchLower = searchQuery.toLowerCase();

    // Convert values to strings for consistent comparison and handle undefined values.
    const name = crop.crop_name?.toLowerCase() || "";
    const description = crop.crop_description?.toLowerCase() || "";
    const price = crop.crop_price?.toString() || "";
    const rating = crop.crop_rating?.toString() || "";
    const sizeName = crop.size?.crop_size_name?.toLowerCase() || "";
    const cropClass = crop.crop_class?.toLowerCase() || "";

    return (
      name.includes(searchLower) ||
      description.includes(searchLower) ||
      price.includes(searchLower) ||
      rating.includes(searchLower) ||
      cropClass.includes(searchLower) ||
      sizeName.includes(searchLower)
    );
  });

  const sortOptions = [
    { method: 'price', iconAsc: 'sort-amount-down-alt', iconDesc: 'sort-amount-up' },
    { method: 'rating', iconAsc: 'sort-amount-down-alt', iconDesc: 'sort-amount-up' },
    { method: 'available', iconAsc: 'sort-amount-down-alt', iconDesc: 'sort-amount-up' }
  ];

  const handleSort = (sortBy, order) => {
    let sortedData;
    if (sortBy === 'price') {
      sortedData = [...crops].sort((a, b) => order === 'asc' ? a.crop_price - b.crop_price : b.crop_price - a.crop_price);
    } else if (sortBy === 'rating') {
      sortedData = [...crops].sort((a, b) => order === 'asc' ? a.crop_rating - b.crop_rating : b.crop_rating - a.crop_rating);
    } else if (sortBy === 'available') {
      sortedData = [...crops].sort((a, b) => order === 'asc' ? a.crop_quantity - b.crop_quantity : b.crop_quantity - a.crop_quantity);
    } else if (sortBy === 'class') {
      sortedData = [...crops].sort((a, b) => order === 'asc' ? a.crop_class.localeCompare(b.crop_class) : b.crop_class.localeCompare(a.crop_class));
    }
    setCrops(sortedData);
    setCurrentSort({ method: sortBy, order }); // Update current sorting method
    setModalVisible(false); // Close modal after sorting
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
        <Text className="text-red-500">Error loading data: {error.message}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="p-4 py-1 flex-row items-center space-x-3 bg-white shadow-sm">
        <TouchableOpacity
          className="flex w-10 h-10 items-center justify-center rounded-lg bg-[#00B251] shadow-md"
          onPress={() => navigation.navigate("Filter Products")}
        >
          <Icon name="filter" size={18} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex w-10 h-10 items-center justify-center rounded-lg bg-[#00B251] shadow-md"
          onPress={() => setModalVisible(true)}
        >
          <Icon name="sort" size={18} color="white" />
        </TouchableOpacity>
        <View className="flex-1 flex-row bg-gray-100 rounded-lg border border-[#00B251] shadow-sm items-center px-2">
          <Icon name="search" size={16} color="gray" />
          <TextInput
            placeholder="Search products..."
            className="p-2 pl-2 flex-1 text-xs text-gray-700"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {/* Product List */}
      <ScrollView className="p-4">
        <View className="flex-row flex-wrap justify-between">
          {filteredCrops.map(item => (
            <CategoryItemCard key={item.crop_id} item={item} />
          ))}
        </View>
      </ScrollView>

      {shopData && (
        <TouchableOpacity
          className="absolute flex-row items-center bottom-5 right-5 bg-[#00B251] rounded-full p-4 shadow-lg"
          onPress={() => navigation.navigate("Add Product")}
        >
          <Icon name="plus" size={20} color="white" />
          <Text className="text-white ml-2 text-base font-bold">Add Product</Text>
        </TouchableOpacity>
      )}



      {/* Sort Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg shadow-lg p-6 w-4/5">
            <Text className="text-xl font-bold mb-6 text-center">Sort By</Text>

            {sortOptions.map(option => (
              <View key={option.method} className="mb-4">
                <Text className="text-gray-600 font-medium">{option.method.charAt(0).toUpperCase() + option.method.slice(1)}</Text>
                <View className="flex-row justify-between">
                  <TouchableOpacity
                    onPress={() => handleSort(option.method, 'asc')}
                    className={`flex-1 p-3 rounded-lg border ${currentSort.method === option.method && currentSort.order === 'asc' ? 'bg-green-300' : 'bg-white'} border-gray-300 flex-row items-center justify-center shadow-sm`}
                  >
                    <Icon name={option.iconAsc} size={16} color={currentSort.method === option.method && currentSort.order === 'asc' ? 'white' : 'black'} />
                    <Text className={`ml-2 ${currentSort.method === option.method && currentSort.order === 'asc' ? 'text-white' : 'text-black'}`}>Descending</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleSort(option.method, 'desc')}
                    className={`flex-1 ml-2 p-3 rounded-lg border ${currentSort.method === option.method && currentSort.order === 'desc' ? 'bg-green-300' : 'bg-white'} border-gray-300 flex-row items-center justify-center shadow-sm`}
                  >
                    <Icon name={option.iconDesc} size={16} color={currentSort.method === option.method && currentSort.order === 'desc' ? 'white' : 'black'} />
                    <Text className={`ml-2 ${currentSort.method === option.method && currentSort.order === 'desc' ? 'text-white' : 'text-black'}`}>Ascending</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <Pressable onPress={() => setModalVisible(false)} className="mt-6 p-3 bg-[#00B251] rounded-md shadow-md">
              <Text className="text-white text-center font-semibold">Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>


  );
}

export default FeaturedProductScreen;
