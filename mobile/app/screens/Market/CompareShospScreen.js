import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, TextInput, Modal, Pressable } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome5";
import placeholderimg from '../../assets/placeholder.png';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";

function CompareShopsScreen({ route }) {
  const navigation = useNavigation();
  const { filter_category_id, filter_sub_category_id, filter_variety_id, filter_class, filter_size_id, filter_price_range, filter_quantity } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSort, setCurrentSort] = useState({ method: 'price', order: 'asc' });

  const [combinedData, setCombinedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCrops = async () => {
    try {
      // Fetch crops and related data (same as the original code)
      const cropsResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crops`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });

      const categoryResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_categories`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });

      const subcategoryResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_sub_categories`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });

      const varietyResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_varieties`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });

      const varietySizeResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_variety_sizes`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });

      const sizeResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_sizes`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });

      const metricResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/metric_systems`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });

      const shopResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/shops`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });

      const crops = await cropsResponse.json();
      const categories = await categoryResponse.json();
      const subcategories = await subcategoryResponse.json();
      const varieties = await varietyResponse.json();
      const variety_sizes = await varietySizeResponse.json();
      const sizes = await sizeResponse.json();
      const metrics = await metricResponse.json();
      const shops = await shopResponse.json();

      const combinedData = crops.map(crop => {
        const categoryData = categories.find(cat => cat.crop_category_id === crop.category_id);
        const subcategoryData = subcategories.find(sub => sub.crop_sub_category_id === crop.sub_category_id);
        const varietyData = varieties.find(variety => variety.crop_variety_id === crop.crop_variety_id);
        const sizeData = variety_sizes.find(varSize => varSize.crop_variety_id === crop.crop_variety_id);
        const actualSize = sizes.find(size => size.crop_size_id === (sizeData ? sizeData.crop_size_id : null));
        const metricData = metrics.find(metric => metric.metric_system_id === crop.metric_system_id);
        const shopData = shops.find(shop => shop.shop_id === crop.shop_id);

        return {
          ...crop,
          category: categoryData ? categoryData : null,
          subcategory: subcategoryData ? subcategoryData : null,
          variety: varietyData ? varietyData : null,
          size: actualSize ? actualSize : null,
          metric: metricData ? metricData : null,
          shop: shopData ? shopData : null
        };
      });

      const filterCrops = combinedData.filter(crop => {
        const matchesCategory = filter_category_id ? crop.category_id === Number(filter_category_id) : true;
        const matchesSubCategory = filter_sub_category_id ? crop.sub_category_id === Number(filter_sub_category_id) : true;
        const matchesVariety = filter_variety_id ? crop.variety.crop_variety_id === Number(filter_variety_id) : true;
        const matchesSize = filter_size_id ? crop.crop_size_id === Number(filter_size_id) : true;
        const matchesQuantity = filter_quantity[0] !== undefined ? crop.crop_quantity >= Number(filter_quantity[0]) : true;
        const matchesPrice = filter_price_range[0] !== undefined ? crop.crop_price >= Number(filter_price_range[0]) : true;
        const matchesClass = filter_class.length > 0 ? filter_class.includes(crop.crop_class) : true;

        return matchesCategory && matchesSubCategory && matchesVariety && matchesSize && matchesQuantity && matchesPrice && matchesClass;
      });

      const sortPrice = filterCrops.sort((a, b) => a.crop_price - b.crop_price);

      setCombinedData(sortPrice);
      setFilteredData(sortPrice);
    } catch (error) {
      console.error("Error fetching shops:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCrops();
    }, [filter_category_id, filter_sub_category_id, filter_variety_id, filter_class, filter_size_id, filter_price_range, filter_quantity])
  );

  // Handle search filtering
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredData(combinedData);  // Reset to all data if query is empty
    } else {
      const lowercasedQuery = query.toLowerCase();
      const searchResults = combinedData.filter(crop =>
        crop.shop.shop_name.toLowerCase().includes(lowercasedQuery) ||
        crop.crop_name.toLowerCase().includes(lowercasedQuery) ||
        crop.size.crop_size_name.toLowerCase().includes(lowercasedQuery) ||
        (crop.crop_rating && crop.crop_rating.toString().includes(lowercasedQuery)) ||
        (crop.crop_quantity && crop.crop_quantity.toString().includes(lowercasedQuery)) ||
        crop.crop_price.toString().includes(lowercasedQuery) ||
        crop.crop_class.toLowerCase().includes(lowercasedQuery)
      );

      setFilteredData(searchResults);
    }
  };

  const sortOptions = [
    { method: 'price', iconAsc: 'sort-amount-down-alt', iconDesc: 'sort-amount-up' },
    { method: 'rating', iconAsc: 'sort-amount-down-alt', iconDesc: 'sort-amount-up' },
    { method: 'available', iconAsc: 'sort-amount-down-alt', iconDesc: 'sort-amount-up' }
  ];

  const handleSort = (sortBy, order) => {
    let sortedData;
    if (sortBy === 'price') {
      sortedData = [...filteredData].sort((a, b) => order === 'asc' ? a.crop_price - b.crop_price : b.crop_price - a.crop_price);
    } else if (sortBy === 'rating') {
      sortedData = [...filteredData].sort((a, b) => order === 'asc' ? a.crop_rating - b.crop_rating : b.crop_rating - a.crop_rating);
    } else if (sortBy === 'available') {
      sortedData = [...filteredData].sort((a, b) => order === 'asc' ? a.crop_quantity - b.crop_quantity : b.crop_quantity - a.crop_quantity);
    } else if (sortBy === 'class') {
      sortedData = [...filteredData].sort((a, b) => order === 'asc' ? a.crop_class.localeCompare(b.crop_class) : b.crop_class.localeCompare(a.crop_class));
    }
    setFilteredData(sortedData);
    setCurrentSort({ method: sortBy, order }); // Update current sorting method
    setModalVisible(false); // Close modal after sorting
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header with Search and Filter */}
      <View className="p-4 py-1 flex-row items-center space-x-3 bg-white shadow-sm">
        {/* Filter Button */}
        <TouchableOpacity
          className="flex w-10 h-10 items-center justify-center rounded-lg bg-[#00B251] shadow-md"
          onPress={() => navigation.goBack("Filter Products", {
            filter_category_id: filter_category_id || null,
            filter_sub_category_id: filter_sub_category_id || null,
            filter_variety_id: filter_variety_id || null,
            filter_class: filter_class || [],
            filter_size_id: filter_size_id || null,
            filter_price_range: filter_price_range || [],
            filter_quantity: filter_quantity || []
          })}
        >
          <Icon name="filter" size={18} color="white" />
        </TouchableOpacity>

        {/* Sort Button */}
        <TouchableOpacity
          className="flex w-10 h-10 items-center justify-center rounded-lg bg-[#00B251] shadow-md"
          onPress={() => setModalVisible(true)}
        >
          <Icon name="sort" size={18} color="white" />
        </TouchableOpacity>

        {/* Search Bar */}
        <View className="flex-1 flex-row bg-gray-100 rounded-lg border border-gray-200 shadow-sm items-center px-2">
          <Icon name="search" size={16} color="gray" />
          <TextInput
            placeholder="Search crops..."
            className="p-2 pl-2 flex-1 text-xs text-gray-700"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

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

      {/* Scrollable Content */}
      <ScrollView className="mt-4">
        <View className="px-4">
          <Text className="text-lg font-bold text-gray-800 my-3">Filtered Products</Text>
          <View className="space-y-3">
            {filteredData.length > 0 ? (
              filteredData.map(crop => (
                <ShopCard
                  key={crop.crop_id}
                  shopName={crop.shop.shop_name}
                  productName={crop.crop_name}
                  price={parseFloat(crop.crop_price).toFixed(2)}
                  available={crop.crop_quantity}
                  rating={crop.crop_rating}
                  shopImage={crop.shop.shop_image_url}
                  metricSymbol={crop.metric.metric_system_symbol}
                  size={crop.size.crop_size_name}
                  cropClass={crop.crop_class}
                />
              ))
            ) : (
              <Text className="text-center text-gray-500">No filtered data</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const ShopCard = ({ shopName, productName, price, available, rating, shopImage, metricSymbol, size, cropClass }) => {
  return (
    <View className="flex-row border p-2 rounded-md shadow-sm bg-white items-center mb-2">
      <View className="flex-1 justify-between">
        <View className="flex-1 flex-row items-center ml-2">
          <View className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
            <Image source={{ uri: shopImage }} className="w-full h-full" />
          </View>
          <Text className="text-base ml-3 font-semibold text-gray-700">{shopName}</Text>
        </View>

        <Text className="text-lg text-center font-extrabold text-[#00B251]">{productName} ({size})</Text>
        <View className="flex-1 flex-row px-3">
          <View className="flex-row w-1/2">
            <View className="ml-2 w-2/5">
              <Text className="text-sm font-bold text-gray-700">Class:</Text>
              <Text className="text-sm font-bold text-gray-700">Rating:</Text>
              <Text className="text-sm font-bold text-gray-700">Available:</Text>
            </View>
            <View className="w-2/5">
              <Text className="text-sm text-gray-700">{cropClass}</Text>
              <Text className="text-sm text-gray-700">{rating}⭐</Text>
              <Text className="text-sm text-gray-700">{available} {metricSymbol}</Text>
            </View>
          </View>
          <View className="justify-center w-1/2">
            <Text className="text-2xl text-center font-bold text-[#00B251]"> ₱{price}/{metricSymbol}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default CompareShopsScreen;
