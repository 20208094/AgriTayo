import React from "react";
import { View, Text, Dimensions } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

function VegetableCategoryScreen({ route }) {
  const { vegetablesCategory, selectedVegetableId } = route.params;
  return (
    <Tab.Navigator
      screenOptions={{
        swipeEnabled: true,
        tabBarScrollEnabled: true,
        lazy: true,
      }}
      initialRouteName={
        vegetablesCategory.find(
          (vegetable) => vegetable.id === selectedVegetableId
        ).name
      }
    >
      {vegetablesCategory.map((vegetable) => (
        <Tab.Screen key={vegetable.id} name={vegetable.name}>
          {() => <View className=""></View>}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
}

export default VegetableCategoryScreen;
