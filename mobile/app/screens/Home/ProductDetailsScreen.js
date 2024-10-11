import React, { useState, useEffect } from "react";
import { View, Image, Text, ScrollView, TouchableOpacity, Modal, Pressable } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { styled } from "nativewind";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import placeholderimg from '../../assets/placeholder.png';
import { NotificationIcon, MessagesIcon, MarketIcon } from "../../components/SearchBarC";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";

function ProductDetailsScreen({ navigation, route }) {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userData, setUserData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [shopData, setShopData] = useState([null]);
  const [shopProducts, setShopProducts] = useState([null]);

  const getAsyncUserData = async () => {
    setLoading(true);
    try {
      const storedData = await AsyncStorage.getItem('userData');

      if (storedData) {
        const parsedData = JSON.parse(storedData);

        if (Array.isArray(parsedData)) {
          const user = parsedData[0];
          setUserData(user);
          setUserId(user.user_id);
        } else {
          setUserData(parsedData);
          setUserId(parsedData.user_id);
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getAsyncUserData();
      fetchShopData();
    }, [product])
  );

  useFocusEffect(
    React.useCallback(() => {
      fetchRelatedProducts();
    }, [product.sub_category_id, shopData])
  );


const [shopInfo, setShopInfo] = useState({
  shop_name: 'Unknown Shop',
  shop_image_url: null,
});

// Once shopData is populated, find the correct shop info
useEffect(() => {
  if (shopData && Array.isArray(shopData)) {
    const currentShop = shopData.find(shop => shop && shop.shop_id === product.shop_id);

    if (currentShop) {
      setShopInfo({
        shop_name: currentShop.shop_name || 'Unknown Shop',
        shop_image_url: currentShop.shop_image_url || null,
      });
    }
  }
}, [shopData, product.shop_id]); // Dependency array to trigger when shopData changes

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", marginRight: 15 }}>
          <MarketIcon onPress={() => navigation.navigate("CartScreen")} />
          <NotificationIcon onPress={() => navigation.navigate("Notifications")} />
          <MessagesIcon onPress={() => navigation.navigate("ChatListScreen")} />
        </View>
      ),
    });
  }, [navigation]);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const handleShopPress = async () => {
    if (!product) return; // Ensure that the product exists
  
    try {
      // Fetch shop data first
      const shopResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/shops`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });
      const shopData = await shopResponse.json();
      setShopData(shopData);
  
      // Check if the shop related to the product exists
      const shop = shopData.find((s) => s && s.shop_id === product.shop_id);
  
      if (shop) {
        // Add fallback for followers if it's not available
        const shopInfo = {
          ...shop,
          followers: shop.followers || 0,  // Ensure followers is set, even if missing from API
        };
  
        // Navigate to the Seller Shop with the product and shop information
        navigation.navigate('Seller Shop', { product, shop: shopInfo });
      } else {
        alert('No seller information available for this product.');
      }
    } catch (error) {
      console.error("Error fetching shop data:", error);
      alert('Failed to load shop information.');
    }
  };
  
  

  const handleNegotiatePress = () => {
    navigation.navigate('Buyer Negotiation');
  };

  const handleMessagePress = () => {
    navigation.navigate('ChatScreen', { product });
  };

  const handleAddToCart = async () => {
    const cart_total_price = quantity * product.crop_price;
    const cart_total_quantity = quantity;
    const cart_user_id = userId;
    const cart_crop_id = product.crop_id;
    const cart_metric_system_id = product.metric_system_id;

    const formData = {
      cart_total_price,
      cart_total_quantity,
      cart_user_id,
      cart_crop_id,
      cart_metric_system_id,
    };

    try {
      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/carts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': REACT_NATIVE_API_KEY,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      navigation.navigate('CartScreen');

    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      // Fetch related products based on sub_category_id
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/crops?sub_category_id=${product.sub_category_id}`,
        {
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
        }
      );
      const data = await response.json();
      
      // Check if shopData exists and is an array
      if (shopData && Array.isArray(shopData)) {
        const filteredProducts = data.filter(
          (relatedProduct) => relatedProduct.sub_category_id === product.sub_category_id
        );
  
        // Map through the related products and add the shop_name where shop_id matches
        const updatedRelatedProducts = filteredProducts.map((relatedProduct) => {
          const shop = shopData.find((s) => s && s.shop_id === relatedProduct.shop_id);
          return {
            ...relatedProduct,
            shop_name: shop ? shop.shop_name : 'Unknown Shop', // Add shop_name or 'Unknown Shop' if no match
          };
        });
  
        setRelatedProducts(updatedRelatedProducts); // Set updated related products
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };
  
  

  const fetchShopData = async () => {
    if (!product) return;  // Ensure that the product exists
  
    try {
      // Fetch shop data first
      const shopResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/shops`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });
      const shopData = await shopResponse.json();
      setShopData(shopData);
  
      // Fetch related products based on the current product's sub_category_id
      const relatedProductsResponse = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/crops?sub_category_id=${product.sub_category_id}`,
        {
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
        }
      );
      const relatedProductsData = await relatedProductsResponse.json();
  
      // Check if shopData exists and is an array
      if (shopData && Array.isArray(shopData)) {
        // Update each related product with shop information based on shop_id
        const updatedProducts = relatedProductsData.map((relatedProduct) => {
          const shop = shopData.find((s) => s && s.shop_id === relatedProduct.shop_id);
          return {
            ...relatedProduct,
            shop_name: shop ? shop.shop_name : 'Unknown Shop',  // Add shop_name or 'Unknown Shop' if no match
          };
        });
  
        // Set the updated related products in the state
        setShopProducts(updatedProducts);
      }
    } catch (error) {
      console.error("Error fetching shop or related products:", error);
    }
  };
  

  // Now use the fetchShopData inside useFocusEffect
  useFocusEffect(
    React.useCallback(() => {
      fetchShopData();  // No need to pass product; it is accessed inside fetchShopData
    }, [product])
  );



  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View className="flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }} className="bg-white p-2.5">
        <Modal visible={isModalVisible} transparent={true} animationType="fade">
          <Pressable className="flex-1 bg-black bg-opacity-90 justify-center items-center" onPress={toggleModal}>
            <Image
              source={product.crop_image_url ? { uri: product.crop_image_url } : placeholderimg}
              className="w-full h-full"
              resizeMode="contain"
            />
          </Pressable>
        </Modal>

        <TouchableOpacity onPress={toggleModal}>
          <Image
            source={product.crop_image_url ? { uri: product.crop_image_url } : placeholderimg}
            className="w-full h-80 rounded-lg mb-2.5"
          />
        </TouchableOpacity>

        <View className="px-2.5">
          <View className="flex-row justify-between items-center mb-2.5">
            <Text className="text-xl font-bold">{product.crop_name}</Text>
            <Text className="text-lg text-[#00B251] font-bold">₱ {product.crop_price}</Text>
          </View>
          <Text className="text-base text-[#00B251] mb-2.5 font-bold">Available in stock</Text>
          <View className="flex-row justify-between items-center mb-2.5">
            <Text className="text-base text-gray-700">⭐ {product.crop_rating} (192)</Text>
            <View className="flex-row items-center mb-2.5">
              <TouchableOpacity
                className="border border-green-600 bg-white p-2.5 rounded-lg"
                onPress={decreaseQuantity}
              >
                <Text className="text-lg font-bold text-green-600">-</Text>
              </TouchableOpacity>
              <Text className="text-lg mx-2.5">{quantity} pcs</Text>
              <TouchableOpacity
                className="border border-green-600 bg-white p-2.5 rounded-lg"
                onPress={increaseQuantity}
              >
                <Text className="text-lg font-bold text-green-600">+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text className="text-lg font-bold mb-2.5">Description</Text>
          <Text className="text-base text-gray-700 mb-5">{product.crop_description}</Text>

          <View className="border border-green-600 flex-row items-center justify-between border p-3 rounded-lg mb-5">
            <View className="flex-row items-center ">
              <TouchableOpacity onPress={handleShopPress}>
                <Image
                  source={shopInfo.shop_image_url ? { uri: shopInfo.shop_image_url } : placeholderimg}
                  className="w-20 h-20 rounded-full"
                  resizeMode="cover"
                />
              </TouchableOpacity>
              <View className="ml-1">
                <TouchableOpacity onPress={handleShopPress}>
                  <Text className="text-lg font-bold">{shopInfo.shop_name}</Text>
                </TouchableOpacity>
                <Text className="text-gray-500 text-sm">4.7 ⭐ (512 reviews)</Text>
              </View>
            </View>
            <View className="space-x-2 gap-2.5">
              <TouchableOpacity
                className="bg-white border border-green-600 px-3 py-1 rounded-md items-center flex-row"
                onPress={handleNegotiatePress}
              >
                <FontAwesome name="balance-scale" size={16} color="#00B251" />
                <Text className="text-green-600 ml-2 text-xs">Negotiate</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-[#00B251] px-3 py-1 rounded-md items-center flex-row"
                onPress={handleMessagePress}
              >
                <FontAwesome name="comment" size={16} color="#FFF" />
                <Text className="text-white ml-1 text-xs">Message Seller</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Display Related Products */}
          <Text className="text-lg font-bold mb-2.5">Related Products</Text>
          <ScrollView horizontal={true} className="mb-2.5">
            {relatedProducts.map((relatedProduct) => (
              <View key={relatedProduct.crop_id} className="mr-5">
                <TouchableOpacity
                  onPress={() => navigation.navigate("Product Details", { product: relatedProduct })}
                  className="w-40 bg-white border border-gray-200 rounded-lg"
                >
                  <Image
                    source={relatedProduct.crop_image_url ? { uri: relatedProduct.crop_image_url } : placeholderimg}
                    className="w-full h-28 rounded-t-lg"
                    resizeMode="cover"
                  />
                  <View className="p-2.5">
                    <Text className="text-sm font-bold" numberOfLines={1}>{relatedProduct.crop_name}</Text>
                    <Text className="text-sm text-[#00B251] font-bold">₱ {(relatedProduct.crop_price).toFixed(2)} / kg</Text>
                    <Text className="text-xs">⭐ {relatedProduct.crop_rating || 0}</Text>
                    <Text className="text-xs" numberOfLines={1}>Sold by: {relatedProduct.shop_name}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

        </View>
      </ScrollView>

      {/* Enhanced Sticky Bottom Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white flex-row mb-1" style={{ height: 45 }}>
        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center border border-green-600"
          onPress={handleMessagePress}
          style={{ paddingVertical: 10, minWidth: 20 }}
        >
          <FontAwesome name="comment" size={20} color="#00B251" />
          <Text className="text-[#00B251] font-bold text-mg ml-2">Message</Text>
        </TouchableOpacity>

        {/* Separator */}
        <View className="w-0.5 bg-white" />

        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center border border-green-600"
          onPress={handleNegotiatePress}
          style={{ paddingVertical: 10, minWidth: 20 }}
        >
          <FontAwesome name="balance-scale" size={20} color="#00B251" />
          <Text className="text-[#00B251] font-bold text-mg ml-2">Negotiate</Text>
        </TouchableOpacity>

        {/* Separator */}
        <View className="w-0.5 bg-white" />

        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center border border-green-600 bg-green-600"
          onPress={handleAddToCart}
          style={{ paddingVertical: 10, minWidth: 100 }}
        >
          <FontAwesome name="shopping-cart" size={20} color="white" />
          <Text className="text-white font-bold text-mg ml-2">Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>

  );
}

export default ProductDetailsScreen;
