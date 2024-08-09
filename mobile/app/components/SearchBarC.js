import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { SearchBar, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { styled } from "nativewind";

// SearchBarC component with optional Search Bar
const SearchBarC = ({ showSearchBar = true }) => {
  const [search, setSearch] = useState("");
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      {showSearchBar && (
        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Search"
            onChangeText={setSearch}
            value={search}
            containerStyle={styles.searchInnerContainer}
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.input}
          />
          <Icon
            name="filter-outline"
            type="ionicon"
            size={30}
            color="green"
            containerStyle={styles.filterIconContainer}
          />
        </View>
      )}
    </View>
  );
};

// Separate components for icons
const NotificationIcon = ({ onPress }) => (
  <Icon
    name="notifications-outline"
    type="ionicon"
    size={30}
    color="green"
    onPress={onPress}
    containerStyle={styles.iconContainer}
  />
);

const MessagesIcon = ({ onPress }) => (
  <Icon
    name="mail-outline"
    type="ionicon"
    size={30}
    color="green"
    onPress={onPress}
    containerStyle={styles.iconContainer}
  />
);

// Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: 'white',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    justifyContent: 'space-between', // Space between search bar and icons
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  searchInnerContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    padding: 0,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
  },
  input: {
    color: 'black',
  },
  filterIconContainer: {
    marginLeft: 10,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginLeft: 10,
  },
});

const MarketIcon = ({ onPress }) => (
  <Icon
    name="cart-outline"
    type="ionicon"
    size={30}
    color="green"
    onPress={onPress}
    containerStyle={styles.iconContainer}
  />
);

export { NotificationIcon, MessagesIcon, MarketIcon };
export default SearchBarC;
