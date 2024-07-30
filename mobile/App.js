import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import SplashScreen from "./app/screens/SplashScreen";
import LoginScreen from "./app/screens/LoginScreen";
import RegisterScreenBuyers from "./app/screens/RegisterScreenBuyers";
import HomePageScreen from "./app/screens/HomePageScreen";
import NavigationBar from "./app/components/NavigationBar";
import CartScreen from "./app/screens/CartScreen";
import MessageScreen from "./app/screens/MessageScreen";
import NotificationScreen from "./app/screens/NotificationScreen";
import ProductDetailsScreen from "./app/screens/ProductDetailsScreen";
import MessageDetailsScreen from "./app/screens/MessageDetailsScreen";
import NotificationDetailsScreen from "./app/screens/NotificationDetailsScreen";
import OTPScreen from "./app/screens/OTPScreen";
import ChangeEmailScreen from "./app/screens/ChangeEmailScreen";
import ForgotPasswordScreen from "./app/screens/ForgotPasswordScreen";
import ChangePasswordOTPSCreen from "./app/screens/ChangePasswordOTPScreen";
import NewPasswordScreen from "./app/screens/NewPasswordScreen";
import ViewProfileScreen from "./app/screens/ViewProfileScreen";
import AddressScreen from "./app/screens/AddressScreen";
import AddAddressScreen from "./app/screens/AddAdressScreen";
import ViewAddressScreen from "./app/screens/ViewAddressScreen";
import EditProfileScreen from "./app/screens/EditProfileScreen";
import EditAddress from "./app/screens/EditAddress";
import StartSelling from "./app/screens/StartSellingScreen";
import ShopInformationScreen from "./app/screens/farmers/ShopInformationScreen";
import BusinessInformationScreen from "./app/screens/BusinessInformationScreen";
import CheckOutScreen from "./app/screens/CheckOutScreen";

const Stack = createStackNavigator();

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); 
  }, []);

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
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreenBuyers}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="HomePageScreen" component={HomePageScreen} />
            <Stack.Screen
              name="CartScreen"
              component={CartScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Messages" component={MessageScreen} />
            <Stack.Screen name="Notifications" component={NotificationScreen} />
            <Stack.Screen
              name="Product Details"
              component={ProductDetailsScreen}
            />
            <Stack.Screen
              name="Message Details"
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
            <Stack.Screen
              name="OTP Screen"
              component={OTPScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Change Email"
              component={ChangeEmailScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Forgot Password"
              component={ForgotPasswordScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Change Password OTP"
              component={ChangePasswordOTPSCreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="New Password"
              component={NewPasswordScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='View Profile'
              component={ViewProfileScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
            name = 'Address'
            component = {AddressScreen}
            options={{ headerShown: false }}
            />
            <Stack.Screen
            name = 'Add Address'
            component = {AddAddressScreen}
            />
            <Stack.Screen
            name='View Address'
            component={ViewAddressScreen}
            options={{ headerShown: false }}
            />
            <Stack.Screen
            name='Edit Profile'
            component={EditProfileScreen}
            />
            <Stack.Screen
            name='Edit Address'
            component={EditAddress}
            />
            <Stack.Screen
            name='Welcome To Agritayo!'
            component={StartSelling}
            />
            <Stack.Screen
            name='Shop Information'
            component={ShopInformationScreen}
            />
            <Stack.Screen
            name='Business Information'
            component={BusinessInformationScreen}
            />
            <Stack.Screen
              name="CheckOutScreen"
              component={CheckOutScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
