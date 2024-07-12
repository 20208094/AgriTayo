import React from "react";
import { Text, TouchableOpacity} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Card } from "react-native-elements";

const HomeCard = ({ product }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Product Details", { product })}
    >
      <Card className=''>
        <Card.Image source={product.image} className='' />
        <Card.Title className=''>{product.title}</Card.Title>
        <Card.Divider />
        <Text className=''>{product.price}</Text>
        <Text className=''>⭐ {product.rating}</Text>
        <Text className=''>See Details</Text>
      </Card>
    </TouchableOpacity>
  );
};

export default HomeCard;
