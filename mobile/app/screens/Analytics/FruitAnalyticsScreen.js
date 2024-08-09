import React from "react";
import { View, Text } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

function FruitAnalyticsScreen({ route }) {
  const { fruitsCategory,  selectedFruitId} = route.params;
  return (
    <Tab.Navigator
      screenOptions={{
        swipeEnabled: true,
        tabBarScrollEnabled: true,
        lazy: true,
      }}
      initialRouteName={
        fruitsCategory.find((fruit) => fruit.id === selectedFruitId).name
      }
    >
      {fruitsCategory.map((fruit) => (
        <Tab.Screen key={fruit.id} name={fruit.name}>
          {() => 
          <View className=""></View>
          }
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
}

export default FruitAnalyticsScreen;
