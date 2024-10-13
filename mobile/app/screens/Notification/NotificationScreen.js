import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, TouchableOpacity, Modal, TextInput } from "react-native"; 
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ReadScreen from "../Message/ReadScreen";
import UnreadScreen from "../Message/UnreadScreen";
import Icon from "react-native-vector-icons/FontAwesome";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from '@env';  
import { styled } from 'nativewind';

const Tab = createMaterialTopTabNavigator();

function NotificationScreen() {
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredUnreadNotifications, setFilteredUnreadNotifications] = useState([]);
  const [filteredReadNotifications, setFilteredReadNotifications] = useState([]);

  // Fetch notifications when the component mounts
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/notifications`, {
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        
        // Split notifications into read and unread
        const unread = data.filter((notif) => !notif.is_read);
        const read = data.filter((notif) => notif.is_read);

        setUnreadNotifications(unread);
        setReadNotifications(read);
        setFilteredUnreadNotifications(unread);
        setFilteredReadNotifications(read);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // Update filtered notifications based on search input
  useEffect(() => {
    const handleSearch = () => {
      const lowerSearchText = searchText.toLowerCase();

      setFilteredUnreadNotifications(
        unreadNotifications.filter((notif) => 
          (notif.title && notif.title.toLowerCase().includes(lowerSearchText)) || 
          (notif.message && notif.message.toLowerCase().includes(lowerSearchText))
        )
      );

      setFilteredReadNotifications(
        readNotifications.filter((notif) => 
          (notif.title && notif.title.toLowerCase().includes(lowerSearchText)) || 
          (notif.message && notif.message.toLowerCase().includes(lowerSearchText))
        )
      );
    };

    handleSearch();
  }, [searchText, unreadNotifications, readNotifications]);

  // Mark single notification as read
  const moveToRead = async (notificationId) => {
    try {
      await fetch(`${REACT_NATIVE_API_BASE_URL}/api/notifications/${notificationId}`, {
        method: "PUT",
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });

      const notification = unreadNotifications.find((n) => n.notification_id === notificationId);
      setUnreadNotifications(unreadNotifications.filter((n) => n.notification_id !== notificationId));
      setReadNotifications([...readNotifications, { ...notification, is_read: true }]);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all unread notifications as read
  const markAllAsRead = async () => {
    try {
      const notificationIds = unreadNotifications.map((n) => n.notification_id);
      if (notificationIds.length === 0) {
        setAlertVisible(true);
        return;
      }

      await Promise.all(
        notificationIds.map((notificationId) =>
          fetch(`${REACT_NATIVE_API_BASE_URL}/api/notifications/${notificationId}`, {
            method: "PUT",
            headers: {
              "x-api-key": REACT_NATIVE_API_KEY,
            },
          })
        )
      );

      const updatedReadNotifications = unreadNotifications.map((n) => ({
        ...n,
        is_read: true,
      }));
      setReadNotifications([...readNotifications, ...updatedReadNotifications]);
      setUnreadNotifications([]);

      setAlertVisible(true);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return (
    <View className="flex-1">
      {/* Custom Alert Modal */}
      <Modal
        visible={alertVisible}
        transparent={true}
        animationType="fade"
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-4/5 p-5 rounded-lg shadow-lg">
            <Text className="text-lg font-bold text-green-600 mb-3">Notifications Updated</Text>
            <Text className="text-gray-700 mb-5">All notifications have been marked as read.</Text>
            <TouchableOpacity
              className="bg-green-500 p-3 rounded-lg items-center"
              onPress={() => setAlertVisible(false)}
            >
              <Text className="text-white font-bold">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Search Bar */}
      <View className="p-4 bg-white">
        <TextInput
          className="border border-gray-300 p-2 rounded-lg"
          placeholder="Search notifications..."
          onChangeText={setSearchText}
          value={searchText}
        />
      </View>

      {/* Tab Navigator */}
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => {
            let iconName;
            if (route.name === "Unread") {
              iconName = "envelope";
            } else if (route.name === "Read") {
              iconName = "envelope-open";
            }
            return <Icon name={iconName} size={20} color={color} />;
          },
          tabBarActiveTintColor: "#00B215",
          tabBarInactiveTintColor: "gray",
          tabBarIndicatorStyle: {
            backgroundColor: "#00B251",
          },
        })}
      >
        <Tab.Screen name="Unread">
          {(props) => (
            <View className="flex-1">
              {/* Mark All as Read Button */}
              <TouchableOpacity
                className="bg-[#00B251] p-3 m-3 rounded-lg items-center"
                onPress={markAllAsRead}
              >
                <Text className="text-white text-base font-bold">Mark All as Read</Text>
              </TouchableOpacity>
              <UnreadScreen
                {...props}
                notifications={filteredUnreadNotifications} // Use filtered notifications
                moveToRead={moveToRead}
              />
            </View>
          )}
        </Tab.Screen>
        <Tab.Screen name="Read">
          {(props) => (
            <ReadScreen
              {...props}
              notifications={filteredReadNotifications} // Use filtered notifications
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
}

export default styled(NotificationScreen);
