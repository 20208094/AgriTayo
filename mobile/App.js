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
import MessageSellerScreen from "./app/screens/Message/MessageSellerScreen";
import NegotiateToSellerScreen from "./app/screens/Message/NegotiateToSellerScreen";
// for farmers
import ShopScreen from "./app/screens/farmers/Shop/ShopScreen";
import ViewShopScreen from "./app/screens/farmers/Shop/ViewShopScreen";
import ViewSalesHistoryScreen from "./app/screens/farmers/Shop/ViewSalesHistory/ViewSalesHistoryScreen";
import MyProductsScreen from "./app/screens/farmers/Shop/MyProducts/MyProductsScreen";
import FinanceScreen from "./app/screens/farmers/Shop/FinanceScreen";
import ShopPerformaceScreen from "./app/screens/farmers/Shop/ShopPerformanceScreen";
import BiddingScreen from "./app/screens/farmers/Shop/BiddingScreen";
import LearnAndHelpScreen from "./app/screens/farmers/Shop/LearnAndHelpScreen";
import ShopRatingScreen from "./app/screens/farmers/Shop/ShopPerformance/ShopRatingScreen";
import BusinessInsightsScreen from "./app/screens/farmers/Shop/ShopPerformance/BusinessInsightsScreen";
import AccountHealthScreen from "./app/screens/farmers/Shop/ShopPerformance/AccountHealthScreen";
import SellerShopScreen from "./app/screens/farmers/Shop/SellerShopScreen";


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
              name="NavigationBar"
              component={NavigationBar}
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
            name='My Shop'
            component={ShopScreen}
            options={screenOptions}
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
            name='View Shop'
            component={ViewShopScreen}
            options={screenOptions}
            />
            <Stack.Screen
            name='Sales History'
            component={ViewSalesHistoryScreen}
            options={screenOptions}
            />
            <Stack.Screen
            name='My Products'
            component={MyProductsScreen}
            options={screenOptions}
            />
            <Stack.Screen
            name='My Finance'
            component={FinanceScreen}
            options={screenOptions}
            />
            <Stack.Screen
            name='Shop Performance'
            component={ShopPerformaceScreen}
            options={screenOptions}
            />
            <Stack.Screen
            name='Bidding'
            component={BiddingScreen}
            options={screenOptions}
            />
            <Stack.Screen
            name='Learn and Help'
            component={LearnAndHelpScreen}
            options={screenOptions}
            />
            <Stack.Screen
            name='Shop Rating'
            component={ShopRatingScreen}
            options={screenOptions}
            />
            <Stack.Screen
            name='Bussiness Insights'
            component={BusinessInsightsScreen}
            options={screenOptions}
            />
            <Stack.Screen
            name='Account Health'
            component={AccountHealthScreen}
            options={screenOptions}
            />
            <Stack.Screen
            name='Message Seller'
            component={MessageSellerScreen}
            options={screenOptions}
            />
            <Stack.Screen
            name='Negotiate To Seller'
            component={NegotiateToSellerScreen}
            options={screenOptions}
            />
            <Stack.Screen
            name='Seller Shop'
            component={SellerShopScreen}
            options={screenOptions}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
