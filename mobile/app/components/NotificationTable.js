import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styled } from "nativewind";
import { Icon } from "react-native-elements";

const NotificationTable = ({ notification, moveToRead, showButton }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Notification Details", { notification })
      }
      className="bg-white p-4 m-1 rounded-lg shadow-md"
    >
      <View className="flex-row justify-between items-center">
        <Text className="flex-1 text-base">
          <Text className="font-bold text-[#00B251]">{notification.title}</Text>
          {"\n"}
          <Text className="font-bold text-gray-500">{notification.message}</Text>
        </Text>
        {showButton && (
          <TouchableOpacity
            onPress={() => moveToRead(notification.notification_id)} // Ensure correct ID reference
            className="ml-4"
          >
            <Icon name="checkmark" type="ionicon" size={20} color="#00B251" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default styled(NotificationTable);
