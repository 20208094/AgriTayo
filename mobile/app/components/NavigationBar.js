import React, { useState } from "react";
import { View, TouchableOpacity, Animated, StyleSheet, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import HomePageScreen from "../screens/Home/HomePageScreen";
import CropsScreen from "../screens/Market/CropsScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import AnalyticScreen from "../screens/Analytics/AnalyticScreen";
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
        duration: 300,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const menuStyle = {
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
    ],
    opacity: animation,
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
              case "Actions":
                iconName = "chevron-up-circle-outline";
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
          component={() => null} // Placeholder to use button instead
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              toggleMenu();
            },
          }}
          options={{ tabBarLabel: "Actions" }}
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


      {/* if "Actions" is clicked, show */}
      {menuVisible && (
        <Animated.View style={[styles.radialMenu, menuStyle]}>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => navigation.navigate("Orders")}>
            <Icon name="receipt-outline" size={30} color="#00B251" />
            <Text style={styles.menuText}>My Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate("Buyer Negotiation")}>
            <Icon name="swap-horizontal-outline" size={30} color="#00B251" />
            <Text style={styles.menuText}>My Negotiations</Text>
          </TouchableOpacity>

          {/* Di ko sure pano pag farmer yung nakalog in, pang buyer lang to so far */}
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate("Buyer Bidding")} > 
            <Icon name="people-outline" size={30} color="#00B251" />
            <Text style={styles.menuText}>Bidding</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton} >
            <Icon name="ticket-outline" size={30} color="#00B251" />
            <Text style={styles.menuText}>My Bids</Text>
          </TouchableOpacity>
          
          {/* Di ko sure pano i integrate yung if else statement na mag hihide dito pag buyer naka log in, My Shop dapat nasa navigate pero nag eeror kaya temp lang muna yung view shop*/}
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate("View Shop")}>
            <Icon name="storefront-outline" size={30} color="#00B251" />
            <Text style={styles.menuText}>My Shop</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  radialMenu: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  menuButton: {
    backgroundColor: "white",
    borderRadius: 50,
    padding: 10,
    marginVertical: 5,
    elevation: 3,
    alignItems: "center",
  },
});

export default NavigationBar;
