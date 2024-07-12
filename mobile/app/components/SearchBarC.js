import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { SearchBar, Icon } from "react-native-elements";

const SearchBarC = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");

  return (
    <View style={styles.container}>
      <SearchBar placeholder="Search" onChangeText={setSearch} value={search} />
      <Icon
        onPress={() => navigation.navigate("Messages")}
        name="mail-outline"
        type="ionicon"
        size={45}
      />
      <Icon
        onPress={() => navigation.navigate("Notifications")}
        name="notifications-outline"
        type="ionicon"
        size={45}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},

  cartButton: {},

  messageButton: {},
});

export default SearchBarC;
