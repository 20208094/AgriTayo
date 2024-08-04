import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useEffect, useState } from "react";
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
import FruitCategoryScreen from "./app/screens/Market/MarketCategory/FruitCategoryScreen";
import VegetableCategoryScreen from "./app/screens/Market/MarketCategory/VegetableCategoryScreen";
import SeedlingCategoryScreen from "./app/screens/Market/MarketCategory/SeedlingCategoryScreen";
import SpicesCategoryScreen from "./app/screens/Market/MarketCategory/SpicesCategoryScreen";
import PlantCategoryScreen from "./app/screens/Market/MarketCategory/PlantCategoryScreen";
import FlowerCategoryScreen from "./app/screens/Market/MarketCategory/FlowerCategoryScreen";

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
              name="View Profile"
              component={ViewProfileScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Address"
              component={AddressScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Add Address" component={AddAddressScreen} />
            <Stack.Screen
              name="View Address"
              component={ViewAddressScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Edit Profile" component={EditProfileScreen} />
            <Stack.Screen name="Edit Address" component={EditAddress} />
            <Stack.Screen
              name="Welcome To Agritayo!"
              component={StartSelling}
            />
            <Stack.Screen
              name="Shop Information"
              component={ShopInformationScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Business Information"
              component={BusinessInformationScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CheckOutScreen"
              component={CheckOutScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Authentication"
              component={PhoneAuthenticationScreen}
            />
            <Stack.Screen
              name="Email Authentication"
              component={EmailAuthenticationScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Pickup Address"
              component={PickUpAddressScreen}
            />
            <Stack.Screen
            name='Fruit Category'
            component={FruitCategoryScreen}
            />
            <Stack.Screen
            name='Vegetable Category'
            component={VegetableCategoryScreen}
            />
            <Stack.Screen
            name='Seedling Category'
            component={SeedlingCategoryScreen}
            />
            <Stack.Screen
            name='Spices Category'
            component={SpicesCategoryScreen}
            />
            <Stack.Screen
            name='Plant Category'
            component={PlantCategoryScreen}
            />
            <Stack.Screen
            name='Flower Category'
            component={FlowerCategoryScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
