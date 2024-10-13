import React from "react";
import { ScrollView } from "react-native";
import NotificationTable from "../../components/NotificationTable";

function ReadScreen({ notifications }) { // Accept moveToUnread
  return (
    <ScrollView>
      {notifications.map((notification) => (
        <NotificationTable
          key={notification.notification_id} 
          notification={notification}
          showButton={false}
        />
      ))}

    </ScrollView>
  );
}

export default ReadScreen;
