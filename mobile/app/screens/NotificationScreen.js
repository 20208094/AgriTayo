import React, { useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ReadScreen from "./ReadScreen";
import UnreadScreen from "./UnreadScreen";

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

  const [unreadNotifications, setUnreadNotifications] = useState(initialNotifications);
  const [readNotifications, setReadNotifications] = useState([]);

  const moveToRead = (notificationId) => {
    const notification = unreadNotifications.find(n => n.id === notificationId);
    setUnreadNotifications(unreadNotifications.filter(n => n.id !== notificationId));
    setReadNotifications([...readNotifications, notification]);
  };

  return (
    <Tab.Navigator>
      <Tab.Screen name='Unread'>
        {(props) => (
          <UnreadScreen 
            {...props} 
            notifications={unreadNotifications} 
            moveToRead={moveToRead} 
          />
        )}
      </Tab.Screen>
      <Tab.Screen name='Read'>
        {(props) => (
          <ReadScreen 
            {...props} 
            notifications={readNotifications} 
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default NotificationScreen;
