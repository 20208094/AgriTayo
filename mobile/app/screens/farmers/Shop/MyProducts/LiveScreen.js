import React from 'react';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import LiveRecentScreen from './Live/LiveRecentScreen';
import LiveStockScreen from './Live/LiveStockScreen';

const Tab = createMaterialTopTabNavigator();

function LiveScreen({ initialRouteName }) {
  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        swipeEnabled: true,
        lazy: true,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#00b251",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "white", elevation: 3 },
        tabBarIndicatorStyle: {
          backgroundColor: "#00b251",
          height: 4,
          borderRadius: 2,
        },
      }}
    >
      <Tab.Screen name="Recent" component={LiveRecentScreen} />
      <Tab.Screen name="Stock" component={LiveStockScreen} />
    </Tab.Navigator>
  );
}

export default LiveScreen