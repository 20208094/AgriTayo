import React from "react";
import { View, Image, Text, StyleSheet, Button } from "react-native";

function ProductDetailsScreen({ navigation, route }) {
  const { product } = route.params;

  return (
    <View className=''>
      <Image source={product.image} className='' />
      <Text className=''>{product.title}</Text>
      <Text className=''>
        Description:{"\n"}
        {product.description}
      </Text>
      <Text className=''>
        Product Rating: {"\n"}⭐ {product.rating} Rating
      </Text>
      <Text className=''>
        Price: {"\n"}
        {product.price} {product.discount} % off
      </Text>
      <Text className=''>
        Seller: {"\n"}
        {product.address}
      </Text>
      <Button title="Message Seller" onPress={() => navigation.navigate("")} />
      <Button title="Add to Cart" onPress={() => navigation.navigate("")} />
    </View>
  );
}

export default ProductDetailsScreen;
