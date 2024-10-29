import React, { useState, useEffect } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Icon from "react-native-vector-icons/Ionicons";

import CompletedScreen from "./OrderCategories/CompletedScreen";
import ForReturnScreen from "./OrderCategories/ForReturnScreen";
import PickupScreen from "./OrderCategories/PickupScreen";
import PreparingScreen from "./OrderCategories/PreparingScreen";
import RejectedScreen from "./OrderCategories/RejectedScreen";
import ReturnedScreen from "./OrderCategories/ReturnedScreen";
import ShippingScreen from "./OrderCategories/ShippingScreen";
import ToConfirmScreen from "./OrderCategories/ToConfirmScreen";
import ToRateScreen from "./OrderCategories/ToRateScreen";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from '@env';
import { View, Text } from "react-native";
import NavigationbarComponent from "../../../../components/NavigationbarComponent";

const Tab = createMaterialTopTabNavigator();

function ViewSalesHistoryScreen({ route }) {
  const initialRouteName = route.params?.screen || "To Confirm";

  const [orders, setOrders] = useState([]);
  const [orderProducts, setOrderProducts] = useState([]);
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from AsyncStorage
  const getAsyncShopData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('shopData');

      if (storedData) {
        const parsedData = JSON.parse(storedData); // Parse storedData

        if (Array.isArray(parsedData)) {
          const shop = parsedData[0];  // Assuming shop data is the first element of the array
          setShopData(shop); // Set shopData state to the shop object
        } else {
          setShopData(parsedData); // If it's not an array, directly set parsed data
        }
      }
    } catch (error) {
      console.error('Failed to load shop data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders and products
  const fetchOrdersAndProducts = async () => {
    if (!shopData) return;

    try {
      const [ordersResponse, productsResponse] = await Promise.all([
        fetch(`${REACT_NATIVE_API_BASE_URL}/api/orders?timestamp=${Date.now()}`, {
          headers: {
            'x-api-key': REACT_NATIVE_API_KEY,
          },
        }),
        fetch(`${REACT_NATIVE_API_BASE_URL}/api/order_products?timestamp=${Date.now()}`, {
          headers: {
            'x-api-key': REACT_NATIVE_API_KEY,
          },
        }),
      ]);

      if (ordersResponse.ok) {
        const allOrds = await ordersResponse.json();        
        const updatedOrders = allOrds
          .filter(order => order.shop_id === shopData.shop_id)
          .sort((a, b) => b.order_id - a.order_id);
        setOrders(updatedOrders);
      } else {
        console.error('Failed to fetch orders:', ordersResponse.statusText);
      }

      if (productsResponse.ok) {
        const allOrdProds = await productsResponse.json();
        setOrderProducts(allOrdProds);
      } else {
        console.error('Failed to fetch order products:', productsResponse.statusText);
      }
    } catch (error) {
      console.error('Error fetching orders or products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAsyncShopData();
    };

    fetchData();
  }, []); 

  useEffect(() => {
    let interval;

    if (shopData) {
      fetchOrdersAndProducts();
      interval = setInterval(() => {
        fetchOrdersAndProducts();
      }, 5000);
    }

    // Cleanup function to clear the interval
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [shopData]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
    <Tab.Navigator
      initialRouteName={initialRouteName}
      screenOptions={({ route }) => ({
        swipeEnabled: true,
        tabBarScrollEnabled: true,
        lazy: true,
        tabBarIcon: ({ color, focused }) => {
          let iconName;

          switch (route.name) {
            case "To Confirm":
              iconName = "hourglass-outline"; 
              break;
            case "Preparing":
              iconName = "cog-outline"; 
              break;
            case "Shipping":
              iconName = "car-sharp"; 
              break;
            case "Pickup":
              iconName = "logo-dropbox"; 
              break;
            case "For Return":
              iconName = "return-up-back-outline"; 
              break;
            case "Returned":
              iconName = "checkmark-circle-outline"; 
              break;
            case "To Rate":
              iconName = "star-outline"; 
              break;
            case "Completed":
              iconName = "checkmark-done-outline"; 
              break;
            case "Rejected":
              iconName = "close-circle-sharp"; 
              break;
            default:
              iconName = "ellipse-outline"; 
              break;
          }

          return (
            <View style={{ alignItems: "center" }}>
              <Icon name={iconName} size={25} color={color} />
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
      <Tab.Screen name="To Confirm" options={{ tabBarLabel: "To Confirm" }}>
        {() => <ToConfirmScreen orders={orders} orderProducts={orderProducts} />}
      </Tab.Screen>
      <Tab.Screen name="Preparing" options={{ tabBarLabel: "Preparing" }}>
        {() => <PreparingScreen orders={orders} orderProducts={orderProducts} />}
      </Tab.Screen>
      <Tab.Screen name="Shipping" options={{ tabBarLabel: "Shipping" }}>
        {() => <ShippingScreen orders={orders} orderProducts={orderProducts} />}
      </Tab.Screen>
      <Tab.Screen name="Pickup" options={{ tabBarLabel: "Pickup" }}>
        {() => <PickupScreen orders={orders} orderProducts={orderProducts} />}
      </Tab.Screen>
      <Tab.Screen name="For Return" options={{ tabBarLabel: "For Return" }}>
        {() => <ForReturnScreen orders={orders} orderProducts={orderProducts} />}
      </Tab.Screen>
      <Tab.Screen name="Returned" options={{ tabBarLabel: "Returned" }}>
        {() => <ReturnedScreen orders={orders} orderProducts={orderProducts} />}
      </Tab.Screen>
      <Tab.Screen name="To Rate" options={{ tabBarLabel: "To Rate" }}>
        {() => <ToRateScreen orders={orders} orderProducts={orderProducts} />}
      </Tab.Screen>
      <Tab.Screen name="Completed" options={{ tabBarLabel: "Completed" }}>
        {() => <CompletedScreen orders={orders} orderProducts={orderProducts} />}
      </Tab.Screen>
      <Tab.Screen name="Rejected" options={{ tabBarLabel: "Rejected" }}>
        {() => <RejectedScreen orders={orders} orderProducts={orderProducts} />}
      </Tab.Screen>
    </Tab.Navigator>
    <NavigationbarComponent/>
    </>
  );
}

export default ViewSalesHistoryScreen;
