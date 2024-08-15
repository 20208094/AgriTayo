import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AllScreen from "./ShopRating/AllScreen";
import ToReplyScreen from "./ShopRating/ToReplyScreen";

const Tab = createMaterialTopTabNavigator();

function ShopRatingScreen({ initialRouteName }) {
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
      <Tab.Screen name="All" component={AllScreen} />
      <Tab.Screen name="To Reply" component={ToReplyScreen} />
    </Tab.Navigator>
  );
}

export default ShopRatingScreen;
