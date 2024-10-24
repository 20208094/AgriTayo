import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Animated, StyleSheet, Text, TouchableWithoutFeedback, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import HomePageScreen from "../screens/Home/HomePageScreen";
import CropsScreen from "../screens/Market/CropsScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import BiddingScreen from "../screens/Bidding/BiddingBuyerScreen";
import FeaturedProductScreen from "../screens/Market/FeaturedProductScreen";
import { NotificationIcon, MessagesIcon, MarketIcon } from "../components/SearchBarC";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingAnimation from "./LoadingAnimation";

const Tab = createBottomTabNavigator();

const NavigationBar = () => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [loading, setLoading] = useState(true);

  const [shopData, setShopData] = useState(null);

  // Toggle menu animation
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

  const getAsyncUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("userData");
      if (storedData) {
        const parsedUserData = JSON.parse(storedData);
        const userTypeId = (Array.isArray(parsedUserData) ? Number(parsedUserData[0].user_type_id) : Number(parsedUserData.user_type_id));

        if (userTypeId === 1 || userTypeId === 2) {
          const storedShopData = await AsyncStorage.getItem("shopData");
          if (storedShopData) {
            const parsedData = JSON.parse(storedData);
            setShopData(Array.isArray(parsedData) ? parsedData[0] : parsedData);
          }
        } else {
        }
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    } finally {
      setLoading(false)
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const timeoutId = setTimeout(() => {
        getAsyncUserData();
      }, 3000);
      return () => clearTimeout(timeoutId);
    }, [])
  );

  // Close menu when clicking outside
  const closeMenuOnOutsidePress = () => {
    if (menuVisible) {
      toggleMenu();
    }
  };

  if (loading) {
    return <LoadingAnimation />;
  }

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
              case "Featured Products":
                iconName = "leaf-outline";
                break;
              case "Biddings":
                iconName = "people-outline";
                break;
              case "Profile":
                iconName = "person-outline";
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
          name="Featured Products"
          component={FeaturedProductScreen}
          options={{
            tabBarLabel: "Market",
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
            <Animated.View className="absolute right-0 bottom-16 flex-row items-center rounded-xl px-2 py-1 w-full justify-center flex-wrap">
              {shopData && (
                <TouchableOpacity
                  className="items-center bg-white border border-slate-400 rounded-xl px-2 py-1 mx-2 mb-2"
                  style={{ width: 120 }}
                  onPress={() => navigation.navigate("My Shop")}
                >
                  <Icon name="storefront-outline" size={30} color="#00B251" />
                  <Text className="text-center">My Shop</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                className="items-center bg-white border border-slate-400 rounded-xl px-2 py-1 mx-2 mb-2"
                style={{ width: 120 }}
                onPress={() => navigation.navigate("Orders")}
              >
                <Icon name="receipt-outline" size={30} color="#00B251" />
                <Text className="text-center">My Orders</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center bg-white border border-slate-400 rounded-xl px-2 py-1 mx-2 mb-2"
                style={{ width: 120 }}
                onPress={() => navigation.navigate("Buyer Negotiation List")}
              >
                <Icon name="swap-horizontal-outline" size={30} color="#00B251" />
                <Text className="text-center">My Negotiations</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center bg-white border border-slate-400 rounded-xl px-2 py-1 mx-2 mb-2"
                onPress={() => navigation.navigate('My Bids')}
                style={{ width: 120 }}
              >
                <Icon name="ticket-outline" size={30} color="#00B251" />
                <Text className="text-center">My Bids</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center bg-white border border-slate-400 rounded-xl px-2 py-1 mx-2 mb-2"
                style={{ width: 120 }}
                onPress={() => navigation.navigate("Analytics")}
              >
                <Icon name="analytics-outline" size={30} color="#00B251" />
                <Text className="text-center">Analytics</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

export default NavigationBar;
