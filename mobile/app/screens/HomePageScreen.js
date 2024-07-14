import React from "react";
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from "react-native";
import SearchBarC from "../components/SearchBarC";
import logo from "../assets/logo.png";
import HomeCard from "../components/HomeCard";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

const products = [
  {
    id: 1,
    title: "kamote",
    price: 5.0,
    image: logo,
    rating: 4.8,
    description: "Kamote Masarap",
    discount: 10,
    address: "Baguio",
  },
  {
    id: 2,
    title: "Patatas",
    price: 10,
    image: logo,
    rating: 5.0,
    description: "Patatas Masarap",
    discount: 5,
    address: "Trinidad",
  },
  {
    id: 3,
    title: "Patatas",
    price: 10,
    image: logo,
    rating: 5.0,
    description: "Patatas Masarap",
    discount: 5,
    address: "Trinidad",
  },
  {
    id: 4,
    title: "Patatas",
    price: 10,
    image: logo,
    rating: 5.0,
    description: "Patatas Masarap",
    discount: 5,
    address: "Trinidad",
  },

];

function HomePageScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Hi Paeng!</Text>
        <View style={styles.headerIcons}>
          <Icon
            name="notifications-outline"
            type="ionicon"
            size={30}
            color="green"
            onPress={() => navigation.navigate("Notifications")}
            style={styles.icon}
          />
          <Icon
            name="mail-outline"
            type="ionicon"
            size={30}
            color="green"
            onPress={() => navigation.navigate("Messages")}
            style={styles.icon}
          />
        </View>
      </View>
      <Text style={styles.subText}>Enjoy our services!</Text>
      <View style={styles.searchContainer}>
        <SearchBarC />
      </View>
      <View style={styles.freeConsultation}>
        <View style={styles.consultationText}>
          <Text style={styles.consultationTitle}>AgriTutorial</Text>
          <Text>Want to know how AgriTayo Works? </Text>
          <TouchableOpacity style={styles.callNowButton}>
            <Text style={styles.callNowText}>Click Here</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.featuredProducts}>
        <View style={styles.featuredHeader}>
          <Text style={styles.featuredTitle}>Featured Products</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.productContainer}>
          {products.map((product) => (
            <HomeCard key={product.id} product={product} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "green",
  },
  headerIcons: {
    flexDirection: "row",
  },
  icon: {
    marginLeft: 10,
  },
  subText: {
    paddingHorizontal: 20,
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },
  searchContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  freeConsultation: {
    backgroundColor: "#c4f6c2",
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    marginHorizontal: 20,
  },
  consultationText: {
    marginLeft: 20,
  },
  consultationTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  callNowButton: {
    backgroundColor: "#47a83e",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: 100,
    alignItems: "center",
  },
  callNowText: {
    color: "#fff",
    fontWeight: "bold",
  },
  featuredProducts: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  featuredHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  seeAllText: {
    color: "#0c99c7",
  },
  productContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

export default HomePageScreen;
