import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import HomePageScreen from "../screens/Home/HomePageScreen";
import CropsScreen from "../screens/Market/CropsScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import OrdersScreen from "../screens/Orders/OrdersScreen";
import AnalyticScreen from "../screens/Analytics/AnalyticScreen";

const Tab = createBottomTabNavigator();

const NavigationBar = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = "home-outline";
              break;
            case "Market":
              iconName = "leaf-outline";
              break;
            case "Analytics":
              iconName = "analytics-outline";
              break;
            case "Profile":
              iconName = "person-outline";
              break;
            case "Orders":
              iconName = "receipt-outline";
              break;
            default:
              iconName = "ellipse-outline";
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "green",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomePageScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Market" component={CropsScreen} />
      <Tab.Screen name="Analytics" component={AnalyticScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default NavigationBar;
