import React from "react";
import { ScrollView } from "react-native";
import NotificationTable from "../components/NotificationTable";

function ReadScreen({ notifications }) {
  return (
    <ScrollView>
      {notifications.map((notification) => (
        <NotificationTable 
          key={notification.id} 
          notification={notification} 
          showButton={false}
        />
      ))}
    </ScrollView>
  );
}

export default ReadScreen;
