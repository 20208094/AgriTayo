import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import NetInfo from "@react-native-community/netinfo"; 
import SplashScreen from "./app/screens/Splash/SplashScreen";
import LoginScreen from "./app/screens/Login/LoginScreen";
import RegisterScreenBuyers from "./app/screens/Register/RegisterScreenBuyers";
import HomePageScreen from "./app/screens/Home/HomePageScreen";
import NavigationBar from "./app/components/NavigationBar";
import CartScreen from "./app/screens/Cart/CartScreen";
import MessageScreen from "./app/screens/Message/MessageScreen";
import NotificationScreen from "./app/screens/Notification/NotificationScreen";
import ProductDetailsScreen from "./app/screens/Home/ProductDetailsScreen";
import NotificationDetailsScreen from "./app/screens/Notification/NotificationDetailsScreen";
import OTPScreen from "./app/screens/Register/OTPScreen";
import ChangeEmailScreen from "./app/screens/Register/ChangeEmailScreen";
import ForgotPasswordScreen from "./app/screens/Login/ForgotPasswordScreen";
import ChangePasswordOTPSCreen from "./app/screens/Login/ChangePasswordOTPScreen";
import NewPasswordScreen from "./app/screens/Login/NewPasswordScreen";
import ViewProfileScreen from "./app/screens/Profile/ViewProfileScreen";
import AddressScreen from "./app/screens/Profile/Address/AddressScreen";
import AddAddressScreen from "./app/screens/Profile/Address/AddAdressScreen";
import ViewAddressScreen from "./app/screens/Profile/ViewAddressScreen";
import EditProfileScreen from "./app/screens/Profile/EditProfileScreen";
import EditAddress from "./app/screens/Profile/Address/EditAddress";
import StartSelling from "./app/screens/Profile/StartSellingScreen";
import ShopInformationScreen from "./app/screens/farmers/ShopInformationScreen";
import BusinessInformationScreen from "./app/screens/farmers/BusinessInformationScreen";
import CheckOutScreen from "./app/screens/Cart/CheckOutScreen";
import PhoneAuthenticationScreen from "./app/screens/farmers/PhoneAuthenticationScreen";
import EmailAuthenticationScreen from "./app/screens/farmers/EmailAuthenticationScreen";
import PickUpAddressScreen from "./app/screens/farmers/PickUpAddressScreen";
import MarketCategoryListScreen from "./app/screens/Market/MarketCategory/MarketCategoryListScreen";
import MarketCategoryScreen from "./app/screens/Market/MarketCategory/MarketCategoryScreen";
import MarketAnalyticScreen from "./app/screens/Analytics/MarketAnalyticScreen";
import ShopScreen from "./app/screens/farmers/Shop/ShopScreen";

const Stack = createStackNavigator();

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnected(state.isConnected);
      if (!state.isConnected) {
        showAlert();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const showAlert = () => {
    Alert.alert(
      'Internet Connection',
      'You are offline. Some features may not be available.'
    );
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  const screenOptions = {
    headerTitleStyle: {
      color: "#2E7D32",
    },
    headerTintColor: "#2E7D32",
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        {isLoading ? (
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ ...screenOptions, headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreenBuyers}
              options={{ ...screenOptions, headerShown: false }}
            />
            <Stack.Screen
              name="HomePageScreen"
              component={HomePageScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="CartScreen"
              component={CartScreen}
              options={{ ...screenOptions, headerShown: false }}
            />
            <Stack.Screen
              name="Messages"
              component={MessageScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Notifications"
              component={NotificationScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Product Details"
              component={ProductDetailsScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Notification Details"
              component={NotificationDetailsScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="NavigationBar"
              component={NavigationBar}
              options={{ ...screenOptions, headerShown: false }}
            />
            <Stack.Screen
              name="OTP Screen"
              component={OTPScreen}
              options={{ ...screenOptions, headerShown: false }}
            />
            <Stack.Screen
              name="Change Email"
              component={ChangeEmailScreen}
              options={{ ...screenOptions, headerShown: false }}
            />
            <Stack.Screen
              name="Forgot Password"
              component={ForgotPasswordScreen}
              options={{ ...screenOptions, headerShown: false }}
            />
            <Stack.Screen
              name="Change Password OTP"
              component={ChangePasswordOTPSCreen}
              options={{ ...screenOptions, headerShown: false }}
            />
            <Stack.Screen
              name="New Password"
              component={NewPasswordScreen}
              options={{ ...screenOptions, headerShown: false }}
            />
            <Stack.Screen
              name="View Profile"
              component={ViewProfileScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Address"
              component={AddressScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Add Address"
              component={AddAddressScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="View Address"
              component={ViewAddressScreen}
              options={{ ...screenOptions, headerShown: false }}
            />
            <Stack.Screen
              name="Edit Profile"
              component={EditProfileScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Edit Address"
              component={EditAddress}
              options={screenOptions}
            />
            <Stack.Screen
              name="Welcome To Agritayo!"
              component={StartSelling}
              options={{ ...screenOptions, headerShown: false }}
            />
            <Stack.Screen
              name="Shop Information"
              component={ShopInformationScreen}
              options={{ ...screenOptions, headerShown: false }}
            />
            <Stack.Screen
              name="Business Information"
              component={BusinessInformationScreen}
              options={{ ...screenOptions, headerShown: false }}
            />
            <Stack.Screen
              name="CheckOutScreen"
              component={CheckOutScreen}
              options={{ ...screenOptions, headerShown: false }}
            />
            <Stack.Screen
              name="Authentication"
              component={PhoneAuthenticationScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Email Authentication"
              component={EmailAuthenticationScreen}
              options={{ ...screenOptions, headerShown: false }}
            />
            <Stack.Screen
              name="Pickup Address"
              component={PickUpAddressScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Market List"
              component={MarketCategoryListScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Market Category"
              component={MarketCategoryScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Market Analytics"
              component={MarketAnalyticScreen}
              options={screenOptions}
            />
            <Stack.Screen
            name='Shop'
            component={ShopScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
