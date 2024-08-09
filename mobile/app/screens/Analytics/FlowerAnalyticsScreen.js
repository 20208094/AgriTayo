import React from "react";
import { View, Text } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

function FlowerAnalyticsScreen({route}) {
    const {flowersCategory, selectedFlowerId} = route.params
  return (
    <Tab.Navigator
      screenOptions={{
        swipeEnabled: true,
        tabBarScrollEnabled: true,
        lazy: true,
      }}
      initialRouteName={flowersCategory.find((flower) => flower.id === selectedFlowerId).name}
    >
      {flowersCategory.map((flower) => (
        <Tab.Screen key={flower.id} name={flower.name}>
          {() => 
          <View className=''>

          </View>
          }
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
}

export default FlowerAnalyticsScreen;
