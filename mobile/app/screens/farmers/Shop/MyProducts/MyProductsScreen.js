import React from "react";
import { Text } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SoldOutScreen from "./SoldOutScreen";
import ReviewingScreen from "./ReviewingScreen";
import ViolationScreen from "./ViolationScreen";
import DelistedScreen from "./DelistedScreen";

const Tab = createMaterialTopTabNavigator();
function MyProductsScreen({ route }) {
  const initialRouteName = route.params?.screen || "Sold Out";
  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      screenOptions={({ route }) => ({
        swipeEnabled: true,
        tabBarScrollEnabled: true,
        lazy: true,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "green",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "white" },
        tabBarIndicatorStyle: {
          backgroundColor: "green",
          height: 4,
        },
        tabBarLabel: ({ focused, color }) => (
          <Text
            style={{
              color,
              fontSize: 12,
              fontWeight: focused ? "bold" : "normal",
            }}
          >
            {route.name}
          </Text>
        ),
      })}
    >
      <Tab.Screen name="Sold Out" component={SoldOutScreen} />
      <Tab.Screen name="Reviewing" component={ReviewingScreen} />
      <Tab.Screen name="Violation" component={ViolationScreen} />
      <Tab.Screen name="Delisted" component={DelistedScreen} />
    </Tab.Navigator>
  );
}

export default MyProductsScreen;
