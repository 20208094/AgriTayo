import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Modal,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons for exclamation mark
import michael from "../../../assets/ehh.png";
import SearchBarC, {
  NotificationIcon,
  MessagesIcon,
  MarketIcon,
} from "../../../components/SearchBarC";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";


function SellerShopScreen({ route }) {
  const { shop_id } = route.params;
  const primaryColor = "#00B251";
  const [selectedTab, setSelectedTab] = useState("Products");
  const navigation = useNavigation();
  const [shopData, setShopData] = useState(null);
  const [cropData, setCropData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cropCategories, setCropCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cropSubCategories, setCropSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isIncomplete, setIsIncomplete] = useState(false); // Track if the shop is incomplete
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [missingFields, setMissingFields] = useState([]); // Track missing fields

  
 const [alertVisible, setAlertVisible] = useState(false);
 const [alertMessage, setAlertMessage] = useState("");

  const getAsyncUserData = async () => {
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
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const fetchShopData = async () => {
    try {
      const shopResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/shops`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });
      const shopData = await shopResponse.json();
      const shop = shopData.find((s) => s && s.shop_id === shop_id);
      if (shop) {
        setShopData(shop);
        // Check if required fields are missing
        if (!shop.tin_number || !shop.bir_image_url) {
          setIsIncomplete(true);
          let missing = [];
          if (!shop.tin_number) missing.push('TIN Number');
          if (!shop.bir_image_url) missing.push('BIR Certificate');
          setMissingFields(missing);
        }
      }

    } catch (error) {
      console.error("Error fetching shop data:", error);
      setAlertMessage("Failed to load shop information.");
      setAlertVisible(true);
    }
  };

  const fetchCropData = async () => {
    try {
      setIsLoading(true);
      const cropResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crops`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });
      const cropData = await cropResponse.json();
      const crops = cropData.filter((c) => c && c.shop_id === shop_id);
      setCropData(crops);
    } catch (error) {
      console.error("Error fetching crop data:", error);
      setAlertMessage("Failed to load crop information.");
      setAlertVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCropCategories = async () => {
    try {
      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_categories`, {
        headers: {
          'x-api-key': REACT_NATIVE_API_KEY
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCropCategories(data);
    } catch (error) {
      console.error('Error fetching crop categories:', error);
    }
  };

  const fetchCropSubCategories = async (categoryId) => {
    try {
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/crop_sub_categories?category_id=${categoryId}`,
        {
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const filteredSubCategories = data.filter((subCategory) => subCategory.crop_category_id === categoryId);
      setCropSubCategories(filteredSubCategories);
    } catch (error) {
      console.error('Error fetching crop subcategories:', error);
    }
  };

  const fetchCropsBySubCategoryAndShop = async (subCategoryId) => {
    try {
      setIsLoading(true);
      const cropResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crops?sub_category_id=${subCategoryId}&shop_id=${shop_id}`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });
      const cropData = await cropResponse.json();
      const filteredCrops = cropData.filter((crop) => crop.sub_category_id === subCategoryId && crop.shop_id === shop_id);
      setCropData(filteredCrops);
    } catch (error) {
      console.error("Error fetching crops:", error);
      setAlertMessage("Failed to load crops.");
      setAlertVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const filterItems = () => {
    if (selectedTab === "Products") {
      return cropData.filter((product) =>
        product.crop_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (selectedTab === "Categories") {
      if (!selectedCategory) {
        return cropCategories.filter((category) =>
          category.crop_category_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } else if (!selectedSubCategory) {
        return cropSubCategories.filter((subCategory) =>
          subCategory.crop_sub_category_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } else {
        return cropData.filter((product) =>
          product.crop_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchShopData();
      if (selectedTab === "Products") {
        fetchCropData();
      } else if (selectedTab === "Categories") {
        fetchCropCategories();
      }
    }, [shop_id, selectedTab])
  );

  useFocusEffect(
    React.useCallback(() => {
      getAsyncUserData();
    }, [])
  );

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

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView>
        <View className="px-4 py-2">
          {/* New Search Bar */}
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={`Search ${selectedTab === "Products" ? "products" : "categories, subcategories, or products"}`}
            className="bg-white p-2 rounded-lg border border-gray-300"
          />
        </View>

        <View className="relative p-4 bg-gray-100">
          <Image
            source={shopData?.shop_image_url ? { uri: shopData.shop_image_url } : michael}
            className="w-12 h-12 rounded-full absolute top-2 left-4"
          />
          <View className="ml-20 flex-row items-center">
            <Text className="text-lg font-bold">{shopData?.shop_name}</Text>
            {isIncomplete && (
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <MaterialIcons name="error-outline" size={20} color="red" style={{ marginLeft: 5 }} />
              </TouchableOpacity>
            )}
          </View>
          <View className="absolute top-4 right-4">
            <TouchableOpacity
              className="px-4 py-1 bg-[#00B251] rounded-md"
              onPress={() =>
                navigation.navigate("ChatScreen", {
                  senderId: userId,
                  receiverId: shopData.shop_id,
                  receiverName: shopData.shop_name,
                  receiverType: "Shop",
                  senderType: "User",
                  receiverImage: shopData.shop_image_url,
                })
              }
            >
              <Text className="text-white font-bold text-center">Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modal to show incomplete shop information */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-6 rounded-lg w-3/4">
              <Text className="text-lg font-bold mb-4">Incomplete Shop Information</Text>
              <Text className="text-gray-600 mb-4">
                It seems like the shop has not completed all the required information from the Business Information.
                Please ensure that all fields are filled out correctly.
              </Text>
              <Text className="text-red-600 font-bold mb-4">
                Missing Fields: {missingFields.join(', ')}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="px-4 py-2 bg-[#00B251] rounded-md"
              >
                <Text className="text-white text-center font-bold">Got it</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Tab Selection */}
        <View className="flex-row justify-around bg-white border-t-4 border-[#00B251] py-2">
          {["Products", "Categories"].map((tab, index) => (
            <TouchableOpacity
              key={index}
              className={`pb-2 ${selectedTab === tab ? "border-b-4 border-[#00B251]" : ""}`}
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

        {/* Products Tab */}
        {selectedTab === "Products" && (
          <>
            {isLoading ? (
              <View className="flex justify-center items-center h-48">
                <ActivityIndicator size="large" color={primaryColor} />
              </View>
            ) : (
              <View className="flex flex-wrap flex-row p-2">
                {Array.isArray(cropData) && cropData.length > 0 ? (
                  filterItems().map((product) => (
                    <View key={product.crop_id} className="w-1/2 p-2">
                      <View className="bg-white border border-white rounded-lg p-2">
                        <TouchableOpacity
                          onPress={() => navigation.navigate("Product Details", { product })}
                          className="bg-white border border-white rounded-lg p-2"
                        >
                          <Image
                            source={{ uri: product.crop_image_url }}
                            className="w-full h-32 rounded-lg mb-2"
                            resizeMode="cover"
                          />
                          <Text className="text-sm font-bold">{product.crop_name}</Text>
                          <Text className="text-[#00B251] text-sm font-bold mt-1">
                            ₱{product.crop_price}
                          </Text>
                          <Text className="text-xs text-gray-500 mt-1">{shopData?.shop_name}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text className="text-center">No products found.</Text>
                )}
              </View>
            )}
          </>
        )}

        {/* Categories Tab */}
        {selectedTab === "Categories" && (
          <>
            {isLoading ? (
              <View className="flex justify-center items-center h-48">
                <ActivityIndicator size="large" color={primaryColor} />
              </View>
            ) : (
              <>
                {(selectedCategory || selectedSubCategory) && (
                  <TouchableOpacity
                    onPress={() => {
                      if (selectedSubCategory) {
                        setSelectedSubCategory(null);
                      } else {
                        setSelectedCategory(null);
                      }
                    }}
                    className="flex flex-row items-center p-2"
                  >
                    <Ionicons name="arrow-back" size={24} color="#00B251" />
                    <Text className="ml-2 text-[#00B251] font-bold">Go Back</Text>
                  </TouchableOpacity>
                )}

                {/* Display categories, subcategories, or products */}
                {!selectedCategory ? (
                  <View className="flex flex-wrap flex-row p-2">
                    {filterItems().map((category) => (
                      <TouchableOpacity
                        key={category.crop_category_id}
                        className="w-1/2 p-2"
                        onPress={() => {
                          setSelectedCategory(category);
                          fetchCropSubCategories(category.crop_category_id);
                        }}
                      >
                        <View className="bg-white border border-white rounded-lg p-2">
                          <Image
                            source={{ uri: category.crop_category_image_url }}
                            className="w-full h-32 rounded-lg mb-2"
                            resizeMode="cover"
                          />
                          <Text className="text-sm font-bold">{category.crop_category_name}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : !selectedSubCategory ? (
                  <View className="flex flex-wrap flex-row p-2">
                    {filterItems().map((subCategory) => (
                      <TouchableOpacity
                        key={subCategory.crop_sub_category_id}
                        className="w-1/2 p-2"
                        onPress={() => {
                          setSelectedSubCategory(subCategory);
                          fetchCropsBySubCategoryAndShop(subCategory.crop_sub_category_id);
                        }}
                      >
                        <View className="bg-white border border-white rounded-lg p-2">
                          <Image
                            source={{ uri: subCategory.crop_sub_category_image_url }}
                            className="w-full h-32 rounded-lg mb-2"
                            resizeMode="cover"
                          />
                          <Text className="text-sm font-bold">{subCategory.crop_sub_category_name}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <View className="flex flex-wrap flex-row p-2">
                    {cropData.map((product) => (
                      <View key={product.crop_id} className="w-1/2 p-2">
                        <View className="bg-white border border-white rounded-lg p-2">
                          <TouchableOpacity
                            onPress={() => navigation.navigate("Product Details", { product })}
                            className="bg-white border border-white rounded-lg p-2"
                          >
                            <Image
                              source={{ uri: product.crop_image_url }}
                              className="w-full h-32 rounded-lg mb-2"
                              resizeMode="cover"
                            />
                            <Text className="text-sm font-bold">{product.crop_name}</Text>
                            <Text className="text-[#00B251] text-sm font-bold mt-1">₱{product.crop_price}</Text>
                            <Text className="text-xs text-gray-500 mt-1">{shopData?.shop_name}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}
          </>
        )}
      </ScrollView>

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
    </SafeAreaView>
  );
}

export default SellerShopScreen;
