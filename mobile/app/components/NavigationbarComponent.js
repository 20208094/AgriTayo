import React, { useState } from 'react'
import {
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NavigationbarComponent = () => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [loading, setLoading] = useState(true);
  const [shop_id, setShopId] = useState([]);

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
        const userTypeId = Array.isArray(parsedUserData)
          ? Number(parsedUserData[0].user_type_id)
          : Number(parsedUserData.user_type_id);

        if (userTypeId === 1 || userTypeId === 2) {
          const storedShopData = await AsyncStorage.getItem("shopData");
          if (storedShopData) {
            const parsedData = JSON.parse(storedData);
            setShopData(Array.isArray(parsedData) ? parsedData[0] : parsedData);
            setShopId(
              Array.isArray(parsedData.shop_id)
                ? parsedData[0].shop_id
                : parsedData.shop_id
            );
          }
        } else {
        }
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const timeoutId = setTimeout(() => {
        getAsyncUserData();
      });
      return () => clearTimeout(timeoutId);
    }, [])
  );

  // Close menu when clicking outside
  const closeMenuOnOutsidePress = () => {
    if (menuVisible) {
      toggleMenu();
    }
  };

  return (
    <View className="">
      {/* Bottom Navigation Bar */}
      <View className="absolute bottom-0 left-0 right-0 h-12 flex-row items-center bg-white border-t border-gray-300 shadow-md">
        <TouchableOpacity onPress={() => navigation.navigate("Home")} className="items-center w-1/5">
          <Icon name="home-outline" size={25} color="gray" />
          <Text className="text-xs text-gray-600 w-full text-center">Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Featured Products")} className="items-center w-1/5">
          <Icon name="leaf-outline" size={25} color="gray" />
          <Text className="text-xs text-gray-600 w-full text-center">Market</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleMenu} className="items-center w-1/5">
          <Icon name={menuVisible ? "close-circle-outline" : "grid-outline"} size={25} color="gray" />
          <Text className="text-xs text-gray-600 w-full text-center">Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Biddings")} className="items-center w-1/5">
          <Icon name="people-outline" size={25} color="gray" />
          <Text className="text-xs text-gray-600 w-full text-center">Biddings</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Profile")} className="items-center w-1/5">
          <Icon name="person-outline" size={25} color="gray" />
          <Text className="text-xs text-gray-600 w-full text-center">Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Overlay for additional menu options */}
      {/* Overlay to detect clicks outside the menu */}
      {menuVisible && (
        <TouchableWithoutFeedback onPress={closeMenuOnOutsidePress}>
          <View style={StyleSheet.absoluteFillObject} className="bg-black/10">
            <Animated.View className="absolute right-0 bottom-14 bg-white/90 flex-row items-center rounded-xl px-2 py-1 mx-2 w-full*0.85 justify-center flex-wrap">
              {shopData && (
                <View className="flex-row items-center w-full px-2 justify-center flex-wrap rounded-xl mb-4">
                  <View className="w-full ml-6">
                    <Text className="text-left w-1/2 text-[#00b251] text-xl font-extrabold pl-1 rounded-lg">
                      Shop Navigation
                    </Text>
                  </View>
                  <TouchableOpacity
                    className="items-center bg-white border-2 border-slate-500 rounded-xl px-2 py-1 mx-2 mb-2 w-36"
                    onPress={() => navigation.navigate("My Shop")}
                  >
                    <Icon name="storefront-outline" size={30} color="#00B251" />
                    <Text className="text-center">My Shop</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="items-center bg-white border-2 border-slate-500 rounded-xl px-2 py-1 mx-2 mb-2 w-36"
                    onPress={() => navigation.navigate("My Products")}
                  >
                    <FontAwesome5 name="box" size={30} color="#00B251" />
                    <Text className="text-center">Shop Products</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="items-center bg-white border-2 border-slate-500 rounded-xl px-2 py-1 mx-2 mb-2 w-36"
                    onPress={() => navigation.navigate("Seller Negotiation List")}
                  >
                    <FontAwesome5 name="handshake" size={30} color="#00B251" />
                    <Text className="text-center">Shop Negotiations</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="items-center bg-white border-2 border-slate-500 rounded-xl px-2 py-1 mx-2 mb-2 w-36"
                    onPress={() => navigation.navigate("Bidding")}
                  >
                    <FontAwesome5 name="file-contract" size={30} color="#00B251" />
                    <Text className="text-center">Shop Bids</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="items-center bg-white border-2 border-slate-500 rounded-xl px-2 py-1 mx-2 mb-2 w-36"
                    onPress={() => navigation.navigate("Sales History", { screen: "Completed" })}
                  >
                    <FontAwesome5 name="receipt" size={30} color="#00B251" />
                    <Text className="text-center">Shop Orders</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="items-center bg-white border-2 border-slate-500 rounded-xl px-2 py-1 mx-2 mb-2 w-36"
                    onPress={() => navigation.navigate('Seller Shop', { shop_id })}
                  >
                    <Icon name="storefront-outline" size={30} color="#00B251" />
                    <Text className="text-center">Shop View</Text>
                  </TouchableOpacity>
                </View>
              )}
              {shopData && (
                <View className="w-full ml-6">
                  <Text className="text-left w-1/2 text-[#00b251] text-xl font-bold pl-3 rounded-lg">
                    User Navigation
                  </Text>
                </View>
              )}
              <TouchableOpacity
                className="items-center bg-white border-2 border-slate-500 rounded-xl px-2 py-1 mx-2 mb-2 w-36"
                onPress={() => navigation.navigate("Orders")}
              >
                <Icon name="receipt-outline" size={30} color="#00B251" />
                <Text className="text-center">My Orders</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center bg-white border-2 border-slate-500 rounded-xl px-2 py-1 mx-2 mb-2 w-36"
                onPress={() => navigation.navigate("Buyer Negotiation List")}
              >
                <Icon
                  name="swap-horizontal-outline"
                  size={30}
                  color="#00B251"
                />
                <Text className="text-center">My Negotiations</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center bg-white border-2 border-slate-500 rounded-xl px-2 py-1 mx-2 mb-2 w-36"
                onPress={() => navigation.navigate("My Bids")}
              >
                <Icon name="ticket-outline" size={30} color="#00B251" />
                <Text className="text-center">My Bids</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="items-center bg-white border-2 border-slate-500 rounded-xl px-2 py-1 mx-2 mb-2 w-36"
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

export default NavigationbarComponent;
