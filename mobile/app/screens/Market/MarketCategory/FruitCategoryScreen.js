import React from "react";
import { View, Text } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

function FruitCategoryScreen() {
  const fruitsCategory = [
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
  ];
  return (
    <Tab.Navigator
      screenOptions={{
        swipeEnabled: true,
        tabBarScrollEnabled: true,
        lazy: true,
      }}
    >
      {fruitsCategory.map((fruit) => (
        <Tab.Screen key={fruit.id} name={fruit.name}>
          {() => <View></View>}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
}

export default FruitCategoryScreen;
