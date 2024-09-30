import React, { useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ReadScreen from "../Message/ReadScreen";
import UnreadScreen from "../Message/UnreadScreen";
import Icon from "react-native-vector-icons/FontAwesome";

const initialNotifications = [
  {
    id: 1,
    title: "notification 1",
    message: "this is a message",
  },
  {
    id: 2,
    title: "notification2",
    message: "this is a message",
  },
];

function NotificationScreen() {
  const Tab = createMaterialTopTabNavigator();

  const [unreadNotifications, setUnreadNotifications] =
    useState(initialNotifications);
  const [readNotifications, setReadNotifications] = useState([]);

  const moveToRead = (notificationId) => {
    const notification = unreadNotifications.find(
      (n) => n.id === notificationId
    );
    setUnreadNotifications(
      unreadNotifications.filter((n) => n.id !== notificationId)
    );
    setReadNotifications([...readNotifications, notification]);
  };

  return (
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
        }
      })}
    >
      <Tab.Screen name="Unread">
        {(props) => (
          <UnreadScreen
            {...props}
            notifications={unreadNotifications}
            moveToRead={moveToRead}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Read">
        {(props) => <ReadScreen {...props} notifications={readNotifications} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default NotificationScreen;
