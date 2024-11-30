import React from "react";
import { Text, View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SoldOutScreen from "./SoldOutScreen";
import ReviewingScreen from "./ReviewingScreen";
import ViolationScreen from "./ViolationScreen";
import DelistedScreen from "./DelistedScreen";
import LiveScreen from "./LiveScreen";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // For icons
import NavigationbarComponent from "../../../../components/NavigationbarComponent";

const Tab = createMaterialTopTabNavigator();

function MyProductsScreen({ route }) {
  const initialRouteName = route.params?.screen || "Live";

  return (
    <>
      <Tab.Navigator
        initialRouteName={initialRouteName}
        screenOptions={({ route }) => ({
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
          tabBarLabel: ({ focused, color }) => (
            <View className="flex-row items-center">
              {route.name === "Live" && (
                <Icon
                  name="play-circle-outline"
                  size={16}
                  color={focused ? "#00b251" : "gray"}
                  style={{ marginRight: 4 }}
                />
              )}
              {route.name === "Sold Out" && (
                <Icon
                  name="package-variant-closed"
                  size={16}
                  color={focused ? "#00b251" : "gray"}
                  style={{ marginRight: 4 }}
                />
              )}
              {route.name === "Reviewing" && (
                <Icon
                  name="magnify"
                  size={16}
                  color={focused ? "#00b251" : "gray"}
                  style={{ marginRight: 4 }}
                />
              )}
              {route.name === "Violation" && (
                <Icon
                  name="alert-circle"
                  size={16}
                  color={focused ? "#00b251" : "gray"}
                  style={{ marginRight: 4 }}
                />
              )}
              {route.name === "Delisted" && (
                <Icon
                  name="cancel"
                  size={16}
                  color={focused ? "#00b251" : "gray"}
                  style={{ marginRight: 4 }}
                />
              )}
              <Text
                style={{
                  color,
                  fontSize: 12,
                  fontWeight: focused ? "bold" : "normal",
                }}
              >
                {route.name}
              </Text>
            </View>
          ),
        })}
      >
        <Tab.Screen name="Live" component={LiveScreen} />
        <Tab.Screen name="Sold Out" component={SoldOutScreen} />
        <Tab.Screen name="Delisted" component={DelistedScreen} />
        <Tab.Screen name="Violation" component={ViolationScreen} />
        <Tab.Screen name="Reviewing" component={ReviewingScreen} />
      </Tab.Navigator>
      <NavigationbarComponent />
    </>
  );
}

export default MyProductsScreen;
