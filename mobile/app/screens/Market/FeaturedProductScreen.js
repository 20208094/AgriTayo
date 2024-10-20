import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, ActivityIndicator, Modal, TextInput } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import placeholderimg from '../../assets/placeholder.png';
import Icon from "react-native-vector-icons/FontAwesome5";
import { REACT_NATIVE_API_KEY } from '@env';

const CategoryItemCard = ({ item }) => {

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
        <Text className="text-sm text-gray-600 mt-1">{item.crop_description}</Text>
        <Text className="text-base font-bold text-green-600 mt-2">₱ {item.crop_price}</Text>
        <Text className="text-sm text-gray-600">⭐ {item.crop_rating}</Text>
      </View>
    </TouchableOpacity>
  );
};

function FeaturedProductScreen({ route }) {
  const { category, selectedItemId, selectedProduct: initialSelectedProduct, searchResults } = route.params || {};
  const [selectedProduct, setSelectedProduct] = useState(initialSelectedProduct); // Initialize state with route parameter
  const [crops, setCrops] = useState(searchResults || []); // Use search results from HomePageScreen if available
  const [loading, setLoading] = useState(true);
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

  const API_KEY = REACT_NATIVE_API_KEY;

  useEffect(() => {
    // This ensures the hook is not conditionally rendered
    if (selectedProduct) {
      console.log('Selected product received:', selectedProduct);
    }
    setLoading(false);
  }, [selectedProduct]);

  const fetchAllCrops = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('https://agritayo.azurewebsites.net/api/crops', {
        headers: {
          'x-api-key': API_KEY
        }
      });
      const data = await response.json();
      setCrops(data);  // Set all crops in state
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
        "https://agritayo.azurewebsites.net/api/crop_categories",
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
        "https://agritayo.azurewebsites.net/api/crop_sub_categories",
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
      const response = await fetch('https://agritayo.azurewebsites.net/api/crops', {
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

  const fetchCrops = useCallback(async (subCategoryId) => {
    try {
      setLoading(true);
      const response = await fetch('https://agritayo.azurewebsites.net/api/crops', {
        headers: {
          'x-api-key': API_KEY
        }
      });
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

  const toggleCategoriesModal = () => {
    setShowCategoriesModal(prevState => !prevState);
  };

  const toggleCategorySelection = (categoryId) => {
    const isSelected = selectedCategories.includes(categoryId);

    const updatedSelectedCategories = isSelected
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(updatedSelectedCategories);

    // Reset selectedProduct when changing categories
    if (!isSelected) {
      // Clear the selected product if a new category is selected
      setSelectedProduct(null);
    }

    const subCategoriesForSelectedCategory = subCategories
      .filter(subCategory => subCategory.crop_category_id === categoryId)
      .map(subCategory => subCategory.crop_sub_category_id);

    setSelectedSubCategories(prevSelectedSubCategories => {
      if (isSelected) {
        return prevSelectedSubCategories.filter(id => !subCategoriesForSelectedCategory.includes(id));
      } else {
        return [...new Set([...prevSelectedSubCategories, ...subCategoriesForSelectedCategory])];
      }
    });

    setActiveSubCategories(prevActiveSubCategories => ({
      ...prevActiveSubCategories,
      [categoryId]: !prevActiveSubCategories[categoryId],
    }));

  };

  const toggleDropdown = (categoryId) => {
    setOpenDropdown(prevState => ({
      ...prevState,
      [categoryId]: !prevState[categoryId]
    }));
  };


  const toggleSubCategorySelection = (subCategoryId, categoryId) => {
    const subCategoriesForSelectedCategory = subCategories
      .filter(subCategory => subCategory.crop_category_id === categoryId)
      .map(subCategory => subCategory.crop_sub_category_id);

    setSelectedSubCategories(prevSelectedSubCategories => {
      const isSelected = prevSelectedSubCategories.includes(subCategoryId);

      let updatedSelectedSubCategories;
      if (isSelected) {
        updatedSelectedSubCategories = prevSelectedSubCategories.filter(id => id !== subCategoryId);
      } else {
        updatedSelectedSubCategories = [...prevSelectedSubCategories, subCategoryId];
      }

      const allSelected = subCategoriesForSelectedCategory.every(id =>
        updatedSelectedSubCategories.includes(id)
      );

      if (allSelected) {
        setOpenDropdown(prevState => ({
          ...prevState,
          [categoryId]: false,
        }));
      }

      return updatedSelectedSubCategories;
    });
  };

  const toggleAllSubCategories = (categoryId) => {
    const subCategoriesForSelectedCategory = subCategories
      .filter(subCategory => subCategory.crop_category_id === categoryId)
      .map(subCategory => subCategory.crop_sub_category_id);

    const allSelectedForCategory = subCategoriesForSelectedCategory.every(subCategoryId =>
      selectedSubCategories.includes(subCategoryId)
    );

    setSelectedSubCategories(prevSelectedSubCategories => {
      if (allSelectedForCategory) {
        return prevSelectedSubCategories.filter(id => !subCategoriesForSelectedCategory.includes(id));
      } else {
        return [...new Set([...prevSelectedSubCategories, ...subCategoriesForSelectedCategory])];
      }
    });

    setActiveSubCategories(prevActiveSubCategories => ({
      ...prevActiveSubCategories,
      [categoryId]: !allSelectedForCategory,
    }));
  };

  const closeModalAndUpdateCrops = (categoryId) => {
    setOpenDropdown(prevState => ({
      ...prevState,
      [categoryId]: false,
    }));

    fetchCropsFiltering();
  };

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

  const filteredCrops = crops.filter(crop =>
    crop.crop_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <View className="p-4 flex-row align-middle items-center">
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

      <View className="flex-row items-center p-4">
        <TouchableOpacity
          className="bg-green-500 rounded-full px-4 py-2"
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
              <View key={categoryId} className="flex-row items-center mr-2">
                <TouchableOpacity
                  className="bg-gray-200 rounded-full px-4 py-2 flex-row justify-between items-center"
                  onPress={() => toggleDropdown(categoryId)}
                >
                  <Text>{category.crop_category_name}</Text>

                  <TouchableOpacity
                    className="ml-2"
                    onPress={() => {
                      setSelectedCategories(prevSelectedCategories =>
                        prevSelectedCategories.filter(id => id !== categoryId)
                      );

                      const subCategoriesForSelectedCategory = subCategories
                        .filter(subCategory => subCategory.crop_category_id === categoryId)
                        .map(subCategory => subCategory.crop_sub_category_id);

                      setSelectedSubCategories(prevSelectedSubCategories =>
                        prevSelectedSubCategories.filter(id => !subCategoriesForSelectedCategory.includes(id))
                      );

                      fetchCropsFiltering();
                    }}
                  >
                    <Text className="text-gray-500 font-bold">❌</Text>
                  </TouchableOpacity>
                </TouchableOpacity>


                <Modal
                  visible={openDropdown[categoryId] === true}
                  transparent={true}
                  animationType="slide"
                  onRequestClose={() => closeModalAndUpdateCrops(categoryId)}
                >
                  <TouchableOpacity
                    activeOpacity={1}
                    className="flex-1 justify-end bg-black/50"
                    onPress={() => closeModalAndUpdateCrops(categoryId)}
                  >
                    <TouchableOpacity
                      activeOpacity={1}
                      className="bg-white bg-opacity-50 p-4 rounded-t-lg shadow-lg"
                      onPress={() => { }}
                    >
                      <Text className="text-lg font-bold mb-4">{category.crop_category_name}</Text>

                      <ScrollView>
                        <TouchableOpacity
                          className={`flex-row items-center p-2 ${subCategories
                            .filter(subCategory => subCategory.crop_category_id === categoryId)
                            .every(subCategory => selectedSubCategories.includes(subCategory.crop_sub_category_id))
                            ? 'bg-green-100' : ''
                            }`}
                          onPress={() => toggleAllSubCategories(categoryId)}
                        >
                          <Text className="flex-1 font-bold">All</Text>
                          {subCategories
                            .filter(subCategory => subCategory.crop_category_id === categoryId)
                            .every(subCategory => selectedSubCategories.includes(subCategory.crop_sub_category_id)) && (
                              <Text className="text-green-500">❌</Text>
                            )}
                        </TouchableOpacity>
                        {subCategories
                          .filter(subCategory => subCategory.crop_category_id === categoryId)
                          .map(subCategory => (
                            <TouchableOpacity
                              key={subCategory.crop_sub_category_id}
                              className={`flex-row items-center p-2 ${selectedSubCategories.includes(subCategory.crop_sub_category_id) ? 'bg-green-100' : ''
                                }`}
                              onPress={() => toggleSubCategorySelection(subCategory.crop_sub_category_id, categoryId)}
                            >
                              <Text className="flex-1">{subCategory.crop_sub_category_name}</Text>
                              {selectedSubCategories.includes(subCategory.crop_sub_category_id) && (
                                <Text className="text-green-500">❌</Text>
                              )}
                            </TouchableOpacity>
                          ))}
                      </ScrollView>

                      <TouchableOpacity
                        className="bg-green-500 rounded-full px-4 py-2 mt-4"
                        onPress={() => closeModalAndUpdateCrops(categoryId)}
                      >
                        <Text className="text-white text-center">Close</Text>
                      </TouchableOpacity>

                    </TouchableOpacity>
                  </TouchableOpacity>
                </Modal>
              </View>
            );
          })}
        </ScrollView>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showCategoriesModal}
        onRequestClose={toggleCategoriesModal}
      >
        <TouchableOpacity
          activeOpacity={1}
          className="flex-1 justify-end bg-black/50"
          onPress={toggleCategoriesModal}
        >
          <TouchableOpacity
            activeOpacity={1}
            className="bg-white bg-opacity-50 p-4 rounded-t-lg shadow-lg"
            onPress={() => { }}
          >
            <Text className="text-lg font-bold mb-4">Select Categories</Text>
            <ScrollView>
              {categories.map(category => (
                <TouchableOpacity
                  key={category.crop_category_id}
                  className={`flex-row items-center p-2 ${selectedCategories.includes(category.crop_category_id) ? 'bg-green-100' : ''
                    }`}
                  onPress={() => toggleCategorySelection(category.crop_category_id)}
                >
                  <Text className="flex-1">{category.crop_category_name}</Text>
                  {selectedCategories.includes(category.crop_category_id) && (
                    <Text className="text-green-500">❌</Text>
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
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Product List */}
      <ScrollView className="p-4">
        <View className="flex-row flex-wrap justify-between">
          {filteredCrops.map(item => (
            <CategoryItemCard key={item.crop_id} item={item} />
          ))}
        </View>

        {/* Display selected product at the top */}
        {selectedProduct && (
          <View className="mb-6">
            <CategoryItemCard item={selectedProduct} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default FeaturedProductScreen;
