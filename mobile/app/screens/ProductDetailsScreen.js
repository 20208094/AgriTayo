import React, { useState } from "react";
import { View, Image, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";

function ProductDetailsScreen({ navigation, route }) {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  return (
    <ScrollView style={styles.container}>
      <Image source={product.image} style={styles.image} />
      <View style={styles.productInfo}>
        <View style={styles.productHeader}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>₱ {product.price}</Text>
        </View>
        <Text style={styles.stock}>Available in stock</Text>
        <View style={styles.ratingQuantityContainer}>
          <Text style={styles.rating}>⭐ {product.rating} (192)</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity style={styles.quantityButton} onPress={decreaseQuantity}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity} pcs</Text>
            <TouchableOpacity style={styles.quantityButton} onPress={increaseQuantity}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.relatedTitle}>Description</Text>
        <Text style={styles.description}>{product.description}</Text>
      
      <View style={styles.relatedProducts}>
        <Text style={styles.relatedTitle}>Related Products</Text>
        {/* Add related product items here */}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.placeholderContainer}>
        {/* Replace with dynamic image items */}
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Your Image Here</Text>
        </View>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Your Image Here</Text>
        </View>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Your Image Here</Text>
        </View>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Your Image Here</Text>
        </View>
        {/* Add more placeholder items as needed */}
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Cart")}>
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  productInfo: {
    paddingHorizontal: 10,
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  price: {
    fontSize: 20,
    color: "green",
    fontWeight: "bold",
  },
  stock: {
    fontSize: 16,
    color: "green",
    marginBottom: 10,
    fontWeight: "bold",
  },
  ratingQuantityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  rating: {
    fontSize: 16,
    color: "gray",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  relatedProducts: {
    marginBottom: 20,
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  placeholderContainer: {
    marginBottom: 20,
  },
  placeholder: {
    height: 200,
    width: 200,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginRight: 10,
  },
  placeholderText: {
    color: "#aaa",
    fontSize: 18,
  },
  button: {
    backgroundColor: "#47a83e",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ProductDetailsScreen;
