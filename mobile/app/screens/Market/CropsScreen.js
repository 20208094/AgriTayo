import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import logo from '../../assets/logo.png'; // Placeholder image
import { REACT_NATIVE_API_KEY } from '@env';

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

// Main CropsScreen Component
function CropsScreen() {
  const [categories, setCategories] = useState([]);
  const API_KEY = REACT_NATIVE_API_KEY;

  // Fetch categories function
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

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}>
      <View className="flex-row flex-wrap justify-between">
        {categories.map((category) => (
          <View key={category.crop_category_id} className="w-[48%]">
            <MarketCategoryCard cropCategory={category} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export default CropsScreen;
