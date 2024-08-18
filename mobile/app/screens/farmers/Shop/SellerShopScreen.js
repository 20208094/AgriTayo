import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import michael from "../../../assets/ehh.png";

function SellerShopScreen({ route, navigation }) {
  const { product } = route.params;
  const primaryColor = "#00B251";
  const [selectedTab, setSelectedTab] = useState("");
  const [selectedProductTab, setSelectedProductTab] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null)
  return (
    <SafeAreaView className="">
      <View className="">
        <Image source={michael} className="w-24 h-24 rounded-full" />
        <Text className="">{product.seller.shopName}</Text>
        <Text className="">
          {product.rating} | {product.seller.followers} followers
        </Text>
        <TouchableOpacity className="" onPress={() => navigation.navigate("Message Seller", {product})}>
          <Text className="">Negotiate</Text>
        </TouchableOpacity>
        <TouchableOpacity className="" onPress={() => navigation.navigate("Negotiate To Seller", {product})}>
          <Text className="">Chat</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-between mb-4">
        {["Products", "Categories"].map((tab, index) => (
          <TouchableOpacity
            key={index}
            className={`pb-2 ${
              selectedTab === tab ? "border-b-2 border-green-500" : ""
            }`}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={{ color: primaryColor }}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {selectedTab === "Products" && (
        <View>
          <View className="flex-row justify-between mb-4">
            {["Popular", "Latest", "Top Sales", "Price"].map((tab, index) => (
              <TouchableOpacity
                key={index}
                className={`pb-2 ${
                  selectedProductTab === tab
                    ? "border-b-2 border-green-500"
                    : ""
                }`}
                onPress={() => setSelectedProductTab(tab)}
              >
                <Text style={{ color: primaryColor }}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {selectedProductTab === "Popular" && (
            <View>
              <Text className="font-bold mb-2">Popular</Text>
              {/*dito yung mga cards */}
            </View>
          )}
          {selectedProductTab === "Latest" && (
            <View>
              <Text className="font-bold mb-2">Latest</Text>
              {/*dito yung mga cards */}
            </View>
          )}
          {selectedProductTab === "Top Sales" && (
            <View>
              <Text className="font-bold mb-2">Top Sales</Text>
              {/*dito yung mga cards */}
            </View>
          )}
          {selectedProductTab === "Price" && (
            <View>
              <Text className="font-bold mb-2">Price</Text>
              {/*dito yung mga cards */}
            </View>
          )}
        </View>
      )}
      {selectedTab === "Categories" && (
        <View className="">
          {selectedCategory === null ? (
            product.seller.categories.category.map((category) => (
              <TouchableOpacity
                className=""
                key={category.id}
                onPress={() => setSelectedCategory(category)}
              >
                <Text className="">{category.name}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <View>
              {selectedCategory.subCategories.map((subCategory) => (
                <TouchableOpacity
                  className=""
                  key={subCategory.id}
                >
                  <Text className="">{subCategory.name}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                <Text>Back to Categories</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

export default SellerShopScreen;
