import React from "react";
import { SafeAreaView, TouchableOpacity, Text, View, Image, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import placeholderimg from "../../../assets/placeholder.png"; // Import the placeholder image

const categoryData = {
  Vegetables: [
    { id: 1, name: "Potato", description: "Rich in starch and versatile in cooking" },
    { id: 2, name: "Carrot", description: "Good for eyesight and sweet in flavor" },
    { id: 3, name: "Tomato", description: "Juicy and tangy, great in salads" },
    { id: 4, name: "Lettuce", description: "Great for salads and sandwiches" },
    { id: 5, name: "Spinach", description: "High in iron, perfect for smoothies" },
    { id: 6, name: "Broccoli", description: "Rich in vitamins, good for health" },
    { id: 7, name: "Onion", description: "Adds flavor to dishes, can be sautéed or raw" },
    { id: 8, name: "Cucumber", description: "Hydrating and crunchy, great for salads" },
    { id: 9, name: "Bell Pepper", description: "Sweet and colorful, adds crunch to dishes" },
    { id: 10, name: "Zucchini", description: "Versatile and tender, great for grilling" },
  ],
  Fruits: [
    { id: 1, name: "Apple", description: "Sweet and crunchy, a classic fruit" },
    { id: 2, name: "Banana", description: "Rich in potassium and great for snacks" },
    { id: 3, name: "Orange", description: "Citrusy and refreshing, high in vitamin C" },
    { id: 4, name: "Strawberry", description: "Sweet and juicy, perfect for desserts" },
    { id: 5, name: "Grape", description: "Small and sweet, great for snacking" },
    { id: 6, name: "Mango", description: "Tropical and sweet, great for smoothies" },
    { id: 7, name: "BlueBerry", description: "Antioxidant-rich and delicious" },
    { id: 8, name: "Pineapple", description: "Tart and sweet, ideal for tropical dishes" },
    { id: 9, name: "Watermelon", description: "Juicy and hydrating, perfect for summer" },
    { id: 10, name: "Peach", description: "Sweet and fragrant, ideal for desserts" },
  ],
  Spices: [
    { id: 1, name: "Turmeric", description: "Bright yellow spice with medicinal properties" },
    { id: 2, name: "Cumin", description: "Earthy and nutty flavor, often used in curries" },
    { id: 3, name: "Pepper", description: "Common spice with a sharp, spicy flavor" },
    { id: 4, name: "Cinnamon", description: "Sweet and warm spice used in baking" },
    { id: 5, name: "Coriander", description: "Citrusy and slightly sweet, used in various cuisines" },
    { id: 6, name: "Ginger", description: "Spicy and aromatic, used in both sweet and savory dishes" },
    { id: 7, name: "Clove", description: "Intense and aromatic spice with a sweet flavor" },
    { id: 8, name: "Cardamom", description: "Sweet and spicy, used in both sweet and savory dishes" },
    { id: 9, name: "Fennel", description: "Sweet and slightly licorice-like, used in cooking and baking" },
    { id: 10, name: "Mustard Seed", description: "Pungent and spicy, used in pickling and cooking" },
  ],
  Seedlings: [
    { id: 1, name: "Tomato Seedlings", description: "Young plants ready for planting" },
    { id: 2, name: "Basil Seedlings", description: "Fresh basil seedlings for growing herbs" },
    { id: 3, name: "Sunflower Seedlings", description: "Young sunflowers ready for planting" },
    { id: 4, name: "Lettuce Seedlings", description: "Young lettuce plants for salads" },
    { id: 5, name: "Cucumber Seedlings", description: "Young cucumbers ready for growth" },
    { id: 6, name: "Paper Seedlings", description: "Seedlings packaged for easy planting" },
    { id: 7, name: "Marigold Seedlings", description: "Bright and colorful marigold plants" },
    { id: 8, name: "Mint Seedlings", description: "Young mint plants for fresh herbs" },
    { id: 9, name: "Cilantaro Seedlings", description: "Fresh cilantro seedlings for cooking" },
    { id: 10, name: "Parsely Seedlings", description: "Young parsley plants for garnishes" },
  ],
  Plants: [
    { id: 1, name: "Spider Plant", description: "Easy to care for indoor plant" },
    { id: 2, name: "Aloe Vera", description: "Succulent with medicinal properties" },
    { id: 3, name: "Rose", description: "Classic flower with a beautiful fragrance" },
    { id: 4, name: "Lavender", description: "Fragrant plant used in aromatherapy" },
    { id: 5, name: "Snake Plant", description: "Low-maintenance plant with air-purifying qualities" },
    { id: 6, name: "Peace Lily", description: "Elegant plant known for its white flowers" },
    { id: 7, name: "Pothos", description: "Trailing plant with heart-shaped leaves" },
    { id: 8, name: "Jade Plant", description: "Succulent with thick, glossy leaves" },
    { id: 9, name: "Hibiscus", description: "Tropical plant with large, colorful flowers" },
    { id: 10, name: "Bamboo Plant", description: "Fast-growing plant often used for indoor decor" },
  ],
  Flowers: [
    { id: 1, name: "Rose", description: "Classic flower with a beautiful fragrance" },
    { id: 2, name: "Tulip", description: "Elegant flower with a variety of colors" },
    { id: 3, name: "Marigold", description: "Bright and cheerful flower" },
    { id: 4, name: "Sunflower", description: "Tall flower with a large, sunny face" },
    { id: 5, name: "Daisy", description: "Simple and lovely flower with a bright center" },
    { id: 6, name: "Lily", description: "Beautiful flower with a variety of colors and shapes" },
    { id: 7, name: "Orchid", description: "Exotic and delicate flower with intricate patterns" },
    { id: 8, name: "Daffodil", description: "Bright and cheerful spring flower" },
    { id: 9, name: "Chrysanthemum", description: "Versatile flower often used in arrangements" },
    { id: 10, name: "Peony", description: "Large, fragrant flower with a lush appearance" },
  ],
};


function MarketCategoryListScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { category } = route.params;

  const items = categoryData[category] || [];

  return (
    <SafeAreaView className="flex-1 p-4 bg-gray-200">
      <ScrollView>
        <View className="flex-col">
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() =>
                navigation.navigate("Market Category", {
                  category: items,
                  selectedItemId: item.id,
                })
              }
              className="bg-white rounded-lg shadow-md flex-row items-start p-4 mb-4 border border-gray-300"
              style={{ elevation: 3 }} // Adds shadow effect
              activeOpacity={0.8} // Provides visual feedback when pressed
            >
              <Image
                source={placeholderimg}
                className="w-24 h-24 rounded-lg mr-4"
                resizeMode="cover"
              />
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800 mb-1">{item.name}</Text>
                <Text className="text-sm text-gray-600">{item.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default MarketCategoryListScreen;
