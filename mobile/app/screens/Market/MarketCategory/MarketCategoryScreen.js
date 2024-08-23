import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native'; 
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from "@react-navigation/native";
import { styled } from 'nativewind';
import placeholderimg from '../../../assets/placeholder.png'; // Import the placeholder image
import { REACT_NATIVE_API_KEY } from '@env'; // Import your API key

const Tab = createMaterialTopTabNavigator();

// Define a component for displaying each item in the tab
const CategoryItemCard = ({ item }) => {
  const navigation = useNavigation(); // Get navigation object

  return (
    <TouchableOpacity
      className="w-40 bg-white rounded-lg shadow-md mb-4 mx-2"
      onPress={() => navigation.navigate('Product Details', { product: item })} // Navigate with crop data
    >
      <Image
        source={item.crop_image_url ? { uri: item.crop_image_url } : placeholderimg}
        className="w-full h-24 rounded-t-lg"
        resizeMode="cover"
      />
      <View className="p-2">
        <Text className="text-lg font-semibold text-gray-800">{item.crop_name}</Text>
        <Text className="text-sm text-gray-600 mt-1">{item.crop_description}</Text>
        <Text className="text-base font-bold text-green-700 mt-2">₱ {item.crop_price}</Text>
        <Text className="text-sm text-gray-600">⭐ {item.crop_rating}</Text>
      </View>
    </TouchableOpacity>
  );
};

function MarketCategoryScreen({ route }) {
  const { category, selectedItemId } = route.params;
  const [crops, setCrops] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingTab, setLoadingTab] = useState(null); // Track loading state for each tab
  const API_KEY = REACT_NATIVE_API_KEY;

  // Fetch crops data from API
  const fetchCrops = useCallback(async (subCategoryId) => {
    try {
      setLoadingTab(subCategoryId); // Set loading state for the tab being fetched
      const response = await fetch('https://agritayo.azurewebsites.net/api/crops', {
        headers: {
          'x-api-key': API_KEY
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      // Filter crops based on the selected sub-category ID
      const filteredCrops = data.filter(crop => crop.sub_category_id === subCategoryId);
      setCrops(prevCrops => ({ ...prevCrops, [subCategoryId]: filteredCrops }));
    } catch (error) {
      setError(error);
      console.error('Error fetching crops data:', error);
    } finally {
      setLoading(false);
      setLoadingTab(null); // Reset loading state after fetch
    }
  }, [API_KEY]);

  // Fetch crops when screen is focused or tab changes
  useEffect(() => {
    if (selectedItemId) {
      fetchCrops(selectedItemId);
    }
  }, [selectedItemId, fetchCrops]);

  if (loading && !loadingTab) {
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
    <SafeAreaView className="flex-1 bg-gray-100">
      <Tab.Navigator
        screenOptions={{
          swipeEnabled: true,
          tabBarScrollEnabled: true,
          lazy: true,
          tabBarStyle: { backgroundColor: 'white', elevation: 4 },
          tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
          tabBarIndicatorStyle: { backgroundColor: '#00B251' },
          tabBarActiveTintColor: '#00B251',
          tabBarInactiveTintColor: '#757575',
        }}
        initialRouteName={category.find(item => item.crop_sub_category_id === selectedItemId)?.crop_sub_category_name ?? category[0]?.crop_sub_category_name}
      >
        {category.map(item => (
          <Tab.Screen 
            key={item.crop_sub_category_id} 
            name={item.crop_sub_category_name}
            options={{ title: item.crop_sub_category_name }}
            listeners={{
              focus: () => {
                if (!crops[item.crop_sub_category_id]) {
                  fetchCrops(item.crop_sub_category_id); // Fetch crops for the selected tab
                }
              }
            }}
          >
            {() => (
              <ScrollView className="flex-1 p-4 bg-gray-100">
                {/* <Text className="text-lg font-semibold text-gray-800 mb-2">Items in {item.crop_sub_category_name}</Text> */}
                {loadingTab === item.crop_sub_category_id ? (
                  <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#0000ff" />
                  </View>
                ) : (
                  <View className="flex-row flex-wrap justify-between">
                    {(crops[item.crop_sub_category_id] || []).map(crop => (
                      <CategoryItemCard key={crop.crop_id} item={crop} />
                    ))}
                  </View>
                )}
              </ScrollView>
            )}
          </Tab.Screen>
        ))}
      </Tab.Navigator>
    </SafeAreaView>
  );
}

export default styled(MarketCategoryScreen);
