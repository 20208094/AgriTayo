import React from "react";
import { ScrollView} from "react-native";
import SearchBarC from "../components/SearchBarC";
import logo from "../assets/logo.png";
import HomeCard from "../components/HomeCard";

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
    title: "patatas",
    price: 10,
    image: logo,
    rating: 5.0,
    description: "Patatas Masarap",
    discount: 5,
    address: "Trinidad",
  },
];

function HomePageScreen() {
  return (
    <>
      <SearchBarC />
      <ScrollView className=''>
        {products.map((product) => (
          <HomeCard key={product.id} product={product} />
        ))}
      </ScrollView>
    </>
  );
}

export default HomePageScreen;
