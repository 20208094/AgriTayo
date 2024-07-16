import React from "react";
import { View, Text } from "react-native";

function NotificationDetailsScreen({ route }) {
  const { notification } = route.params;

  return (
    <View>
      <Text>Title: {notification.title}</Text>
      <Text>Message: {notification.message}</Text>
    </View>
  );
}

export default NotificationDetailsScreen;
