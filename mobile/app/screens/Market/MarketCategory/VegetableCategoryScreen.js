import React from "react";
import { View, Text } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

function VegetableCategoryScreen() {
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
      name: "Brocolli",
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
    <Tab.Navigator
      screenOptions={{
        swipeEnabled: true,
        tabBarScrollEnabled: true,
        lazy: true,
      }}
    >
      {vegetablesCategory.map((vegetable) => (
        <Tab.Screen key={vegetable.id} name={vegetable.name}>
          {() => <View></View>}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
}

export default VegetableCategoryScreen;
