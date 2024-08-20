import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import logo from '../../assets/logo.png'; // Placeholder image
import { REACT_NATIVE_API_KEY } from '@env';

const MarketCategoryCard = ({ cropCategory }) => {
  const navigation = useNavigation();

  const getImageSource = () => {
    const { crop_category_image_url } = cropCategory;

    if (typeof crop_category_image_url === 'string' && crop_category_image_url.trim() !== '') {
      return { uri: crop_category_image_url };
    }
    
    // If not a valid URL, return the default image
    return logo;
  };

  return (
    <SafeAreaView className="bg-white rounded-lg shadow m-2 w-[45%] mb-3">
      <TouchableOpacity
        onPress={() => navigation.navigate('Market List', { category: cropCategory.crop_category_id })}
      >
        <View className="rounded-t-lg overflow-hidden">
          <Image 
            source={getImageSource()} 
            className="w-full h-28" 
          />
          <View className="p-2.5">
            <Text className="text-base font-bold mb-1.5">
              {cropCategory.crop_category_name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

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
    <ScrollView contentContainerStyle={styles.container}>
      <View className="flex-row flex-wrap justify-between">
        {categories.map((category) => (
          <MarketCategoryCard
            key={category.crop_category_id}
            cropCategory={category}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 1, // Adjust this value as needed to ensure space for the bottom navigation bar
  },
});

export default CropsScreen;
