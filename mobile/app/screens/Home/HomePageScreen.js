import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  FlatList,
  Image
} from "react-native";
import SearchBarC, {
  NotificationIcon,
  MessagesIcon,
  MarketIcon,
} from "../../components/SearchBarC";
import { useNavigation } from "@react-navigation/native";
import { styled } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { REACT_NATIVE_API_KEY } from "@env"; // Make sure to have API key

// Category Card Component
const MarketCategoryCard = ({ cropCategory }) => {
  const navigation = useNavigation();

  const getImageSource = () => {
    const { crop_category_image_url } = cropCategory;
    if (typeof crop_category_image_url === 'string' && crop_category_image_url.trim() !== '') {
      return { uri: crop_category_image_url };
    }
    return logo; // Return default image if no valid URL
  };

  return (
    <SafeAreaView className="bg-white rounded-lg shadow-lg m-2 flex-1 overflow-hidden">
      <TouchableOpacity
        onPress={() => navigation.navigate('Market Subcategory', { category: cropCategory.crop_category_id })}
        className="flex-1"
      >
        <View>
          <Image 
            source={getImageSource()} 
            className="w-full h-40 object-cover" 
          />
          <View className="p-3 bg-gray-50">
            <Text className="text-lg font-bold text-gray-800 text-center">
              {cropCategory.crop_category_name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};


function HomePageScreen() {
  const navigation = useNavigation();
  const [showAgriTutorial, setShowAgriTutorial] = useState(true);
  const [userData, setUserData] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [categories, setCategories] = useState([]);

  const API_KEY = REACT_NATIVE_API_KEY;

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://agritayo.azurewebsites.net/api/crop_categories', {
        headers: {
          'x-api-key': API_KEY
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching crop categories:', error);
    }
  };

  // Fetch categories when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [])
  );

  // Fetch crops data (from MarketCategoryScreen.js)
  const fetchCrops = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('https://agritayo.azurewebsites.net/api/crops', {
        headers: {
          'x-api-key': API_KEY
        }
      });
      const data = await response.json();
      setCrops(data); // Save all crops
    } catch (error) {
      console.error("Error fetching crops data:", error);
    } finally {
      setLoading(false);
    }
  }, [API_KEY]);

  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  // Handle search query
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      // Filter crops based on the search query
      const results = crops.filter((crop) =>
        crop.crop_name.toLowerCase().includes(text.toLowerCase())
      );
      console.log("Filtered results: ", results);  // Debug filtered crops
      setFilteredCrops(results);
      setShowResults(true);  // Show search results dropdown
    } else {
      setShowResults(false);  // Hide search results when query is empty
    }
  };

  // Clear search input and hide results
  const clearSearch = () => {
    setSearchQuery('');  // Clear search query
    setShowResults(false);  // Hide results
  };

  const handleSearchItemPress = (product) => {
    setSearchQuery('');
    setShowResults(false);
    console.log("Navigating to MarketCategoryScreen with product: ", product); // Debug product navigation
    navigation.navigate("Product List", { selectedProduct: product });  // Pass product data to MarketCategoryScreen
  };

  const getAsyncUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("userData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData)) {
          const user = parsedData[0];
          setUserData(user);
        } else {
          setUserData(parsedData);
        }
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getAsyncUserData();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Sticky Header */}
      <View className="bg-gray-100 sticky top-0 z-10">
        <View className="flex-row justify-between items-center px-4 pt-8">
          <Text className="text-green-600 text-3xl font-bold">Hi {userData.firstname}!</Text>
          <View className="flex-row">
            <MarketIcon onPress={() => navigation.navigate("CartScreen")} />
            <NotificationIcon
              onPress={() => navigation.navigate("Notifications")}
            />
            <MessagesIcon
              onPress={() => navigation.navigate("ChatListScreen")}
            />
          </View>
        </View>
        <Text className="px-4 text-base text-gray-600 mt-2">
          Enjoy our services!
        </Text>
        <View className="relative mt-4 px-4 mb-4">
          {/* Search Bar */}
          <View className="flex-row items-center bg-white p-3 rounded-lg shadow-md">
            <TextInput
              placeholder="Search crops..."
              value={searchQuery}
              onChangeText={handleSearch}
              className="flex-1 pr-4"
            />
            {/* Clear Button (X) */}
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} className="ml-2">
                <Text className="text-gray-500 text-lg">X</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Show search results below the search bar */}
          {showResults && (
            <FlatList
              data={filteredCrops}
              keyExtractor={(item) => item.crop_id.toString()} // Ensure crop_id exists in the data
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="bg-gray-100 p-2 border-b border-gray-300"
                  onPress={() => handleSearchItemPress(item)}
                >
                  <Text>{item.crop_name}</Text>
                </TouchableOpacity>
              )}
              style={{ backgroundColor: 'white', marginTop: 5, borderRadius: 5, maxHeight: 150 }}
            />
          )}
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView>
        {/* Featured Products Section */}
        <View className="mt-4 px-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-2xl font-bold">Market Categories</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Market Category")}
            >
              <Text className="text-green-600">View All</Text>
            </TouchableOpacity>
          </View>
          {/* Add Featured Products Logic Here */}
          <View className="flex-row flex-wrap justify-between">
            {categories.map((category) => (
              <View key={category.crop_category_id} className="w-[48%]">
                <MarketCategoryCard cropCategory={category} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default styled(HomePageScreen);
