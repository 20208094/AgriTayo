import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { Icon } from "react-native-elements";
import { styled } from "nativewind";
import { NotificationIcon, MessagesIcon, MarketIcon } from "../../../components/SearchBarC";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from '@env';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

function AddressScreen({ route }) {
  const { profile } = route.params;
  const navigation = useNavigation();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [addresses, setAddresses] = useState([]);

  // Fetch user data from AsyncStorage
  const getAsyncUserData = useCallback(async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const user = Array.isArray(parsedData) ? parsedData[0] : parsedData;
        setUserData(user); // Set user data
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  }, []);

  // Fetch addresses from API
  const fetchAddresses = useCallback(async () => {
    if (!userData) return; // Ensure userData is available

    try {
      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/addresses`, {
        headers: {
          'x-api-key': REACT_NATIVE_API_KEY,
        },
      });

      if (response.ok) {
        const data = await response.json();

        // Filter data by user ID and add `logo` based on the `label`
        const filteredData = data
          .filter(d => d.user_id === userData.user_id)
          .map(data => {
            let logo;
            switch (data.label) {
              case "Partner":
                logo = "heart";
                break;
              case "Office":
              case "Work":
                logo = "briefcase";
                break;
              case "Home":
                logo = "home";
                break;
              default:
                logo = "map-marker";
                break;
            }
            return { ...data, logo };
          });
        setAddresses(filteredData);
      } else {
        console.error('Failed to fetch addresses');
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false); // Set loading to false once done
    }
  }, [userData]);

  // Combined data fetching logic in useFocusEffect
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true); // Show loading while fetching data
        await getAsyncUserData();
      };
      fetchData();
    }, [getAsyncUserData])
  );

  // Fetch addresses once userData is available
  useEffect(() => {
    if (userData) {
      fetchAddresses(); // Fetch addresses once userData is ready
    }
  }, [userData, fetchAddresses]);

  // Fetch current location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    })();
  }, []);

  // Setup navigation options
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", marginRight: 15 }}>
          <MarketIcon onPress={() => navigation.navigate("CartScreen")} />
          <NotificationIcon onPress={() => navigation.navigate("Notifications")} />
          <MessagesIcon onPress={() => navigation.navigate("ChatListScreen")} />
        </View>
      ),
    });
  }, [navigation]);

  if (loading) {
    return <Text>Loading...</Text>; // Show a loading spinner or message
  }

  const renderItem = ({ item }) => (
    <View className="flex-row justify-between items-center bg-white rounded-lg shadow p-4 mb-4">
      <View className="flex-1 flex-row items-center">
        <Icon name={item.logo} type="font-awesome" size={24} color="#00B251" />
        <View className="ml-4 flex-1">
          <Text className="text-lg font-semibold text-black">{item.label}</Text>
          <Text className="text-gray-600">{item.house_number} {item.street_name}, {item.barangay}, {item.city}</Text>
          <Text className="text-gray-600 mt-1">Note to rider: {item.note}</Text>
        </View>
      </View>
      <View className="flex-row space-x-4">
        <TouchableOpacity
          onPress={() => navigation.navigate("Edit Address", { address: item })}
        >
          <Icon name="edit" type="font-awesome" size={20} color="#00B251" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Delete address")}>
          <Icon name="trash" type="font-awesome" size={20} color="#00B251" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-0">
      <View className="px-4 mt-0 flex-row justify-between items-center">
        <View className="flex-1"></View>
      </View>

      <FlatList
        data={addresses}
        renderItem={renderItem}
        keyExtractor={(item) => item.address_id}
        contentContainerStyle={{ padding: 16 }}
      />

      <View className="px-4 py-4">
        <TouchableOpacity
          className="bg-green-600 rounded-full py-4 items-center"
          onPress={() =>
            navigation.navigate("Add Address", { currentLocation })
          }
        >
          <Text className="text-white text-lg font-semibold">
            Add New Address
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default styled(AddressScreen);
