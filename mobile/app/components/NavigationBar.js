import React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import HomePageScreen from "../screens/Home/HomePageScreen";
import CropsScreen from "../screens/Market/CropsScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import OrdersScreen from "../screens/Orders/OrdersScreen";
import AnalyticScreen from "../screens/Analytics/AnalyticScreen";
import BiddingScreen from "../screens/Bidding/BiddingScreen";
import { NotificationIcon, MessagesIcon, MarketIcon } from "../components/SearchBarC";
import { useNavigation } from "@react-navigation/native";
const Tab = createBottomTabNavigator();

const NavigationBar = () => {
  const navigation = useNavigation();  // Use the hook here

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = "home-outline";
              break;
            case "Market Category":
              iconName = "leaf-outline";
              break;
            case "Bidding":
              iconName = "people-outline";
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
        tabBarActiveTintColor: "#2E7D32", // Set active tab color to green
        tabBarInactiveTintColor: "gray",
        headerTitleStyle: {
          color: "#2E7D32", // Set header title color to green
        },
        headerTintColor: "#2E7D32", // Set the color of the header's back button and other icons to green
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomePageScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Market Category"
        component={CropsScreen}
        options={{
          tabBarLabel: 'Market',
          headerRight: () => (
            <View style={{ flexDirection: "row", marginRight: 15 }}>
              <MarketIcon onPress={() => navigation.navigate("CartScreen")} />
              <NotificationIcon onPress={() => navigation.navigate("Notifications")} />
              <MessagesIcon onPress={() => navigation.navigate("ChatListScreen")} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Bidding"
        component={BiddingScreen}
        options={{
          headerRight: () => (
            <View style={{ flexDirection: "row", marginRight: 15 }}>
              <MarketIcon onPress={() => navigation.navigate("CartScreen")} />
              <NotificationIcon onPress={() => navigation.navigate("Notifications")} />
              <MessagesIcon onPress={() => navigation.navigate("ChatListScreen")} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticScreen}
        options={{
          headerRight: () => (
            <View style={{ flexDirection: "row", marginRight: 15 }}>
              <MarketIcon onPress={() => navigation.navigate("CartScreen")} />
              <NotificationIcon onPress={() => navigation.navigate("Notifications")} />
              <MessagesIcon onPress={() => navigation.navigate("ChatListScreen")} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          headerRight: () => (
            <View style={{ flexDirection: "row", marginRight: 15 }}>
              <MarketIcon onPress={() => navigation.navigate("CartScreen")} />
              <NotificationIcon onPress={() => navigation.navigate("Notifications")} />
              <MessagesIcon onPress={() => navigation.navigate("ChatListScreen")} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerRight: () => (
            <View style={{ flexDirection: "row", marginRight: 15 }}>
              <MarketIcon onPress={() => navigation.navigate("CartScreen")} />
              <NotificationIcon onPress={() => navigation.navigate("Notifications")} />
              <MessagesIcon onPress={() => navigation.navigate("ChatListScreen")} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default NavigationBar;
