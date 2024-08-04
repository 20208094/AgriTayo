import React from 'react';
import { View, Text } from 'react-native';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

function SeedlingCategoryScreen() {
  const seedlingsCategory = [
    {
      id: 1,
      name: 'Tomato Seedlings'
    },
    {
      id: 2,
      name: 'Basil Seedlings',
    },
    {
      id: 3, 
      name: 'Sunflower Seedlings'
    },
    {
      id: 4,
      name: 'Lettuce Seedlings'
    },
    {
      id: 5,
      name: 'Cucumber Seedlings'
    },
    {
      id: 6,
      name: 'Paper Seedlings'
    },
    {
      id: 7,
      name: 'Marigold Seedlings'
    },
    {
      id: 8,
      name: 'Mint Seedlings'
    },
    {
      id: 9, 
      name: 'Cilantaro Seedlings'
    },
    {
      id: 10,
      name: 'Parsely Seedlings'
    }
  ];

  return (
    <Tab.Navigator
      screenOptions={{
        swipeEnabled: true,
        tabBarScrollEnabled: true,
        lazy: true,
      }}
    >
      {seedlingsCategory.map(seedling => (
        <Tab.Screen
          key={seedling.id}
          name={seedling.name}
        >
          {() => (
            <View>
            </View>
          )}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
}

export default SeedlingCategoryScreen;
