import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from "socket.io-client";
import SplashScreen from "./app/screens/Splash/SplashScreen";
import LoginScreen from "./app/screens/Authentication/LoginScreen";
import LogoutModal from "./app/screens/Authentication/LogoutModal";
import RegisterScreenBuyers from "./app/screens/Register/RegisterScreenBuyers";
import HomePageScreen from "./app/screens/Home/HomePageScreen";
import NavigationBar from "./app/components/NavigationBar";
import CartScreen from "./app/screens/Cart/CartScreen";
import MessageScreen from "./app/screens/Message/MessageScreen";
import NotificationScreen from "./app/screens/Notification/NotificationScreen";
import ProductDetailsScreen from "./app/screens/Home/ProductDetailsScreen";
import ProductDetailsScreenNoData from "./app/screens/Home/ProductDetailsScreenNoData";
import NotificationDetailsScreen from "./app/screens/Notification/NotificationDetailsScreen";
import OTPScreen from "./app/screens/Register/OTPScreen";
import ChangeEmailScreen from "./app/screens/Register/ChangeEmailScreen";
import ForgotPasswordScreen from "./app/screens/Authentication/ForgotPasswordScreen";
import ChangePasswordOTPSCreen from "./app/screens/Authentication/ChangePasswordOTPScreen";
import NewPasswordScreen from "./app/screens/Authentication/NewPasswordScreen";
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
import BiddingDetailsScreen from "./app/screens/Bidding/BiddingDetailsScreen";
import OrderDetailsScreen from "./app/screens/Orders/OrderDetailsScreen";
import SellerFaq from "./app/screens/farmers/Shop/LearnAndHelp/SellerFaqScreen";
import ChatSupportScreen from "./app/screens/farmers/Shop/LearnAndHelp/ChatSupportScreen";
import EditShopScreen from "./app/screens/farmers/Shop/ViewSalesHistory/EditShopScreen";
import ProfileScreen from "./app/screens/Profile/ProfileScreen";
import Navigator from "./app/components/Navigator";
// for farmers
import ShopScreen from "./app/screens/farmers/Shop/ShopScreen";
import ViewShopScreen from "./app/screens/farmers/Shop/ViewShopScreen";
import ViewSalesHistoryScreen from "./app/screens/farmers/Shop/ViewSalesHistory/ViewSalesHistoryScreen";
import MyProductsScreen from "./app/screens/farmers/Shop/MyProducts/MyProductsScreen";
import ShopPerformaceScreen from "./app/screens/farmers/Shop/ShopPerformanceScreen";
import BiddingScreen from "./app/screens/farmers/Shop/FarmersBidding/BiddingScreen";
import BiddingDetailsFarmersScreen from "./app/screens/farmers/Shop/FarmersBidding/BiddingDetailsFarmersScreen";
import LearnAndHelpScreen from "./app/screens/farmers/Shop/LearnAndHelpScreen";
import ShopRatingScreen from "./app/screens/farmers/Shop/ShopPerformance/ShopRatingScreen";
import BusinessInsightsScreen from "./app/screens/farmers/Shop/ShopPerformance/BusinessInsightsScreen";
import AccountHealthScreen from "./app/screens/farmers/Shop/ShopPerformance/AccountHealthScreen";
import SellerShopScreen from "./app/screens/farmers/Shop/SellerShopScreen";
import AddBidScreen from "./app/screens/farmers/Shop/FarmersBidding/AddBidScreen";
import FarmersProductDetailScreen from "./app/screens/farmers/Shop/MyProducts/FarmersProductDetailsScreen";
import FarmersOrderDetailsScreen from "./app/screens/farmers/Shop/ViewSalesHistory/FarmersOrderDetailsScreen";
import ViewShopDetailsScreen from "./app/screens/farmers/Shop/ViewShopDetailsScreen";
import AddProductScreen from "./app/screens/farmers/Shop/MyProducts/AddProductScreen";
// for chat
import ChatScreen from "./app/screens/Chat/ChatScreen";
import ChatListScreen from "./app/screens/Chat/ChatListScreen";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from '@env';
const SOCKET_URL = 'https://agritayo.azurewebsites.net';

const Stack = createStackNavigator();
const API_KEY = REACT_NATIVE_API_KEY

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setConnected] = useState(true);
  const [userSession, setUserSession] = useState(null);
  const [userData, setUserData] = useState(null);

  const navigationRef = React.createRef();

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
      "Internet Connection",
      "You are offline. Some features may not be available."
    );
  };

  const fetchUserSession = async () => {
    try {
      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/session`, {
        headers: {
          'x-api-key': REACT_NATIVE_API_KEY,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserSession(data);
        await fetchUsers(data); // Fetch users after setting the session
      } else {
        console.warn('Session fetch failed:', response.status);
        setUserSession(null);
      }
    } catch (error) {
      console.error('Error fetching user session:', error);
      setUserSession(null);
    } finally {
      setIsLoading(false); // Set loading to false regardless of outcome
    }
  };

  const fetchUsers = async (sessionData) => {
    try {
      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/users`, {
        headers: {
          'x-api-key': REACT_NATIVE_API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const users = await response.json();
      const filteredUsers = users.filter(user => user.user_id === sessionData.user_id);
      // console.log("Filtered Users:", filteredUsers);

      try {
        await AsyncStorage.setItem('userData', JSON.stringify(filteredUsers));
        // console.log("userData saved successfully");
      } catch (error) {
        console.error('Error saving userData:', error);
      }
      
      try {
        await AsyncStorage.setItem('userSession', JSON.stringify(filteredUsers));
        // console.log("userSession saved successfully");
      } catch (error) {
        console.error('Error saving userSession:', error);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const loadSessionData = async () => {
    await fetchUserSession();
  };

  useEffect(() => {
    loadSessionData();

    const socket = io(SOCKET_URL, { transports: ['websocket'] });
    socket.on('connect', () => {
      console.log('WebSocket connected:', socket.id);
    });
    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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
        ) : userSession ? (
          <>
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
              name="ChatListScreen"
              component={ChatListScreen}
              options={{ ...screenOptions, headerShown: true }}
            />
            <Stack.Screen
              name="ChatScreen"
              component={ChatScreen}
              options={{ ...screenOptions, headerShown: true }}
            />
            <Stack.Screen
              name="CartScreen"
              component={CartScreen}
              options={screenOptions}
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
              name="Product Details No Data"
              component={ProductDetailsScreenNoData}
              options={screenOptions}
            />
            <Stack.Screen
              name="Notification Details"
              component={NotificationDetailsScreen}
              options={screenOptions}
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
              name="Profile Screen"
              component={ProfileScreen}
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
              options={{ ...screenOptions }}
            />
            <Stack.Screen
              name="Shop Information"
              component={ShopInformationScreen}
              options={{ ...screenOptions }}
            />
            <Stack.Screen
              name="Business Information"
              component={BusinessInformationScreen}
              options={{ ...screenOptions }}
            />
            <Stack.Screen
              name="My Shop"
              component={ShopScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="CheckOutScreen"
              component={CheckOutScreen}
              options={screenOptions}
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
              name="Market Subcategory"
              component={MarketCategoryListScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Product List"
              component={MarketCategoryScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Market Analytics"
              component={MarketAnalyticScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="View Shop"
              component={ViewShopScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Sales History"
              component={ViewSalesHistoryScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="My Products"
              component={MyProductsScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Shop Performance"
              component={ShopPerformaceScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Bidding"
              component={BiddingScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Learn and Help"
              component={LearnAndHelpScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Shop Rating"
              component={ShopRatingScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Bussiness Insights"
              component={BusinessInsightsScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Account Health"
              component={AccountHealthScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Message Seller"
              component={MessageSellerScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Negotiate To Seller"
              component={NegotiateToSellerScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Seller Shop"
              component={SellerShopScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name='Bidding Details'
              component={BiddingDetailsScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name='Shop Bidding Details'
              component={BiddingDetailsFarmersScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name='Add Bid'
              component={AddBidScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name='Farmers Product Details'
              component={FarmersProductDetailScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name='Farmers Orders Details'
              component={FarmersOrderDetailsScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name='Order Details'
              component={OrderDetailsScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Navigator"
              options={{ ...screenOptions, headerShown: false }}
            >
              {({ navigation }) => <Navigator fetchUserSession={(nav) => fetchUserSession(nav)} navigation={navigation} />}
            </Stack.Screen>
            <Stack.Screen
              name='View Shop Details'
              component={ViewShopDetailsScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name='Add Product'
              component={AddProductScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name='Seller FAQ'
              component={SellerFaq}
              options={screenOptions}
            />
            <Stack.Screen
              name='Chat Support'
              component={ChatSupportScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name='Edit Shop'
              component={EditShopScreen}
              options={screenOptions}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              options={{ ...screenOptions, headerShown: false }}
            >
              {({ navigation }) => <LoginScreen fetchUserSession={fetchUserSession} navigation={navigation} />}
            </Stack.Screen>
            <Stack.Screen
              name="Navigator"
              options={{ ...screenOptions, headerShown: false }}
            >
              {({ navigation }) => <Navigator fetchUserSession={(nav) => fetchUserSession(nav)} navigation={navigation} />}
            </Stack.Screen>
            <Stack.Screen
              name="Register"
              component={RegisterScreenBuyers}
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
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer >
  );
}

export default App;
