import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./app/screens/LoginScreen";
import RegisterScreenBuyers from "./app/screens/RegisterScreenBuyers";
import RegisterScreenFarmers from "./app/screens/farmers/RegisterScreenFarmers";
import HomePageScreen from "./app/screens/HomePageScreen";
import NavigationBar from "./app/components/NavigationBar";
import CartScreen from "./app/screens/CartScreen";
import MessageScreen from "./app/screens/MessageScreen";
import NotificationScreen from "./app/screens/NotificationScreen";
import ProductDetailsScreen from "./app/screens/ProductDetailsScreen";
import MessageDetailsScreen from "./app/screens/MessageDetailsScreen";
import NotificationDetailsScreen from "./app/screens/NotificationDetailsScreen";

const Stack = createStackNavigator();

function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen
            name="Register"
            component={RegisterScreenBuyers}
          />
          <Stack.Screen
            name="Register As Farmers"
            component={RegisterScreenFarmers}
          />
          <Stack.Screen name="HomePageScreen" component={HomePageScreen} />
          <Stack.Screen name="CartScreen" component={CartScreen} />
          <Stack.Screen name="Messages" component={MessageScreen} />
          <Stack.Screen name="Notifications" component={NotificationScreen} />
          <Stack.Screen
            name="Product Details"
            component={ProductDetailsScreen}
          />
          <Stack.Screen
            name=```````````````````````````````````````````````````````"Message Details"
            component={MessageDetailsScreen}
          />
          <Stack.Screen
            name="Notification Details"
            component={NotificationDetailsScreen}
          />
          <Stack.Screen
            name="NavigationBar"
            component={NavigationBar}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default App;
