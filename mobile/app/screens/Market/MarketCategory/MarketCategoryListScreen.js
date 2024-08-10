import React from "react";
import { SafeAreaView, TouchableOpacity, Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";


const categoryData = {
  Vegetables: [
    {
      id: 1,
      name: "Potato",
    },
    {
      id: 2,
      name: "Carrot",
    },
    {
      id: 3,
      name: "Tomato",
    },
    {
      id: 4,
      name: "Lettuce",
    },
    {
      id: 5,
      name: "Spinach",
    },
    {
      id: 6,
      name: "Broccoli",
    },
    {
      id: 7,
      name: "Onion",
    },
    {
      id: 8,
      name: "Cucumber",
    },
    {
      id: 9,
      name: "Bell Pepper",
    },
    {
      id: 10,
      name: "Zucchini",
    },
  ],
  Fruits: [
    {
      id: 1,
      name: "Apple",
    },
    {
      id: 2,
      name: "Banana",
    },
    {
      id: 3,
      name: "Orange",
    },
    {
      id: 4,
      name: "Strawberry",
    },
    {
      id: 5,
      name: "Grape",
    },
    {
      id: 6,
      name: "Mango",
    },
    {
      id: 7,
      name: "BlueBerry",
    },
    {
      id: 8,
      name: "Pineapple",
    },
    {
      id: 9,
      name: "Watermelon",
    },
    {
      id: 10,
      name: "Peach",
    },
  ],
  Spices: [
    {
      id: 1,
      name: "Turmeric",
    },
    {
      id: 2,
      name: "Cumin",
    },
    {
      id: 3,
      name: "Pepper",
    },
    {
      id: 4,
      name: "Cinnamon",
    },
    {
      id: 5,
      name: "Coriander",
    },
    {
      id: 6,
      name: "Ginger",
    },
    {
      id: 7,
      name: "Clove",
    },
    {
      id: 8,
      name: "Cardamom",
    },
    {
      id: 9,
      name: "Fennel",
    },
    {
      id: 10,
      name: "Mustard Seed",
    },
  ],
  Seedlings: [
    {
      id: 1,
      name: "Tomato Seedlings",
    },
    {
      id: 2,
      name: "Basil Seedlings",
    },
    {
      id: 3,
      name: "Sunflower Seedlings",
    },
    {
      id: 4,
      name: "Lettuce Seedlings",
    },
    {
      id: 5,
      name: "Cucumber Seedlings",
    },
    {
      id: 6,
      name: "Paper Seedlings",
    },
    {
      id: 7,
      name: "Marigold Seedlings",
    },
    {
      id: 8,
      name: "Mint Seedlings",
    },
    {
      id: 9,
      name: "Cilantaro Seedlings",
    },
    {
      id: 10,
      name: "Parsely Seedlings",
    },
  ],
  Plants: [
    {
      id: 1,
      name: "Spider Plant",
    },
    {
      id: 2,
      name: "Aloe Vera",
    },
    {
      id: 3,
      name: "Rose",
    },
    {
      id: 4,
      name: "Lavender",
    },
    {
      id: 5,
      name: "Snake Plant",
    },
    {
      id: 6,
      name: "Peace Lily",
    },
    {
      id: 7,
      name: "Pothos",
    },
    {
      id: 8,
      name: "Jade Plant",
    },
    {
      id: 9,
      name: "Hibiscus",
    },
    {
      id: 10,
      name: "Bamboo Plant",
    },
  ],
  Flowers: [
    {
      id: 1,
      name: "Rose",
    },
    {
      id: 2,
      name: "Tulip",
    },
    {
      id: 3,
      name: "Marigold",
    },
    {
      id: 4,
      name: "Sunflower",
    },
    {
      id: 5,
      name: "Daisy",
    },
    {
      id: 6,
      name: "Lily",
    },
    {
      id: 7,
      name: "Orchid",
    },
    {
      id: 8,
      name: "Daffodil",
    },
    {
      id: 9,
      name: "Chrysanthemum",
    },
    {
      id: 10,
      name: "Peony",
    },
  ],
};

function MarketCategoryListScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { category } = route.params;
  
    const items = categoryData[category] || [];
  
    return (
      <SafeAreaView>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() =>
              navigation.navigate("Market Category", {
                category: items, 
                selectedItemId: item.id,
              })
            }
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </SafeAreaView>
    );
  }
  
  export default MarketCategoryListScreen;
