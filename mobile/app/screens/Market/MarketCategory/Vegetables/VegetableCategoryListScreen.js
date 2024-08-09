import React from "react";
import { Text, TouchableOpacity, SafeAreaView, View, Image, ScrollView } from "react-native";
import { styled } from "nativewind";
import placeholderimg from "../../../../assets/placeholder.png"; // Import the placeholder image

function VegetableCategoryListScreen({ navigation }) {
  const vegetablesCategory = [
    { id: 1, name: "Potato", description: "Rich in starch and versatile in cooking", image: placeholderimg },
    { id: 2, name: "Carrot", description: "Good for eyesight and sweet in flavor", image: placeholderimg },
    { id: 3, name: "Tomato", description: "Juicy and tangy, great in salads", image: placeholderimg },
    { id: 4, name: "Lettuce", description: "Great for salads and sandwiches", image: placeholderimg },
    { id: 5, name: "Spinach", description: "High in iron, perfect for smoothies", image: placeholderimg },
    { id: 6, name: "Broccoli", description: "Rich in vitamins, good for health", image: placeholderimg },
    { id: 7, name: "Onion", description: "Adds flavor to dishes, can be sautéed or raw", image: placeholderimg },
    { id: 8, name: "Cucumber", description: "Hydrating and crunchy, great for salads", image: placeholderimg },
    { id: 9, name: "Bell Pepper", description: "Sweet and colorful, adds crunch to dishes", image: placeholderimg },
    { id: 10, name: "Zucchini", description: "Versatile and tender, great for grilling", image: placeholderimg },
  ];

  return (
    <SafeAreaView className="flex-1 p-4 bg-gray-200">
      <ScrollView>
        <View className="flex-col">
          {vegetablesCategory.map((vegetable) => (
            <TouchableOpacity
              key={vegetable.id}
              onPress={() =>
                navigation.navigate("Vegetable Category", {
                  vegetablesCategory,
                  selectedVegetableId: vegetable.id,
                })
              }
              className="bg-white rounded-lg shadow-md flex-row items-start p-4 mb-4 border border-gray-300"
              style={{ elevation: 3 }} // Adds shadow effect
              activeOpacity={0.8} // Provides visual feedback when pressed
            >
              <Image
                source={vegetable.image}
                className="w-24 h-24 rounded-lg mr-4"
                resizeMode="cover"
              />
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800 mb-1">{vegetable.name}</Text>
                <Text className="text-sm text-gray-600">{vegetable.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default styled(VegetableCategoryListScreen);
