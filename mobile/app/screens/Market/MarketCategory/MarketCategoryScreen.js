import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { styled } from 'nativewind';
import placeholderimg from '../../../assets/placeholder.png'; // Import the placeholder image

const Tab = createMaterialTopTabNavigator();

// Define a component for displaying each item in the tab
const CategoryItemCard = ({ item }) => (
  <TouchableOpacity className="w-40 bg-white rounded-lg shadow-md mb-4 mx-2">
    <Image
      source={item.crop_image_url ? { uri: item.crop_image_url } : placeholderimg}
      className="w-full h-24 rounded-t-lg"
      resizeMode="cover"
    />
    <View className="p-2">
      <Text className="text-lg font-semibold text-gray-800">{item.crop_name}</Text>
      <Text className="text-sm text-gray-600 mt-1">{item.crop_description || 'No description available'}</Text>
      <Text className="text-base font-bold text-green-700 mt-2">₱ {item.crop_price}</Text>
      <Text className="text-sm text-gray-600">⭐ {item.crop_rating || 'No rating'}</Text>
    </View>
  </TouchableOpacity>
);

function MarketCategoryScreen({ route }) {
  const [cropsData, setCropsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { category, selectedItemId } = route.params;

  // Fetch crop data from API
  const fetchCrops = async () => {
    try {
      const response = await fetch('https://agritayo.azurewebsites.net/api/crops');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCropsData(data);
    } catch (error) {
      setError(error);
      console.error('Error fetching crop data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-red-500">Error loading data: {error.message}</Text>
      </SafeAreaView>
    );
  }

  // Filter crops based on the selected category
  const filteredCrops = cropsData.filter(crop => crop.category_id === selectedItemId);

  if (filteredCrops.length === 0) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-gray-800">No crops found for this category.</Text>
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
        initialRouteName={filteredCrops[0]?.crop_name ?? 'No Crop'}
      >
        {filteredCrops.map(crop => (
          <Tab.Screen 
            key={crop.crop_id} 
            name={crop.crop_name}
            options={{ title: crop.crop_name }}
          >
            {() => (
              <ScrollView className="flex-1 p-4 bg-gray-100">
                <Text className="text-lg font-semibold text-gray-800 mb-2">Crops in {crop.crop_name}</Text>
                <View className="flex-row flex-wrap justify-between">
                  {filteredCrops.map(dataItem => (
                    <CategoryItemCard key={dataItem.crop_id} item={dataItem} />
                  ))}
                </View>
              </ScrollView>
            )}
          </Tab.Screen>
        ))}
      </Tab.Navigator>
    </SafeAreaView>
  );
}

export default styled(MarketCategoryScreen);
