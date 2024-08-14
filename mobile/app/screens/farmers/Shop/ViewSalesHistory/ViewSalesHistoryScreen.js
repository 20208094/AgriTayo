import React from 'react'
import Icon from "react-native-vector-icons/Ionicons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ToShipScreen from './ToShipScreen';
import CompletedScreen from './CompletedScreen';
import CancelledScreen from './CancelledScreen';
import ReturnScreen from './ReturnScreen';
import ReviewScreen from './ReviewScreen';
import { View, Text } from "react-native";

const Tab = createMaterialTopTabNavigator();

function ViewSalesHistoryScreen({route}){
    const initialRouteName = route.params?.screen || "To Ship";
    return (
        <Tab.Navigator
          initialRouteName={initialRouteName}
          screenOptions={({ route }) => ({
            swipeEnabled: true,
            tabBarScrollEnabled: true,
            lazy: true,
            tabBarIcon: ({ color }) => {
              let iconName;
    
              switch (route.name) {
                case "To Ship":
                  iconName = "paper-plane-outline";
                  break;
                case "Completed":
                  iconName = "checkmark-done-outline";
                  break;
                case "Cancelled":
                  iconName = "close-circle-outline";
                  break;
                case "Return":
                    iconName = "return-up-back-outline";
                    break;
                case "Review":
                    iconName = "star-half-outline"
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
          <Tab.Screen
            name="To Ship"
            component={ToShipScreen}
            options={{ tabBarLabel: "To Ship" }}
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
          <Tab.Screen
            name="Return"
            component={ReturnScreen}
            options={{ tabBarLabel: "Return" }}
          />
          <Tab.Screen
            name="Review"
            component={ReviewScreen}
            options={{ tabBarLabel: "Review" }}
          />
        </Tab.Navigator>
      );
}

export default ViewSalesHistoryScreen