import React, { useState, useEffect, useRef } from "react";
import { View, Image, Text, TextInput, ScrollView, TouchableOpacity, Modal, Pressable } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { styled } from "nativewind";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import placeholderimg from '../../assets/placeholder.png';
import { NotificationIcon, MessagesIcon, MarketIcon } from "../../components/SearchBarC";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import { Ionicons } from "@expo/vector-icons";
import LoadingAnimation from "../../components/LoadingAnimation";

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
  const [cropData, setCropData] = useState([]);
  const [senderId, setSenderId] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const scrollViewRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    }, [product])
  );

  const getAsyncUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');

      if (storedData) {
        const parsedData = JSON.parse(storedData);

        if (Array.isArray(parsedData)) {
          const user = parsedData[0];
          setUserData(user);
          setUserId(user.user_id);
          setSenderId(user.user_id);
        } else {
          setUserData(parsedData);
          setUserId(parsedData.user_id);
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

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
  }, [shopData, product.shop_id]);

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
        const shop_id = shop.shop_id
        // Navigate to the Seller Shop with the product and shop information
        navigation.navigate('Seller Shop', { shop_id });
      } else {
        setAlertMessage('No seller information available for this product.');
        setAlertVisible(true);
      }
    } catch (error) {
      console.error("Error fetching shop data:", error);
      setAlertMessage('Failed to load shop information.');
      setAlertVisible(true);
    }
  };

  const handleNegotiatePress = () => {
    navigation.navigate('Buyer Negotiation', { product: displayedProduct });
  };

  const handleAddToCart = async () => {
    setLoading(true);
    const cart_total_price = quantity * displayedProduct.crop_price;
    const cart_total_quantity = quantity;
    const cart_user_id = userId;
    const cart_crop_id = displayedProduct.crop_id;
    const cart_metric_system_id = displayedProduct.metric_system_id;

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
        setLoading(false);
      } else {
        navigation.navigate('CartScreen');
        setQuantity(1)
        setLoading(false);
      }

    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const fetchCropData = async () => {
    setLoading(true)
    if (!product) return;

    try {
      const cropsResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crops`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });

      const categoryResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_categories`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });

      const subcategoryResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_sub_categories`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });

      const varietyResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_varieties`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });

      const varietySizeResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_variety_sizes`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });

      const sizeResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_sizes`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });

      const metricResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/metric_systems`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });

      const shopResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/shops`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });

      const rawcrops = await cropsResponse.json();
      const categories = await categoryResponse.json();
      const subcategories = await subcategoryResponse.json();
      const varieties = await varietyResponse.json();
      const variety_sizes = await varietySizeResponse.json();
      const sizes = await sizeResponse.json();
      const metrics = await metricResponse.json();
      const shops = await shopResponse.json();

      const newProduct = rawcrops.find(crop => crop.crop_id === product.crop_id);

      const liveCrops = rawcrops.filter(crop => crop.availability === 'live' && crop.crop_quantity > 0 && newProduct.crop_variety_id === crop.crop_variety_id);

      const combinedData = liveCrops.map(crop => {
        const categoryData = categories.find(cat => cat.crop_category_id === crop.category_id);
        const subcategoryData = subcategories.find(sub => sub.crop_sub_category_id === crop.sub_category_id);
        const varietyData = varieties.find(variety => variety.crop_variety_id === crop.crop_variety_id);
        const sizeData = variety_sizes.find(varSize => varSize.crop_variety_id === crop.crop_variety_id);
        const actualSize = sizes.find(size => size.crop_size_id === (sizeData ? sizeData.crop_size_id : null));
        const metricData = metrics.find(metric => metric.metric_system_id === crop.metric_system_id);
        const shopData = shops.find(shop => shop.shop_id === crop.shop_id);

        return {
          ...crop,
          category: categoryData ? categoryData : null,
          subcategory: subcategoryData ? subcategoryData : null,
          variety: varietyData ? varietyData : null,
          size: actualSize ? actualSize : null,
          metric: metricData ? metricData : null,
          shop: shopData ? shopData : null
        };
      });

      const selectedProduct = combinedData.find(crop => crop.crop_id === product.crop_id);

      const relatedProducts = combinedData.filter(
        (relatedProduct) => relatedProduct.crop_id != product.crop_id
      );

      const relatedShopProducts = combinedData.filter(
        (relatedProduct) => relatedProduct.shop_id === product.shop_id && relatedProduct.crop_id != product.crop_id
      );

      setCropData(selectedProduct);
      setRelatedProducts(relatedProducts);
      setShopProducts(relatedShopProducts);
    } catch (error) {
      console.error("Error fetching shop or related products:", error);
    } finally {
      setLoading(false);
    }
  };

  const displayedProduct = cropData ? cropData : product;

  useFocusEffect(
    React.useCallback(() => {
      getAsyncUserData();
      fetchCropData();
    }, [product])
  );

  const handleMessageSeller = () => {
    if (!userId || !shopInfo.shop_name) {
      console.error("Missing userId or shopInfo");
      return;
    }

    navigation.navigate('ChatScreen', {
      senderId: userId,
      receiverId: product.shop_id,
      receiverName: shopInfo.shop_name,
      receiverType: "Shop",
      senderType: "User",
      receiverImage: shopInfo.shop_image_url,
    });
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  if (loading) {
    return (
      <LoadingAnimation />
    );
  }

  if (!loading) {
    return (
      <View className="flex-1">
        <ScrollView ref={scrollViewRef} contentContainerStyle={{ paddingBottom: 80 }} className="bg-white p-2.5">
          <Modal visible={isModalVisible} transparent={true} animationType="fade">
            <Pressable className="flex-1 bg-black bg-opacity-90 justify-center items-center" onPress={toggleModal}>
              <Image
                source={displayedProduct.crop_image_url ? { uri: displayedProduct.crop_image_url } : placeholderimg}
                className="w-full h-full"
                resizeMode="contain"
              />
            </Pressable>
          </Modal>

          <TouchableOpacity onPress={toggleModal}>
            <Image
              source={displayedProduct.crop_image_url ? { uri: displayedProduct.crop_image_url } : placeholderimg}
              className="w-full h-80 rounded-lg mb-2.5"
            />
          </TouchableOpacity>

          <View className="px-2.5">
            <View className="flex-row justify-between items-center mb-1 px-2">
              <Text className="text-xl font-bold">{displayedProduct.crop_name}</Text>
              <Text className="text-lg text-[#00B251] font-bold pr-3">₱ {displayedProduct.crop_price} {displayedProduct?.metric?.metric_system_symbol || 'unit'}/s</Text>
            </View>
            <View className="flex-row w-full px-3">
              <View className="mx-2 pr-2">
                <Text className="text-base text-gray-800 mb-1 font-bold">Class:</Text>
                <Text className="text-base text-gray-800 mb-1 font-bold">Size:</Text>
                <Text className="text-base text-gray-800 mb-1 font-bold">Stock:</Text>
              </View>
              <View className="w-2/5">
                <Text className="text-base text-gray-700 mb-1 ">{displayedProduct.crop_class}</Text>
                <Text className="text-base text-gray-700 mb-1 ">{displayedProduct.size.crop_size_name}</Text>
                <Text className="text-base text-gray-700 mb-1 ">{displayedProduct.crop_quantity} {displayedProduct?.metric?.metric_system_symbol || 'unit'}/s</Text>
              </View>
              <View className="mb-2.5 justify-center">
                <View className="flex-row items-center justify-end mb-2.5">
                  <TouchableOpacity
                    className="border border-green-600 bg-white p-2.5 rounded-lg"
                    onPress={() => {
                      if (quantity > 0) setQuantity(quantity - 1); 
                    }}
                  >
                    <Text className="text-lg font-bold text-green-600">-</Text>
                  </TouchableOpacity>
                  <View className="flex-row items-center mx-2.5">
                    <TextInput
                      className="text-lg border border-gray-300 rounded-md text-center p-1 w-12"
                      value={quantity.toString()} 
                      onChangeText={(value) => {
                        const numericValue = parseInt(value, 10);
                        if (!isNaN(numericValue)) {
                          setQuantity(Math.min(numericValue, displayedProduct.crop_quantity));
                        }
                      }}
                      onFocus={() => setQuantity('')} 
                      keyboardType="numeric" 
                    />
                    <Text className="text-lg text-gray-700 ml-2">
                      {displayedProduct?.metric?.metric_system_symbol || 'unit'}/s
                    </Text>
                  </View>
                  <TouchableOpacity
                    className="border border-green-600 bg-white p-2.5 rounded-lg"
                    onPress={() => {
                      if (quantity < displayedProduct.crop_quantity) {
                        setQuantity(quantity + 1);
                      }
                    }}
                  >
                    <Text className="text-lg font-bold text-green-600">+</Text>
                  </TouchableOpacity>
                </View>
              </View>

            </View>
            <View className="px-2 mt-1  mb-3 ">
              <Text className="text-lg font-bold">Description</Text>
              <Text className="text-base text-gray-700 px-2">{displayedProduct.crop_description}</Text>
            </View>

            <View className="border border-green-600 flex-row items-center justify-between p-3 rounded-lg mb-5">
              <View className="flex-row items-center">
                <TouchableOpacity onPress={handleShopPress}>
                  <Image
                    source={shopInfo.shop_image_url ? { uri: shopInfo.shop_image_url } : placeholderimg}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
                <View className="ml-2">
                  <TouchableOpacity onPress={handleShopPress}>
                    <Text className="text-base md:text-lg font-bold">{shopInfo.shop_name}</Text>
                  </TouchableOpacity>
                  <Text className="text-gray-500 text-xs md:text-sm">4.7 ⭐ (512 reviews)</Text>
                </View>
              </View>

              <View className="space-x-2 gap-2">
                {displayedProduct.negotiation_allowed ? (
                  <TouchableOpacity
                    className="bg-white border border-green-600 px-2.5 md:px-3 py-1 rounded-md items-center flex-row"
                    onPress={handleNegotiatePress}
                  >
                    <FontAwesome5 name="handshake" size={14} color="#00B251" />
                    <Text className="text-green-600 ml-1 text-xs md:text-sm">Negotiate</Text>
                  </TouchableOpacity>
                ) : (
                  <View
                    className="bg-gray-300 border border-gray-500 px-2.5 md:px-3 py-1 rounded-md items-center flex-row opacity-50"
                  >
                    <FontAwesome5 name="handshake" size={14} color="#B0B0B0" />
                    <Text className="text-gray-700 ml-1 text-xs md:text-sm">Unavailable</Text>
                  </View>
                )}


                <TouchableOpacity
                  className="bg-[#00B251] px-2.5 md:px-3 py-1 rounded-md items-center flex-row"
                  onPress={handleMessageSeller}
                >
                  <FontAwesome name="comment" size={14} color="#FFF" />
                  <Text className="text-white ml-1 text-xs md:text-sm">Message Seller</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Display Related Products */}
            <Text className="text-lg font-bold mb-2.5">Related Products</Text>
            <ScrollView horizontal={true} className="mb-2.5">
              {relatedProducts.length > 0 ? (
                relatedProducts.map((relatedProduct) => (
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
                        <Text className="text-sm text-[#00B251] font-bold">₱ {(relatedProduct.crop_price).toFixed(2)} /kg</Text>
                        <Text className="text-xs" numberOfLines={1}>Sold by: {relatedProduct.shop.shop_name}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text className="text-center text-gray-500">No related products based on variety</Text>
              )}
            </ScrollView>

            {/* Display Related Shop Products */}
            <Text className="text-lg font-bold mb-2.5">Other Products from the Same Shop</Text>
            <ScrollView horizontal={true} className="mb-2.5">
              {shopProducts.length > 0 ? (
                shopProducts.map((relatedProduct) => (
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
                        <Text className="text-sm text-[#00B251] font-bold">₱ {(relatedProduct.crop_price).toFixed(2)} /kg</Text>
                        <Text className="text-xs" numberOfLines={1}>Sold by: {relatedProduct.shop.shop_name}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text className="text-center text-gray-500">No related products from the same shop.</Text>
              )}
            </ScrollView>
          </View>
        </ScrollView>

        {/* Enhanced Sticky Bottom Bar */}
        <View className="absolute bottom-0 left-0 right-0 flex-row mb-1 h-12 px-1">
          <TouchableOpacity
            className="flex-1 w-12 items-center justify-center border border-green-600 bg-green-100 rounded-lg"
            onPress={handleMessageSeller}  // Message seller logic
          >
            <FontAwesome name="comment" size={20} color="#00B251" />
          </TouchableOpacity>

          {/* Separator */}
          <View className="w-1" />
          {displayedProduct.negotiation_allowed ? (
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center bg-white border border-green-600 rounded-lg"
              onPress={handleNegotiatePress}
            >
              <FontAwesome5 name="handshake" size={20} color="#00B251" />
            </TouchableOpacity>
          ) : (
            <View
              className="flex-1 flex-row items-center justify-center bg-gray-300 border border-gray-500 rounded-lg"
            >
              <FontAwesome5 name="handshake" size={20} color="gray" />
            </View>
          )}


          {/* Separator */}
          <View className="w-1" />

          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center border border-green-600 bg-green-600 rounded-lg"
            onPress={handleAddToCart}
            style={{ paddingVertical: 10, minWidth: 150 }}
          >
            <FontAwesome name="shopping-cart" size={20} color="white" />
            <Text className="text-white font-bold text-mg ml-2">Add to Cart</Text>
          </TouchableOpacity>
        </View>


        {/* Alert Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={alertVisible}
          onRequestClose={() => setAlertVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50 bg-opacity-50">
            <View className="bg-white p-6 rounded-lg shadow-lg w-3/4">
              <Text className="text-lg font-semibold text-gray-900 mb-4">{alertMessage}</Text>
              <TouchableOpacity
                className="mt-4 p-2 bg-[#00B251] rounded-lg flex-row justify-center items-center"
                onPress={() => setAlertVisible(false)}
              >
                <Ionicons name="checkmark-circle-outline" size={24} color="white" />
                <Text className="text-lg text-white ml-2">OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

    );
  }
}

export default ProductDetailsScreen;
