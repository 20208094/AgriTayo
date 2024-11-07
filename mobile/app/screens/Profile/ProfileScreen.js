import React, { useState, useEffect } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "react-native-elements";
import { FontAwesome5 } from '@expo/vector-icons';
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import LogoutModal from "../Authentication/LogoutModal";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from '@env';
import { styled } from "nativewind";
import LoadingAnimation from "../../components/LoadingAnimation";

function ProfileScreen({ fetchUserSession }) {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [shopData, setShopData] = useState(null);
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState(null);
  const [senderId, setSenderId] = useState(null);

  const getAsyncUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData)) {
          const user = parsedData[0];
          setUserData(user);
          setUserId(user.user_id);
          setSenderId(user.user_id);
        } else {
          setUserData(parsedData);
          setUserId(parsedData.user_id);
          setSenderId(parsedData.user_id);
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const getAsyncShopData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('shopData');

      if (storedData) {
        const parsedData = JSON.parse(storedData); // Parse storedData

        if (Array.isArray(parsedData)) {
          const shop = parsedData[0];  // Assuming shop data is the first element of the array
          setShopData(shop); // Set shopData state to the shop object
        } else {
          setShopData(parsedData); // If it's not an array, directly set parsed data
        }
      }
    } catch (error) {
      console.error('Failed to load shop data:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/orders`, {
        headers: {
          'x-api-key': REACT_NATIVE_API_KEY,
        },
      });
      if (response.ok) {
        const allOrds = await response.json();
        setOrders(allOrds);
      } else {
        console.error('Failed to fetch orders:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchOrderStatus = async () => {
    try {
      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/order_statuses`, {
        headers: {
          'x-api-key': REACT_NATIVE_API_KEY,
        },
      });
      if (response.ok) {
        const allOrdStat = await response.json();
        const updatedStatuses = allOrdStat.map(status => {
          const totalOrders = orders.filter(order => order.status_id === status.order_status_id && order.user_id === userData.user_id).length;
          return { ...status, totalOrders };
        });
        setOrderStatuses(updatedStatuses);
      } else {
        console.error('Failed to fetch order statuses:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching order statuses:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          await getAsyncUserData();
          await getAsyncShopData();
          await fetchOrders();
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [])
  );

  useEffect(() => {
    if (orders.length > 0) {
      fetchOrderStatus();
    }
  }, [orders, userData]);

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
      <ScrollView className="flex-1 bg-gray-100">
        <View className="bg-green-200 py-3 rounded-b-lg">
          <View className="flex-row items-center px-4">
            <View className="relative mr-4">
              <Image source={{ uri: userData.user_image_url }} className="w-24 h-24 rounded-full" />
              <View className="absolute bottom-0 right-0 bg-green-600 rounded-full">
              </View>
            </View>
            <View>
              <Text className="text-2xl font-bold mt-4 text-black">
                {userData.firstname} {userData.lastname}
              </Text>
              <Text className="text-black">{userData.phone}</Text>
            </View>
          </View>
        </View>

        {/* Other content */}
        <View className="mt-2 px-4 ">
          <View className="bg-white rounded-lg shadow p-4 space-y-6 ">
            <View className="flex-row items-center justify-between ">
              <Text className="text-lg font-semibold text-gray-800">My Purchases</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Orders", { screen: "Completed" })}>
                <Text className="text-green-600">View Purchase History</Text>
              </TouchableOpacity>
            </View>

            {/* Render in rows of 3 items */}
            <View>
              {orderStatuses.map((status, index) => {
                // If it's the start of a new row (every 3rd item), we create a new View for the row
                if (index % 3 === 0) {
                  return (
                    <View key={index} className="flex-row justify-around mb-3">
                      {/* Render up to 3 items within the row */}
                      {orderStatuses.slice(index, index + 3).map((status) => (
                        <TouchableOpacity
                          key={status.order_status_id}
                          className="items-center w-1/3"
                          onPress={() => navigation.navigate("Orders", { screen: status.order_status_name })}
                        >
                          <Text className="text-lg font-bold">{status.totalOrders}</Text>
                          <Text className="text-gray-500">{status.order_status_name}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  );
                }
                return null; // Return null for other items to avoid rendering them outside the row
              })}
            </View>
          </View>
        </View>

        <View className="px-4 mt-2">
          <View className="bg-white rounded-lg shadow p-4 space-y-4">
            <TouchableOpacity className="flex-row items-center justify-between" onPress={() => navigation.navigate("View Profile", { userData })}>
              <View className="flex-row items-center">
                <Icon name="user" type="font-awesome" size={20} color="#00B251"/>
                <Text className="text-gray-800 font-semibold ml-4"> View Profile</Text>
              </View>
              <Icon name="chevron-right" type="font-awesome" size={20} color="gray" />
            </TouchableOpacity>
            {/* <TouchableOpacity className="flex-row items-center justify-between" onPress={() => navigation.navigate("Address", { userData })}>
              <View className="flex-row items-center">
                <Icon name="address-book" type="font-awesome" size={20} color="#00B251" />
                <Text className="text-gray-800 font-semibold ml-4">My Addresses</Text>
              </View>
              <Icon name="chevron-right" type="font-awesome" size={20} color="gray" />
            </TouchableOpacity> */}
            <TouchableOpacity className="flex-row items-center justify-between" onPress={() => navigation.navigate("Buyer Negotiation List", { userData })}>
              <View className="flex-row items-center">
              <FontAwesome5 name="handshake" size={14} color="#00B251" />
                <Text className="text-gray-800 font-semibold ml-4">My Negotiations</Text>
              </View>
              <Icon name="chevron-right" type="font-awesome" size={20} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center justify-between" onPress={() => navigation.navigate("My Bids", { userData })}>
              <View className="flex-row items-center">
              <FontAwesome5 name="comment-dollar"  size={20} color="#00B251" />
                <Text className="text-gray-800 font-semibold ml-4">My Bids</Text>
              </View>
              <Icon name="chevron-right" type="font-awesome" size={20} color="gray" />
            </TouchableOpacity>
            {!shopData ? (
              <TouchableOpacity className="flex-row items-center justify-between" onPress={() => navigation.navigate("Welcome To Agritayo!", { userData })}>
                <View className="flex-row items-center">
                  <Icon name="plus" type="font-awesome" size={20} color="#00B251" />
                  <Text className="text-gray-800 font-semibold ml-4">Start Selling</Text>
                </View>
                <Icon name="chevron-right" type="font-awesome" size={20} color="gray" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity className="flex-row items-center justify-between" onPress={() => navigation.navigate("My Shop")}>
                <View className="flex-row items-center">
                  <Icon name="store" type="material" size={20} color="#00B251" />
                  <Text className="text-gray-800 font-semibold ml-4">My Shop</Text>
                </View>
                <Icon name="chevron-right" type="font-awesome" size={20} color="gray" />
              </TouchableOpacity>
            )}
            <TouchableOpacity className="flex-row items-center justify-between" onPress={() => navigation.navigate("Customer FAQ")}>
              <View className="flex-row items-center">
                <Icon name="address-book" type="font-awesome" size={20} color="#00B251" />
                <Text className="text-gray-800 font-semibold ml-4">Customer FAQ</Text>
              </View>
              <Icon name="chevron-right" type="font-awesome" size={20} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center justify-between"
              onPress={() => navigation.navigate('ChatScreen', {
                senderId: userId,
                receiverId: 1,     // admin ID
                receiverName: "Admin",
                receiverType: "User",
                senderType: "User",
                receiverImage: "user_image_url", // Placeholder for admin's image, replace with actual URL if needed
              })}
            >
              <View className="flex-row items-center">
                <Icon name="comments" type="font-awesome" size={20} color="#00B251" />
                <Text className="text-gray-800 font-semibold ml-4">Chat Support</Text>
              </View>
              <Icon name="chevron-right" type="font-awesome" size={20} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center justify-between" onPress={() => setModalVisible(true)}>
              <View className="flex-row items-center">
                <Icon name="log-out" type="ionicon" size={20} color="#00B251" />
                <Text className="text-gray-800 font-semibold ml-4">Log out</Text>
              </View>
              <Icon name="chevron-right" type="font-awesome" size={20} color="gray" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Modal */}
        <LogoutModal
          isVisible={isModalVisible}
          onCancel={() => setModalVisible(false)}
          fetchUserSession={fetchUserSession}
          navigation={navigation}
        />
      </ScrollView>
  );
}

export default styled(ProfileScreen);
