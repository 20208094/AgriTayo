// Navigator.js
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from '@env';
import LoginScreen from "../screens/Authentication/LoginScreen";
import NavigationBar from "../components/NavigationBar"; // Import your NavigationBar
import HomePageScreen from "../screens/Home/HomePageScreen";

const Navigator = ({ fetchUserSession, navigation }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      const user = await fetchUserSession();
      if (user) {
        navigation.reset({
            index: 0,
            routes: [{ name: 'HomePageScreen' }],
          });
      } else {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
      }
      setLoading(false);
    };

    checkUserSession();
  }, [fetchUserSession, navigation]);

  if (loading) {
    return (
      <View>
      </View>
    ); 
  }

  return null;
};

export default Navigator;
