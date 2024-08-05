import React from "react";
import { View, Text } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

function SeedlingCategoryScreen({route}) {
  const {seedlingsCategory, selectedSeedlingId} = route.params
  return (
    <Tab.Navigator
      screenOptions={{
        swipeEnabled: true,
        tabBarScrollEnabled: true,
        lazy: true,
      }}
      initialRouteName={seedlingsCategory.find((seedling) => seedling.id === selectedSeedlingId).name} 
    >
      {seedlingsCategory.map((seedling) => (
        <Tab.Screen key={seedling.id} name={seedling.name}>
          {() => 
          <View className=''>
            
          </View>
          }
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
}

export default SeedlingCategoryScreen;
