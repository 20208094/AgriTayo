import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePageScreen from "../screens/HomePageScreen";
import CropsScreen from "../screens/CropsScreen";
import CartScreen from "../screens/CartScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

const NavigationBar = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomePageScreen} />
      <Tab.Screen name="Crops" component={CropsScreen} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default NavigationBar;
