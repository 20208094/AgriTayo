import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



function VegetableCategoryListScreen({ navigation }) {
  const vegetablesCategory = [
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
  ];

  return (
    <SafeAreaView>
      {vegetablesCategory.map((vegetable) => (
        <TouchableOpacity
          key={vegetable.id}
          onPress={() =>
            navigation.navigate("Vegetable Category", {
              vegetablesCategory,
              selectedVegetableId: vegetable.id,
            })
          }
        >
          <Text>{vegetable.name}</Text>
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
}

export default VegetableCategoryListScreen;
