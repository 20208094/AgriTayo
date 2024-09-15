import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, ActivityIndicator, Modal } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import placeholderimg from '../../../assets/placeholder.png';
import { REACT_NATIVE_API_KEY } from '@env';

// Define a component for displaying each item in the list
const CategoryItemCard = ({ item }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      className="w-40 bg-white rounded-lg shadow-md mb-4 mx-2"
      style={{
        padding: 10,
        margin: 8,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 3,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={() => navigation.navigate('Product Details', { product: item })}
    >
      <Image
        source={item.crop_image_url ? { uri: item.crop_image_url } : placeholderimg}
        className="w-full h-24 rounded-t-lg"
        style={{ borderRadius: 10, width: '100%', height: 100 }}
        resizeMode="cover"
      />
      <View className="p-2" style={{ alignItems: 'center', marginTop: 5 }}>
        <Text className="text-lg font-semibold text-gray-800" style={{ fontSize: 16, fontWeight: '600' }}>{item.crop_name}</Text>
        <Text className="text-sm text-gray-600 mt-1" style={{ fontSize: 12, color: '#888' }}>{item.crop_description}</Text>
        <Text className="text-base font-bold text-green-700 mt-2" style={{ fontSize: 14, color: '#28A745' }}>₱ {item.crop_price}</Text>
        <Text className="text-sm text-gray-600" style={{ fontSize: 12, color: '#888' }}>⭐ {item.crop_rating}</Text>
      </View>
    </TouchableOpacity>
  );
};

function MarketCategoryScreen({ route }) {
  const { category, selectedItemId } = route.params;
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [activeSubCategories, setActiveSubCategories] = useState({});
  const [openDropdown, setOpenDropdown] = useState({});
  const API_KEY = REACT_NATIVE_API_KEY;

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://agritayo.azurewebsites.net/api/crop_categories",
        {
          headers: {
            "x-api-key": API_KEY,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching crop categories:", error);
    }
  };

  const toggleCategoriesModal = () => {
    setShowCategoriesModal(!showCategoriesModal);
  };

  const toggleCategorySelection = (categoryId) => {
    setSelectedCategories(prevSelectedCategories =>
      prevSelectedCategories.includes(categoryId)
        ? prevSelectedCategories.filter(id => id !== categoryId)
        : [...prevSelectedCategories, categoryId]
    );
    setActiveSubCategories(prevActiveSubCategories => ({
      ...prevActiveSubCategories,
      [categoryId]: !prevActiveSubCategories[categoryId]
    }));
  };

  const toggleDropdown = (categoryId) => {
    setOpenDropdown(prevState => ({
      ...prevState,
      [categoryId]: !prevState[categoryId]
    }));
  };

  const fetchSubCategories = async () => {
    try {
      const response = await fetch(
        "https://agritayo.azurewebsites.net/api/crop_sub_categories",
        {
          headers: {
            "x-api-key": API_KEY,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setSubCategories(data);
    } catch (error) {
      console.error("Error fetching crop sub-categories:", error);
    }
  };

  const fetchCrops = useCallback(async (subCategoryId) => {
    try {
      setLoading(true);
      const response = await fetch('https://agritayo.azurewebsites.net/api/crops', {
        headers: {
          'x-api-key': API_KEY
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const filteredCrops = data.filter(crop => crop.sub_category_id === subCategoryId);
      setCrops(filteredCrops);
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
  }, []);

  useEffect(() => {
    if (selectedItemId) {
      fetchCrops(selectedItemId);
    }
  }, [selectedItemId, fetchCrops]);

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
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Categories button and selected categories */}
      <View className="flex-row items-center p-4 relative">
        <TouchableOpacity 
          className="bg-green-500 rounded-full px-4 py-2" 
          style={{ paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20 }}
          onPress={toggleCategoriesModal}
        >
          <Text className="text-white">Categories</Text>
        </TouchableOpacity>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="ml-2">
          {selectedCategories.map(categoryId => {
            const category = categories.find(c => c.crop_category_id === categoryId);
            if (!category) return null;

            const filteredSubCategories = subCategories.filter(subCategory => subCategory.crop_category_id === categoryId);

            return (
              <View key={categoryId} style={{ marginRight: 8 }}>
                <TouchableOpacity
                  className="bg-gray-200 rounded-full px-4 py-2"
                  style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 }}
                  onPress={() => toggleDropdown(categoryId)}
                >
                  <Text>{category.crop_category_name}</Text>
                </TouchableOpacity>

                {/* Modal for Dropdown */}
                <Modal
                  visible={openDropdown[categoryId] && filteredSubCategories.length > 1}
                  transparent={true}
                  animationType="fade"
                  onRequestClose={() => toggleDropdown(categoryId)}
                >
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => toggleDropdown(categoryId)}
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent backdrop
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: 'white',
                        borderRadius: 10,
                        padding: 10,
                        width: 250, // Set a fixed width for the dropdown
                        maxHeight: 300, // Limit dropdown height
                      }}
                    >
                      <ScrollView>
                        {filteredSubCategories.map(subCategory => (
                          <TouchableOpacity
                            key={subCategory.crop_sub_category_id}
                            className="bg-gray-100 rounded-full px-4 py-2 mt-2"
                            style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 }}
                            onPress={() => {
                              fetchCrops(subCategory.crop_sub_category_id);
                              toggleDropdown(categoryId);
                            }}
                          >
                            <Text>{subCategory.crop_sub_category_name}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </TouchableOpacity>
                </Modal>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Modal for showing categories */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCategoriesModal}
        onRequestClose={toggleCategoriesModal}
      >
        <View className="flex-1 justify-end">
          <View className="bg-white p-4 rounded-t-lg shadow-lg">
            <Text className="text-lg font-bold mb-4">Select Categories</Text>
            <ScrollView>
              {categories.map(category => (
                <TouchableOpacity
                  key={category.crop_category_id}
                  className="flex-row items-center p-2"
                  onPress={() => toggleCategorySelection(category.crop_category_id)}
                >
                  <Text className="flex-1">{category.crop_category_name}</Text>
                  {selectedCategories.includes(category.crop_category_id) && (
                    <Text className="text-green-500">✔️</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              className="bg-green-500 rounded-full px-4 py-2 mt-4"
              onPress={toggleCategoriesModal}
            >
              <Text className="text-white text-center">Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Product List */}
      <ScrollView className="p-4">
        <View className="flex-row flex-wrap justify-between">
          {crops.map(item => (
            <CategoryItemCard key={item.crop_id} item={item} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default MarketCategoryScreen;
