import React from "react";
import { ScrollView } from "react-native";
import NotificationTable from "../../components/NotificationTable";

function UnreadScreen({ notifications, moveToRead }) {
  return (
    <ScrollView>
      {notifications.map((notification) => (
        <NotificationTable
          key={notification.id}
          notification={notification}
          moveToRead={moveToRead}
          showButton={true}
        />
      ))}
    </ScrollView>
  );
}

export default UnreadScreen;
