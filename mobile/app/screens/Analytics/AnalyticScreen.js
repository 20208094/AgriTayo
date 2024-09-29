import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5"; 
import { useNavigation } from "@react-navigation/native";

const categoryData = {
  Vegetables: [
    { id: 1, name: "Potato" },
    { id: 2, name: "Carrot" },
    { id: 3, name: "Tomato" },
    { id: 4, name: "Lettuce" },
    { id: 5, name: "Spinach" },
    { id: 6, name: "Broccoli" },
    { id: 7, name: "Onion" },
    { id: 8, name: "Cucumber" },
    { id: 9, name: "Bell Pepper" },
    { id: 10, name: "Zucchini" },
  ],
  Fruits: [
    { id: 1, name: "Apple" },
    { id: 2, name: "Banana" },
    { id: 3, name: "Orange" },
    { id: 4, name: "Strawberry" },
    { id: 5, name: "Grape" },
    { id: 6, name: "Mango" },
    { id: 7, name: "BlueBerry" },
    { id: 8, name: "Pineapple" },
    { id: 9, name: "Watermelon" },
    { id: 10, name: "Peach" },
  ],
  Spices: [
    { id: 1, name: "Turmeric" },
    { id: 2, name: "Cumin" },
    { id: 3, name: "Pepper" },
    { id: 4, name: "Cinnamon" },
    { id: 5, name: "Coriander" },
    { id: 6, name: "Ginger" },
    { id: 7, name: "Clove" },
    { id: 8, name: "Cardamom" },
    { id: 9, name: "Fennel" },
    { id: 10, name: "Mustard Seed" },
  ],
  Seedlings: [
    { id: 1, name: "Tomato Seedlings" },
    { id: 2, name: "Basil Seedlings" },
    { id: 3, name: "Sunflower Seedlings" },
    { id: 4, name: "Lettuce Seedlings" },
    { id: 5, name: "Cucumber Seedlings" },
    { id: 6, name: "Paper Seedlings" },
    { id: 7, name: "Marigold Seedlings" },
    { id: 8, name: "Mint Seedlings" },
    { id: 9, name: "Cilantaro Seedlings" },
    { id: 10, name: "Parsely Seedlings" },
  ],
  Plants: [
    { id: 1, name: "Spider Plant" },
    { id: 2, name: "Aloe Vera" },
    { id: 3, name: "Rose" },
    { id: 4, name: "Lavender" },
    { id: 5, name: "Snake Plant" },
    { id: 6, name: "Peace Lily" },
    { id: 7, name: "Pothos" },
    { id: 8, name: "Jade Plant" },
    { id: 9, name: "Hibiscus" },
    { id: 10, name: "Bamboo Plant" },
  ],
  Flowers: [
    { id: 1, name: "Rose" },
    { id: 2, name: "Tulip" },
    { id: 3, name: "Marigold" },
    { id: 4, name: "Sunflower" },
    { id: 5, name: "Daisy" },
    { id: 6, name: "Lily" },
    { id: 7, name: "Orchid" },
    { id: 8, name: "Daffodil" },
    { id: 9, name: "Chrysanthemum" },
    { id: 10, name: "Peony" },
  ],
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
  const [expandedCategory, setExpandedCategory] = useState(null);

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
                  name={categoryIcons[categoryKey]}
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
