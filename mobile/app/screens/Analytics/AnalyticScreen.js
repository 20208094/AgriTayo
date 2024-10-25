import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import LoadingAnimation from "../../components/LoadingAnimation";

function AnalyticScreen({ navigation }) {
  const [categoryData, setCategoryData] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
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

      const crops = await cropsResponse.json();
      const categories = await categoryResponse.json();
      const subcategories = await subcategoryResponse.json();
      const varieties = await varietyResponse.json();

      // Combine the varieties with the crops
      const combinedVarieties = varieties.map(variety => {
        const cropsData = crops.filter(crop => crop.crop_variety_id === variety.crop_variety_id);
        return {
          ...variety,
          crops: cropsData ? cropsData : null,
        };
      });

      // Combine the subcategories with the varieties
      const combinedSubcategories = subcategories.map(subcat => {
        const varietiesData = combinedVarieties.filter(variety => variety.crop_sub_category_id === subcat.crop_sub_category_id);
        return {
          ...subcat,
          varieties: varietiesData ? varietiesData : null,
        };
      });

      // Combine the categories with the subcategories
      const combinedCategories = categories.map(cat => {
        const subcategoriesData = combinedSubcategories.filter(subCat => subCat.crop_category_id === cat.crop_category_id);
        return {
          ...cat,
          subcategories: subcategoriesData ? subcategoriesData : null,
        };
      });

      // Set the category data state
      setCategoryData(combinedCategories);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const categoryIcons = {
    Vegetables: "carrot",
    Fruits: "apple-alt",
    Spices: "pepper-hot",
    Seedlings: "seedling",
    Plants: "leaf",
    Flowers: "spa",
  };

  const toggleExpandCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const toggleExpandSubcategory = (subcategoryId) => {
    setExpandedSubcategory(expandedSubcategory === subcategoryId ? null : subcategoryId);
  };

  if (loading) {
    return <LoadingAnimation />
  }

  return (
    <SafeAreaView className="bg-gray-100 flex-1">
      <ScrollView>
        {categoryData.map((category) => (
          <View key={category.crop_category_id} className="my-2 mx-4">
            <TouchableOpacity
              className="flex-row justify-between items-center p-4 bg-white rounded-lg shadow"
              onPress={() => toggleExpandCategory(category.crop_category_id)}
            >
              <View className="flex-row items-center">
                <Icon
                  name={categoryIcons[category.crop_category_name] || "question-circle"}
                  size={20}
                  color="#00B251"
                  className="mr-2"
                />
                <Text className="pl-2 text-lg font-semibold text-black">
                  {category.crop_category_name}
                </Text>
              </View>
              <Icon
                name={expandedCategory === category.crop_category_id ? "chevron-up" : "chevron-down"}
                size={24}
                color="#00B251"
              />
            </TouchableOpacity>
            {expandedCategory === category.crop_category_id && category.subcategories && category.subcategories.map((subcat) => (
              <View key={subcat.crop_sub_category_id}>
                <TouchableOpacity
                  className="ml-8 mt-2 p-3 bg-gray-200 rounded-lg"
                  onPress={() => toggleExpandSubcategory(subcat.crop_sub_category_id)}
                >
                  <View className="flex-row justify-between items-center">
                    <Text className="text-md text-green-600">
                      {subcat.crop_sub_category_name}
                    </Text>
                    <Icon
                      name={expandedSubcategory === subcat.crop_sub_category_id ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#00B251"
                    />
                  </View>
                </TouchableOpacity>
                {expandedSubcategory === subcat.crop_sub_category_id && subcat.varieties && subcat.varieties.map((variety) => (
                  <View key={variety.crop_variety_id} className="ml-12 mt-1">
                    <TouchableOpacity
                      className="p-2 bg-white rounded-lg shadow"
                      onPress={() =>
                        navigation.navigate("Market Analytics", {
                          categoryId: category.crop_category_id,
                          subcategoryId: subcat.crop_sub_category_id,
                          varietyId: variety.crop_variety_id,
                        })
                      }
                    >
                      <Text className="text-sm text-green-600">
                        {variety.crop_variety_name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default AnalyticScreen;
