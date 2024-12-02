import React from "react";
import { Text, View, LogBox } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SoldOutScreen from "./SoldOutScreen";
import ReviewingScreen from "./ReviewingScreen";
import ViolationScreen from "./ViolationScreen";
import DelistedScreen from "./DelistedScreen";
import LiveScreen from "./LiveScreen";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NavigationbarComponent from "../../../../components/NavigationbarComponent";

LogBox.ignoreLogs([
  'Warning: A props object containing a "key" prop is being spread into JSX',
]);

const Tab = createMaterialTopTabNavigator();

function TabLabel({ focused, color, icon, label }) {
  return (
    <View className="flex-row items-center">
      <Icon
        name={icon}
        size={16}
        color={focused ? "#00b251" : "gray"}
        style={{ marginRight: 4 }}
      />
      <Text
        style={{
          color,
          fontSize: 12,
          fontWeight: focused ? "bold" : "normal",
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function MyProductsScreen({ route }) {
  const initialRouteName = route.params?.screen || "Live";

  return (
    <>
      <Tab.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          swipeEnabled: true,
          tabBarScrollEnabled: true,
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
        <Tab.Screen
          name="Live"
          component={LiveScreen}
          options={{
            tabBarLabel: ({ focused, color }) => (
              <TabLabel
                focused={focused}
                color={color}
                icon="play-circle-outline"
                label="Live"
              />
            ),
          }}
        />
        <Tab.Screen
          name="Sold Out"
          component={SoldOutScreen}
          options={{
            tabBarLabel: ({ focused, color }) => (
              <TabLabel
                focused={focused}
                color={color}
                icon="package-variant-closed"
                label="Sold Out"
              />
            ),
          }}
        />
        <Tab.Screen
          name="Delisted"
          component={DelistedScreen}
          options={{
            tabBarLabel: ({ focused, color }) => (
              <TabLabel
                focused={focused}
                color={color}
                icon="cancel"
                label="Delisted"
              />
            ),
          }}
        />
        <Tab.Screen
          name="Violation"
          component={ViolationScreen}
          options={{
            tabBarLabel: ({ focused, color }) => (
              <TabLabel
                focused={focused}
                color={color}
                icon="alert-circle"
                label="Violation"
              />
            ),
          }}
        />
        <Tab.Screen
          name="Reviewing"
          component={ReviewingScreen}
          options={{
            tabBarLabel: ({ focused, color }) => (
              <TabLabel
                focused={focused}
                color={color}
                icon="magnify"
                label="Reviewing"
              />
            ),
          }}
        />
      </Tab.Navigator>
      <NavigationbarComponent />
    </>
  );
}

export default MyProductsScreen;