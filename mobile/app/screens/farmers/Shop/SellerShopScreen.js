import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { styled } from "nativewind";
import { useNavigation } from "@react-navigation/native";
import michael from "../../../assets/ehh.png";
import SearchBarC, {
  NotificationIcon,
  MessagesIcon,
  MarketIcon,
} from "../../../components/SearchBarC";
import { Ionicons } from "@expo/vector-icons"; // Importing icons

function SellerShopScreen({ route }) {
  const { product } = route.params;
  const primaryColor = "#00B251";
  const [selectedTab, setSelectedTab] = useState("Products");
  const [selectedProductTab, setSelectedProductTab] = useState("Popular");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigation = useNavigation();

  // React hook to set header options
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", marginRight: 15 }}>
          <MarketIcon onPress={() => navigation.navigate("CartScreen")} />
          <NotificationIcon
            onPress={() => navigation.navigate("Notifications")}
          />
          <MessagesIcon onPress={() => navigation.navigate("ChatListScreen")} />
        </View>
      ),
    });
  }, [navigation]);

  // Example product cards
  const productCards = [
    {
      id: 1,
      name: "Classic Men's Casual Pants",
      price: 148,
      rating: 4.5,
      sold: "10K+ sold",
      discount: 51,
      image: michael,
    },
    {
      id: 2,
      name: "NI Men's Pants",
      price: 149,
      rating: 4.6,
      sold: "10K+ sold",
      discount: 63,
      image: michael,
    },
    {
      id: 3,
      name: "Calalo Shirt",
      price: 149,
      rating: 4.6,
      sold: "10K+ sold",
      discount: 63,
      image: michael,
    },
    {
      id: 4,
      name: "HEV CALALO",
      price: 149,
      rating: 4.6,
      sold: "10K+ sold",
      discount: 63,
      image: michael,
    },
    // Add more products as needed...
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView>
        <View className="px-4 py-2">
          <SearchBarC />
        </View>

        <View className="relative p-4 bg-gray-100">
          <Image
            source={michael}
            className="w-12 h-12 rounded-full absolute top-4 left-4"
          />
          <View className="ml-20">
            <Text className="text-lg font-bold">{product.seller.shopName}</Text>
            <Text className="text-sm text-gray-500">Active 2 minutes ago</Text>
            <View className="flex-row items-center space-x-2 mt-1">
              <Text className="text-yellow-500">⭐ {product.rating}/5.0</Text>
              <Text className="text-gray-500">
                | {product.seller.followers} Followers
              </Text>
            </View>
          </View>
          <View className="absolute top-4 right-4">
            <TouchableOpacity className="px-4 py-1 mb-2 bg-[#00B251] rounded-md">
              <Text className="text-white font-bold text-center">+ Follow</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-4 py-1 bg-[#00B251] rounded-md"
              onPress={() =>
                navigation.navigate("Negotiate To Seller", { product })
              }
            >
              <Text className="text-white font-bold text-center">Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row justify-around bg-white border-t-4 border-[#00B251] py-2">
          {["Products", "Categories"].map((tab, index) => (
            <TouchableOpacity
              key={index}
              className={`pb-2 ${
                selectedTab === tab ? "border-b-4 border-[#00B251]" : ""
              }`}
              onPress={() => setSelectedTab(tab)}
            >
              <Text
                style={{
                  color: selectedTab === tab ? primaryColor : "#757575",
                }}
                className="text-lg font-bold"
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedTab === "Products" && (
          <>
            <View className="flex-row justify-around bg-white border-b border-[#00B251] py-2">
              {["Popular", "Latest", "Top Sales", "Price"].map((tab, index) => (
                <TouchableOpacity
                  key={index}
                  className={`pb-2 ${
                    selectedProductTab === tab
                      ? "border-b-4 border-[#00B251]"
                      : ""
                  }`}
                  onPress={() => setSelectedProductTab(tab)}
                >
                  <Text
                    style={{
                      color:
                        selectedProductTab === tab ? primaryColor : "#757575",
                    }}
                    className="text-sm font-bold"
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Product Grid */}
            <View className="flex flex-wrap flex-row p-2">
              {productCards.map((product) => (
                <View key={product.id} className="w-1/2 p-2">
                  <View className="bg-white border border-white rounded-lg p-2">
                    <Image
                      source={product.image}
                      className="w-full h-32 rounded-lg mb-2"
                      resizeMode="cover"
                    />
                    <Text className="text-sm font-bold">{product.name}</Text>
                    <Text className="text-[#00B251] text-sm font-bold mt-1">
                      ₱{product.price}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">
                      {product.sold}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">
                      ⭐ {product.rating}
                    </Text>
                    <View className="flex-row justify-between mt-2">
                      <Text className="text-xs text-red-500 font-bold">
                        {product.discount}% OFF
                      </Text>
                      <Text className="text-xs text-[#00B251] font-bold">
                        Free Shipping
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {selectedTab === "Categories" && (
          <View className="p-4">
            {selectedCategory === null ? (
              product.seller.categories.category.map((category) => (
                <TouchableOpacity
                  className="flex-row items-center justify-between border-b border-[#00B251] py-3"
                  key={category.id}
                  onPress={() => setSelectedCategory(category)}
                >
                  <View className="flex-row items-center">
                    <Image
                      source={category.image}
                      className="w-12 h-12 rounded-md mr-3"
                    />
                    <Text className="text-base">{category.name}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-gray-500 text-sm">
                      ({category.count})
                    </Text>
                    <Text className="text-gray-400 ml-2">{">"}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <>
                {/* Subcategory Grid */}
                <FlatList
                  data={selectedCategory.subCategories}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={2} // Display as a grid with 2 columns
                  renderItem={({ item }) => (
                    <View className="w-1/2 p-2">
                      <View className="bg-white border border-white rounded-lg p-2">
                        <Image
                          source={item.image}
                          className="w-full h-32 rounded-lg mb-2"
                          resizeMode="cover"
                        />
                        <Text className="text-sm font-bold">{item.name}</Text>
                      </View>
                    </View>
                  )}
                />

                {/* Back to Categories */}
                <TouchableOpacity
                  onPress={() => setSelectedCategory(null)}
                  className="flex-row items-center mt-4"
                >
                  <Ionicons name="arrow-back" size={20} color={primaryColor} />
                  <Text className="text-[#00B251] font-bold ml-2">
                    Back to Categories
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default styled(SellerShopScreen);
