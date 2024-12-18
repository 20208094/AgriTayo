import * as React from "react";
import * as Notifications from "expo-notifications";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import io from "socket.io-client";
import SplashScreen from "./app/screens/Splash/SplashScreen";
import LoginScreen from "./app/screens/Authentication/LoginScreen";
import LogoutModal from "./app/screens/Authentication/LogoutModal";
import RegisterScreenBuyers from "./app/screens/Register/RegisterScreenBuyers";
import HomePageScreen from "./app/screens/Home/HomePageScreen";
import FeaturedProductScreen from "./app/screens/Home/FeaturedProductScreen";
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
import MarketCategoryListScreen from "./app/screens/Market/MarketCategory/MarketCategoryListScreen";
import MarketCategoryScreen from "./app/screens/Market/MarketCategory/MarketCategoryScreen";
import MarketAnalyticScreen from "./app/screens/Analytics/MarketAnalyticScreen";
import MessageSellerScreen from "./app/screens/Message/MessageSellerScreen";
import NegotiateToSellerScreen from "./app/screens/Message/NegotiateToSellerScreen";
import BiddingDetailsScreen from "./app/screens/Bidding/BiddingDetailsScreen";
import BiddingViewAllScreen from "./app/screens/Bidding/BiddingViewAllScreen";
import OrderDetailsScreen from "./app/screens/Orders/OrderDetailsScreen";
import SellerFaq from "./app/screens/farmers/Shop/LearnAndHelp/SellerFaqScreen";
import CustomerFaq from "./app/screens/Profile/CustomerFaqScreen";
import ChatSupportScreen from "./app/screens/farmers/Shop/LearnAndHelp/ChatSupportScreen";
import EditShopScreen from "./app/screens/farmers/Shop/ViewSalesHistory/EditShopScreen";
import ProfileScreen from "./app/screens/Profile/ProfileScreen";
import Navigator from "./app/components/Navigator";
import NegotiationSellerScreen from "./app/screens/Negotiation/Seller/NegotiationSellerScreen";
import NegotiationBuyerScreen from "./app/screens/Negotiation/Buyer/NegotiationBuyersScreen";
import NegotiationSellerListScreen from "./app/screens/Negotiation/Seller/NegotiationSellerListScreen";
import NegotiationBuyerListScreen from "./app/screens/Negotiation/Buyer/NegotiationBuyerListScreen";
import NegotiationBuyerEditScreen from "./app/screens/Negotiation/Buyer/NegotiationBuyerEditScreen";
import AddLocation from "./app/components/AddLocation";
import OrdersScreen from "./app/screens/Orders/OrdersScreen";
import BiddingBuyerScreen from "./app/screens/Bidding/BiddingBuyerScreen";
import PlaceABid from "./app/screens/Bidding/PlaceABidScreen";
import AnalyticScreen from "./app/screens/Analytics/AnalyticScreen";
import MyBidScreen from "./app/screens/Bidding/MyBidScreen";
import PastBidScreen from "./app/screens/Bidding/PastBidScreen";
import WonBidScreen from "./app/screens/Bidding/WonBidScreen";
import AddAnotherBid from "./app/screens/Bidding/AddAnotherBidScreen";
import CropsScreen from "./app/screens/Market/CropsScreen";
import MarketVarietyListScreen from "./app/screens/Market/MarketCategory/MarketCropVarietyListScreen";
import LostPhoneNumberScreen from "./app/screens/Authentication/LostPhoneNumberScreen";
import LostPhoneNumberOTPScreen from "./app/screens/Authentication/LostPhoneNumberOTPScreen";
import NewPhoneNumberScreen from "./app/screens/Authentication/NewPhoneNumberScreen";
import EditPhoneNumberScreen from "./app/screens/Profile/EditPhoneNumberScreen";
import EditSecondaryPhoneNumberScreen from "./app/screens/Profile/EditSecondaryPhoneNumberScreen";
import OTPOnlyPhoneScreen from "./app/screens/Register/OTPOnlyPhoneScreen";
import ShopOTPScreen from "./app/screens/farmers/ShopOTPScreen";
import EditShopPhoneInformationScreen from "./app/screens/farmers/EditShopPhoneInformationScreen";
import EditShopAlternativePhoneInformationScreen from "./app/screens/farmers/EditShopAlternativePhoneInformationScreen";
import ChangePasswordScreen from "./app/screens/Profile/ChangePasswordScreen";
import EditPasswordOTPScreen from "./app/screens/Profile/EditPasswordOTPScreen";
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
import AddCropCategoryScreen from "./app/screens/farmers/Shop/MyProducts/AddCropCategoryScreen";
import AddCropSubCategoryScreen from "./app/screens/farmers/Shop/MyProducts/AddCropSubCategoryScreen";
import AddCropVarietyScreen from "./app/screens/farmers/Shop/MyProducts/AddCropVarietyScreen";
import CompletedBidScreen from "./app/screens/farmers/Shop/FarmersBidding/CompletedBidScreen";
import ShopPhonesOTPScreen from "./app/screens/farmers/ShopPhonesOTPScreen";
import EditShopPhoneScreen from "./app/screens/farmers/Shop/EditShopPhoneScreen";
import EditSecondaryShopPhoneScreen from "./app/screens/farmers/Shop/EditSecondaryShopPhoneScreen";
import EditBidScreen from "./app/screens/farmers/Shop/FarmersBidding/EditBidScreen";
// for chat
import ChatScreen from "./app/screens/Chat/ChatScreen";
import ChatListScreen from "./app/screens/Chat/ChatListScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import FilterProductsScreen from "./app/screens/Market/FilterProductsScreen";
import CompareShopsScreen from "./app/screens/Market/CompareShospScreen";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
const SOCKET_URL = REACT_NATIVE_API_BASE_URL;

const Stack = createStackNavigator();
const API_KEY = REACT_NATIVE_API_KEY;

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
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserSession(data);
        setUserData(data);
        await fetchUsers(data);
        if ((data.user_type_id = 2 || 1)) {
          await fetchShops(data);
        }
      } else {
        // if theres no logged in user, go to login screen
        setUserSession(null);
        setUserData(null);
        navigationRef.current?.navigate("Login");
      }
    } catch (error) {
      console.error("Error fetching user session:", error);
      setUserSession(null);
    } finally {
      setIsLoading(false); // Set loading to false regardless of outcome
    }
  };
  // fetch all users
  const fetchUsers = async (sessionData) => {
    try {
      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/users`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });

      const users = await response.json();
      // get user data of the logged in user
      const filteredUsers = users.filter(
        (user) => user.user_id === sessionData.user_id
      );
      // save user data to assync storage userData
      try {
        await AsyncStorage.setItem("userData", JSON.stringify(filteredUsers));
      } catch (error) {
        console.error("Error saving userData:", error);
      }
      // save user data to assync storage userSession
      try {
        await AsyncStorage.setItem(
          "userSession",
          JSON.stringify(filteredUsers)
        );
      } catch (error) {
        console.error("Error saving userSession:", error);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  // fetch all shops
  const fetchShops = async (sessionData) => {
    try {
      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/shops`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });

      const shops = await response.json();
      // get user data of the logged in user
      const filteredShops = shops.filter(
        (shop) => shop.user_id === sessionData.user_id
      );
      // save user data to assync storage userData
      try {
        await AsyncStorage.setItem("shopData", JSON.stringify(filteredShops));
      } catch (error) {
        console.error("Error saving shopData:", error);
      }
      // save user data to assync storage userSession
      try {
        await AsyncStorage.setItem(
          "shopSession",
          JSON.stringify(filteredShops)
        );
      } catch (error) {
        console.error("Error saving shopSession:", error);
      }
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  };

  const loadSessionData = async () => {
    await fetchUserSession();
  };


  useEffect(() => {
    const interval = setInterval(() => {
      loadSessionData();
    }, 10000); // 20000 milliseconds = 20 seconds
  
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  useEffect(() => {
    if (!userData){
      console.log('userData is Empty:');
      return;
    }  // Avoid initializing socket listeners if userData is not set
  
    const socket = io(SOCKET_URL, { transports: ["websocket"] });
  
    socket.on("connect", () => {
      // console.log("WebSocket connected:", socket.id);
    });
  
    socket.on("mobilePushNotification", (notificationData) => {
      if (notificationData.user_id === userData.user_id) {
        triggerNotification(notificationData);
      }
    });
  
    socket.on("disconnect", () => {
      // console.log("WebSocket disconnected");
    });
  
    return () => {
      socket.disconnect();
    };
  }, [userData]); // Re-initialize when userData changes
  
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 10000);
  }, []);

  // PUSH NOTIFICATIONS
  useEffect(() => {
    // Request notification permissions
    async function requestPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();
      console.log("Notification Permission Status:", status);
      if (status !== "granted") {
        alert("Permission to receive notifications was denied");
      }
    }
    requestPermissions();

    // Notification handler for foreground notifications
    Notifications.setNotificationHandler({
      handleNotification: async (notification) => {
        console.log("Foreground notification received:", notification);
        return {
          shouldShowAlert: true, // Shows the notification alert
          shouldPlaySound: true, // Plays sound when notification is triggered
          shouldSetBadge: false, // No badge count
        };
      },
    });

    // Handle notifications received in the foreground
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notification received in foreground:", notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification response received:", response);
      const screen = response.notification.request.content.data.screen;
      if (screen) {
        console.log(' navigating to:', screen);
        navigationRef.current?.navigate(screen);
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);


  const triggerNotification = async (notificationData) => {
    console.log("Triggering notification with data:", notificationData);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: notificationData.title || "Default Title",
        body: notificationData.body || "Default Body",
      },
      trigger: null,  // Trigger immediately
    });
  };

  const screenOptions = {
    headerTitleStyle: {
      color: "#00B251",
    },
    headerTintColor: "#00B251",
    headerTitleAlign: "center",
  };

  return (
    <NavigationContainer ref={navigationRef}>
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
              name="Featured Product"
              component={FeaturedProductScreen}
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
              name="Edit Password"
              component={EditPasswordOTPScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Change Password"
              component={ChangePasswordScreen}
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
              name="Shop Phones OTP"
              component={ShopPhonesOTPScreen}
              options={{ ...screenOptions, headerShown: false }}
            />
            <Stack.Screen
              name="Shop OTP"
              component={ShopOTPScreen}
              options={{ ...screenOptions, headerShown: false }}
            />
            <Stack.Screen
              name="Edit Shop Phone"
              component={EditShopPhoneScreen}
              options={{ ...screenOptions }}
            />
            <Stack.Screen
              name="Edit Alternative Shop Phone"
              component={EditSecondaryShopPhoneScreen}
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
              name="Market Subcategory"
              component={MarketCategoryListScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Market Variety"
              component={MarketVarietyListScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Product List"
              component={MarketCategoryScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Market Category"
              component={CropsScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Filter Products"
              component={FilterProductsScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Compare Shops"
              component={CompareShopsScreen}
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
              name="Bidding Details"
              component={BiddingDetailsScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Bidding View All"
              component={BiddingViewAllScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Shop Bidding Details"
              component={BiddingDetailsFarmersScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Add Bid"
              component={AddBidScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Edit Bid"
              component={EditBidScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Farmers Product Details"
              component={FarmersProductDetailScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Farmers Orders Details"
              component={FarmersOrderDetailsScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Order Details"
              component={OrderDetailsScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Buyer Negotiation"
              component={NegotiationBuyerScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Buyer Negotiation List"
              component={NegotiationBuyerListScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Seller Negotiation"
              component={NegotiationSellerScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Seller Negotiation List"
              component={NegotiationSellerListScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Buyer Edit Negotiation"
              component={NegotiationBuyerEditScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Analytics"
              component={AnalyticScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Add Location"
              component={AddLocation}
              options={screenOptions}
            />
            <Stack.Screen
              name="Orders"
              component={OrdersScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Place a Bid"
              component={PlaceABid}
              options={screenOptions}
            />
            <Stack.Screen
              name="My Bids"
              component={MyBidScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Past Bids"
              component={PastBidScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Won Bids"
              component={WonBidScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Completed Bids"
              component={CompletedBidScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Add Another Bid"
              component={AddAnotherBid}
              options={screenOptions}
            />
            <Stack.Screen
              name="Edit Phone Number"
              component={EditPhoneNumberScreen}
              options={{ ...screenOptions }}
            />
            <Stack.Screen
              name="Edit Shop Phone Information"
              component={EditShopPhoneInformationScreen}
              options={{ ...screenOptions }}
            />
            <Stack.Screen
              name="Edit Shop Alternative Phone Information"
              component={EditShopAlternativePhoneInformationScreen}
              options={{ ...screenOptions }}
            />
            <Stack.Screen
              name="Edit Alternative Phone Number"
              component={EditSecondaryPhoneNumberScreen}
              options={{ ...screenOptions }}
            />
            <Stack.Screen
              name="Navigator"
              options={{ ...screenOptions, headerShown: false }}
            >
              {({ navigation }) => (
                <Navigator
                  fetchUserSession={(nav) => fetchUserSession(nav)}
                  navigation={navigation}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="View Shop Details"
              component={ViewShopDetailsScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Add Product"
              component={AddProductScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Add Crop Category"
              component={AddCropCategoryScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Add Crop Sub Category"
              component={AddCropSubCategoryScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Add Crop Variety"
              component={AddCropVarietyScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Seller FAQ"
              component={SellerFaq}
              options={screenOptions}
            />
            <Stack.Screen
              name="Chat Support"
              component={ChatSupportScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Edit Shop"
              component={EditShopScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="Customer FAQ"
              component={CustomerFaq}
              options={screenOptions}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              options={{ ...screenOptions, headerShown: false }}
            >
              {({ navigation }) => (
                <LoginScreen
                  fetchUserSession={fetchUserSession}
                  navigation={navigation}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="Navigator"
              options={{ ...screenOptions, headerShown: false }}
            >
              {({ navigation }) => (
                <Navigator
                  fetchUserSession={(nav) => fetchUserSession(nav)}
                  navigation={navigation}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="Register"
              component={RegisterScreenBuyers}
              options={{ ...screenOptions }}
            />
            <Stack.Screen
              name="OTP Screen"
              component={OTPScreen}
              options={{ ...screenOptions, headerShown: false }}
            />
            <Stack.Screen
              name="OTP Only Phone"
              component={OTPOnlyPhoneScreen}
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
              name="Lost Phone Number"
              component={LostPhoneNumberScreen}
              options={{ ...screenOptions, headerShown: false }}
            />
            <Stack.Screen
              name="Lost Phone Number OTP"
              component={LostPhoneNumberOTPScreen}
              options={{ ...screenOptions, headerShown: false }}
            />
            <Stack.Screen
              name="New Phone Number"
              component={NewPhoneNumberScreen}
              options={{ ...screenOptions, headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
