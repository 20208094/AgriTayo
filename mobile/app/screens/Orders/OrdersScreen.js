import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import ToPayScreen from "./ToPayScreen";
import ToShipScreen from "./ToShipScreen";
import ToRecieveScreen from "./ToRecieveScreen";
import CompletedScreen from "./CompletedScreen";
import CancelledScreen from "./CancelledScreen";
import { View, Text } from "react-native";

const Tab = createMaterialTopTabNavigator();

function OrdersScreen({ route }) {
  const initialRouteName = route.params?.screen || "To Pay";

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      screenOptions={({ route }) => ({
        swipeEnabled: true,
        tabBarScrollEnabled: true,
        lazy: true,
        tabBarIcon: ({ color, focused }) => {
          let iconName;

          switch (route.name) {
            case "To Pay":
              iconName = "wallet-outline";
              break;
            case "To Ship":
              iconName = "paper-plane-outline";
              break;
            case "To Recieve":
              iconName = "cube-outline";
              break;
            case "Completed":
              iconName = "checkmark-done-outline";
              break;
            case "Cancelled":
              iconName = "close-circle-outline";
              break;
            default:
              iconName = "ellipse-outline";
              break;
          }

          return (
            <View style={{ alignItems: "center" }}>
              <Icon name={iconName} size={20} color={color} />
            </View>
          );
        },
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#00B215",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "white" },
        tabBarIndicatorStyle: {
          backgroundColor: "#00B215",
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
      <Tab.Screen
        name="To Pay"
        component={ToPayScreen}
        options={{ tabBarLabel: "To Pay" }}
      />
      <Tab.Screen
        name="To Ship"
        component={ToShipScreen}
        options={{ tabBarLabel: "To Ship" }}
      />
      <Tab.Screen
        name="To Recieve"
        component={ToRecieveScreen}
        options={{ tabBarLabel: "To Receive" }}
      />
      <Tab.Screen
        name="Completed"
        component={CompletedScreen}
        options={{ tabBarLabel: "Completed" }}
      />
      <Tab.Screen
        name="Cancelled"
        component={CancelledScreen}
        options={{ tabBarLabel: "Cancelled" }}
      />
    </Tab.Navigator>
  );
}

export default OrdersScreen;
