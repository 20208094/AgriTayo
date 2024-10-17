import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Animated, StyleSheet, Text, TouchableWithoutFeedback } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import HomePageScreen from "../screens/Home/HomePageScreen";
import CropsScreen from "../screens/Market/CropsScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import AnalyticScreen from "../screens/Analytics/AnalyticScreen";
import BiddingScreen from "../screens/Bidding/BiddingBuyerScreen";
import { NotificationIcon, MessagesIcon, MarketIcon } from "../components/SearchBarC";
import { useNavigation } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const NavigationBar = () => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(animation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  // Close menu when clicking outside
  const closeMenuOnOutsidePress = () => {
    if (menuVisible) {
      toggleMenu();
    }
  };

  return (
    <View style={{ flex: 1 }}>
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
              case "Biddings":
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
              case "Actions":
                iconName = menuVisible ? "close-circle-outline" : "grid-outline";
                break;
              default:
                iconName = "ellipse-outline";
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#00B251",
          tabBarInactiveTintColor: "gray",
          headerTitleStyle: { color: "#00B251" },
          headerTintColor: "#00B251",
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
          name="Actions"
          options={{ tabBarLabel: "Menu" }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              toggleMenu();
            },
          }}
        >
          {() => <View />}
        </Tab.Screen>
        <Tab.Screen
          name="Biddings"
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

      {/* Overlay to detect clicks outside the menu */}
      {menuVisible && (
        <TouchableWithoutFeedback onPress={closeMenuOnOutsidePress}>
          <View style={StyleSheet.absoluteFillObject} className="bg-black/10">
            <Animated.View className="absolute right-0 bottom-16 items-center rounded-xl px-2 py-1 w-full">
              <TouchableOpacity
                className="items-center bg-white border border-slate-400 rounded-xl px-2 py-1 w-36 mt-2"
                onPress={() => navigation.navigate("My Shop")}
              >
                <Icon name="storefront-outline" size={30} color="#00B251" />
                <Text>My Shop</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center bg-white border border-slate-400 rounded-xl px-2 py-1 w-36 mt-2"
                onPress={() => navigation.navigate("Orders")}
              >
                <Icon name="receipt-outline" size={30} color="#00B251" />
                <Text>My Orders</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center bg-white border border-slate-400 rounded-xl px-2 py-1 w-36 mt-2"
                onPress={() => navigation.navigate("Buyer Negotiation List")}
              >
                <Icon name="swap-horizontal-outline" size={30} color="#00B251" />
                <Text>My Negotiations</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center bg-white border border-slate-400 rounded-xl px-2 py-1 w-36 mt-2"
              >
                <Icon name="ticket-outline" size={30} color="#00B251" />
                <Text>My Bids</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center bg-white border border-slate-400 rounded-xl px-2 py-1 w-36 mt-2"
                onPress={() => navigation.navigate("Analytics")}
              >
                <Icon name="analytics-outline" size={30} color="#00B251" />
                <Text>Analytics</Text>
              </TouchableOpacity>

            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

export default NavigationBar;
