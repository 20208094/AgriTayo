import React from "react";
import { Text, TouchableOpacity, Image, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const HomeCard = ({ product }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("Product Details", { product });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={product.image} style={styles.image} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>₱ {product.price}</Text>
        <Text style={styles.rating}>⭐ {product.rating}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    margin: 10,
    width: "44%", // Adjust width for responsiveness
    marginBottom: 20,
  },
  imageContainer: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  content: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  price: {
    color: "green",
    marginBottom: 5,
  },
  rating: {
    color: "gray",
    marginBottom: 5,
  },
});

export default HomeCard;
