import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const MessageTable = ({ message }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Message Details", { message })}
    >
      <View style={styles.tableContainer}>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>
            {message.title}
            {"\n"}
            {message.messages}
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

export default MessageTable;
