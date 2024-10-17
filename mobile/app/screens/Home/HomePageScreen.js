import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  FlatList
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

function HomePageScreen() {
  const navigation = useNavigation();
  const [showAgriTutorial, setShowAgriTutorial] = useState(true);
  const [userData, setUserData] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const API_KEY = REACT_NATIVE_API_KEY;

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
      console.log("Fetched crops data: ", data);  // Debug the fetched data structure
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

  // Handle click on a search result and navigate to MarketCategoryScreen
  const handleSearchItemPress = (product) => {
    setSearchQuery('');  // Clear search query
    setShowResults(false);  // Hide results
    console.log("Navigating to MarketCategoryScreen with product: ", product); // Debug product navigation
    navigation.navigate("Product List", { selectedProduct: product });  // Pass product data to MarketCategoryScreen
  };

  // Fetch user data from AsyncStorage
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
      <View className="bg-gray-100 shadow-md sticky top-0 z-10">
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
        {/* AgriTutorial Section */}
        {showAgriTutorial && (
          <View className="bg-green-200 p-4 rounded-lg mt-4 mx-4 relative">
            <TouchableOpacity
              className="absolute top-2 right-2 p-2"
              onPress={() => setShowAgriTutorial(false)}
            >
              <Text className="text-green-600 font-bold">X</Text>
            </TouchableOpacity>
            <View className="ml-4">
              <Text className="text-2xl font-bold">AgriTutorial</Text>
              <Text>Want to know how AgriTayo Works? </Text>
              <TouchableOpacity className="bg-green-600 px-3 py-1.5 rounded mt-2 self-start">
                <Text className="text-white font-bold text-sm">Click Here</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Featured Products Section */}
        <View className="mt-4 px-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-2xl font-bold">Featured Products</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Featured Product")}
            >
              <Text className="text-green-600">See All</Text>
            </TouchableOpacity>
          </View>
          {/* Add Featured Products Logic Here */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default styled(HomePageScreen);
