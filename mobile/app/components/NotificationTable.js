import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const NotificationTable = ({ notification }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Notification Details", { notification })
      }
    >
      <View style={styles.tableContainer}>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>
            {notification.title}
            {"\n"}
            {notification.message}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderColor: "#000",
  },

  tableCell: {
    flex: 1,
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: "#000",
  },
});

export default NotificationTable;
