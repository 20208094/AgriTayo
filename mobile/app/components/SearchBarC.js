import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { SearchBar, Icon } from "react-native-elements";
import { styled } from "nativewind";

const SearchBarC = () => {
  const [search, setSearch] = useState("");

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search"
        onChangeText={setSearch}
        value={search}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.input}
      />
      <Icon
        name="filter-outline"
        type="ionicon"
        size={30}
        color="green"
        containerStyle={styles.iconContainer}
      />
    </View>
  );
};

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
  },
  searchContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    padding: 0, // Adjust padding as needed
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
  },
  input: {
    color: 'black',
  },
  iconContainer: {
    marginLeft: 10,
  },
});

export default SearchBarC;
