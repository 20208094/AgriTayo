import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5"; 
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";

const fetchCategories = async () => {
  try {
    const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_categories`, {
      headers: {
        "x-api-key": REACT_NATIVE_API_KEY,
      },
    });
    const allCategories = await response.json();
    return allCategories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    Alert.alert("Error", "Could not fetch categories, please try again later.");
    return [];
  }
};

const fetchSubCategories = async () => {
  try {
    const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_sub_categories`, {
      headers: {
        "x-api-key": REACT_NATIVE_API_KEY,
      },
    });
    const allSubCategories = await response.json();
    return allSubCategories;
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    Alert.alert("Error", "Could not fetch subcategories, please try again later.");
    return [];
  }
};

const categoryIcons = {
  Vegetables: "carrot",
  Fruits: "apple-alt",
  Spices: "pepper-hot",
  Seedlings: "seedling",
  Plants: "leaf",
  Flowers: "spa",
};

function AnalyticScreen({ navigation }) {
  const [categoryData, setCategoryData] = useState({});
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const categories = await fetchCategories();
      const subCategories = await fetchSubCategories();

      // Transform data into categoryData format
      const formattedData = categories.reduce((acc, category) => {
        acc[category.crop_category_name] = subCategories
          .filter(subCat => subCat.crop_category_id === category.crop_category_id)
          .map(subCat => ({
            id: subCat.crop_sub_category_id,
            name: subCat.crop_sub_category_name
          }));
        return acc;
      }, {});

      setCategoryData(formattedData);
    };

    loadData();
  }, []);

  const toggleExpand = (category) => {
    if (expandedCategory === category) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <ScrollView>
        {Object.keys(categoryData).map((categoryKey) => (
          <View key={categoryKey} style={{ marginVertical: 8, marginHorizontal: 16 }}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 16,
                backgroundColor: "#fff",
                borderRadius: 12,
              }}
              onPress={() => toggleExpand(categoryKey)}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon
                  name={categoryIcons[categoryKey] || "question-circle"}
                  size={20}
                  color="#00B251"
                  style={{ marginRight: 10 }}
                />
                <Text style={{ fontSize: 18, fontWeight: "600", color: "#000" }}>
                  {categoryKey}
                </Text>
              </View>
              {expandedCategory === categoryKey ? (
                <Icon name="chevron-up" size={24} color="#00B251" />
              ) : (
                <Icon name="chevron-down" size={24} color="#00B251" />
              )}
            </TouchableOpacity>
            {expandedCategory === categoryKey &&
              categoryData[categoryKey].map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={{
                    marginLeft: 32,
                    marginTop: 8,
                    padding: 12,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 12,
                  }}
                  onPress={() =>
                    navigation.navigate("Market Analytics", {
                      category: categoryData[categoryKey],
                      selectedItemId: item.id,
                    })
                  }
                >
                  <Text style={{ fontSize: 16, color: "#00B251" }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default AnalyticScreen;
