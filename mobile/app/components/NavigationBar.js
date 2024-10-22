import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Animated, StyleSheet, Text, TouchableWithoutFeedback } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import HomePageScreen from "../screens/Home/HomePageScreen";
import CropsScreen from "../screens/Market/CropsScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import BiddingScreen from "../screens/Bidding/BiddingBuyerScreen";
import FeaturedProductScreen from "../screens/Market/FeaturedProductScreen";
import { NotificationIcon, MessagesIcon, MarketIcon } from "../components/SearchBarC";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

const NavigationBar = () => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const [userData, setUserData] = useState(null);
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
        const parsedData = JSON.parse(storedData);
        setUserData(Array.isArray(parsedData) ? parsedData[0] : parsedData);
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };

  const getAsyncShopData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("shopData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setShopData(Array.isArray(parsedData) ? parsedData[0] : parsedData);
      }
    } catch (error) {
      console.error("Failed to load shop data:", error);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      await getAsyncUserData();
      await getAsyncShopData();
    };
    fetchInitialData();
  }, []);

  // UseFocusEffect to refetch data when the navigation bar is in focus (e.g., switching tabs)
  useFocusEffect(
    React.useCallback(() => {
      const refetchDataOnFocus = async () => {
        await getAsyncUserData();
        await getAsyncShopData();
      };
      refetchDataOnFocus();
    }, [])
  );

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
