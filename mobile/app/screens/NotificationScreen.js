import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import NotificationTable from "../components/NotificationTable";

const notifications = [
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
  return (
    <ScrollView className=''>
      {notifications.map((notification) => (
        <NotificationTable key={notification.id} notification={notification} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default NotificationScreen;
