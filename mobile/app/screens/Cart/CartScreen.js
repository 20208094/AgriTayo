import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from "react-native";
import CheckBox from "react-native-check-box";
import deleteButton from "../../assets/delete.png";
import editButton from "../../assets/edit.png";
import placeholderImage from "../../assets/placeholder.png"; // Placeholder image for item
import { Swipeable } from "react-native-gesture-handler";
import { styled } from "nativewind";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';

const StyledView = styled(View);
const StyledText = styled(Text);

const { width } = Dimensions.get("window");

function CartScreen() {
  const navigation = useNavigation();
  const [shops, setShops] = useState([]);
  const [userData, setUserData] = useState([]);
  const [userId, setUserId] = useState(null); // Initialize as null
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData) {
      // console.log('Updated userData:', userData.user_id);
    }
  }, [userData]);

  const getAsyncUserData = async () => {
    setLoading(true); // Set loading to true before starting data fetching
    try {
      const storedData = await AsyncStorage.getItem('userData');

      if (storedData) {
        const parsedData = JSON.parse(storedData); // Parse storedData

        if (Array.isArray(parsedData)) {
          const user = parsedData[0];  // Assuming user data is the first element of the array
          setUserData(user); // Set userData state to the user object
          setUserId(user.user_id); // Set userId
        } else {
          setUserData(parsedData); // If it's not an array, directly set parsed data
          setUserId(parsedData.user_id); // Ensure userId is set if available
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getAsyncUserData();
    }, [])
  );

  const fetchShops = async () => {
    try {
      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/shops`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });
      const allShops = await response.json();
      return allShops; // Return fetched shops
    } catch (error) {
      console.error("Error fetching shops:", error);
      Alert.alert("Error", "Could not fetch shops, please try again later.");
      return []; // Return an empty array on error
    }
  };

  const fetchCrops = async () => {
    try {
      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crops`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });
      const allCrops = await response.json();
      return allCrops; // Return fetched crops
    } catch (error) {
      console.error("Error fetching crops:", error);
      Alert.alert("Error", "Could not fetch crops, please try again later.");
      return []; // Return an empty array on error
    }
  };

  const fetchCarts = async () => {
    // Ensure userId is present before making the fetch call
    if (!userId) {
      Alert.alert("User ID is not available", "Please log in to access your cart.");
      return [];
    }

    try {
      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/cartsId/${userId}`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });

      const allCarts = await response.json();

      // Flatten the nested structure if needed
      const flattenedCarts = allCarts.map(cart => ({
        cart_id: cart.cart_id,
        cart_total_price: cart.cart_total_price,
        cart_total_quantity: cart.cart_total_quantity,
        cart_user_id: cart.cart_user_id,
        cart_crop_id: cart.cart_crop_id,
        cart_metric_system_id: cart.cart_metric_system_id,
        // Include crop data as part of the cart object
        crop_name: cart.crop.crop_name,
        crop_price: cart.crop.crop_price,
        crop_image_url: cart.crop.crop_image_url,
        crop_description: cart.crop.crop_description,
        crop_quantity: cart.crop.crop_quantity,
      }));

      return flattenedCarts;
    } catch (error) {
      console.error("Error fetching carts:", error);
      Alert.alert("Error", "Could not fetch carts, please try again later.");
      return [];
    }
  };

  const initializeData = async () => {
    // Ensure userId is available before fetching data
    if (userId) {
      try {
        const [fetchedShops, fetchedCrops, fetchedCarts] = await Promise.all([
          fetchShops(),
          fetchCrops(),
          fetchCarts(),
        ]);

        // Combine shops and carts into the desired structure
        const combinedShops = fetchedShops.map((shop) => {
          // Filter the crops and carts by shop_id
          const cropsForShop = fetchedCrops.filter((crop) => crop.shop_id === shop.shop_id);
          const cartsForShop = fetchedCarts.filter((cart) => cropsForShop.some(crop => crop.crop_id === cart.cart_crop_id));

          // Combine the carts with the crops
          const items = cartsForShop.map((cart) => {
            const matchingCrop = cropsForShop.find((crop) => crop.crop_id === cart.cart_crop_id);
            return {
              crop_id: cart.cart_crop_id,
              cart_id: cart.cart_id,
              cart_crop_id: cart.cart_crop_id,
              crop_name: cart.crop_name,
              crop_price: cart.crop_price,
              crop_quantity: cart.crop_quantity,
              crop_image_url: cart.crop_image_url,
              selected: false,
              // Additional cart data
              cart_total_quantity: cart.cart_total_quantity,
              cart_total_price: cart.cart_total_price,
            };
          });

          return {
            ...shop,
            items: items, // Include the items array
          };
        });

        // Filter out shops that have null, undefined, or empty items arrays
        const filteredShops = combinedShops.filter((shop) => shop.items && shop.items.length > 0);

        // Set the filtered shops data to state
        setShops(filteredShops);
      } catch (error) {
        console.error("Error initializing data:", error);
        Alert.alert("Error", "Failed to initialize cart data. Please try again later.");
      }
    } else {
      console.warn("User ID not available");
    }
  };

  useEffect(() => {
    if (userId) {
      initializeData(); // Fetch and initialize data once userId is available
    }
  }, [userId]);

  const toggleShopSelection = (shopIndex) => {
    const updatedShops = shops.map((shop, sIndex) => {
      if (sIndex === shopIndex) {
        const areAllItemsSelected = shop.items.every((item) => item.selected);
        const updatedItems = shop.items.map((item) => ({
          ...item,
          selected: !areAllItemsSelected,
        }));
        return { ...shop, items: updatedItems };
      }
      return shop;
    });
    setShops(updatedShops);
  };


  const renderItem = ({ item, shopIndex, itemIndex }) => {
    let swipeableRef = null;

    const deleteItem = () => {
      Alert.alert("Delete Item", `Deleting item: ${item.crop_name}`);
      swipeableRef.close();
      const updatedShops = shops.map((shop, sIndex) => {
        if (sIndex === shopIndex) {
          const updatedItems = shop.items.filter((_, iIndex) => iIndex !== itemIndex);
          return { ...shop, items: updatedItems };
        }
        return shop;
      });
      setShops(updatedShops);
    };

    const editItem = () => {
      Alert.alert("Edit Item", `Editing item: ${item.crop_name}`);
      swipeableRef.close();
    };

    const incrementQuantity = () => {
      const updatedShops = shops.map((shop, sIndex) => {
        if (sIndex === shopIndex) {
          const updatedItems = shop.items.map((itm, iIndex) =>
            iIndex === itemIndex ? { ...itm, quantity: itm.quantity + 1 } : itm
          );
          return { ...shop, items: updatedItems };
        }
        return shop;
      });
      setShops(updatedShops);
    };

    const decrementQuantity = () => {
      const updatedShops = shops.map((shop, sIndex) => {
        if (sIndex === shopIndex) {
          const updatedItems = shop.items.map((itm, iIndex) =>
            iIndex === itemIndex && itm.quantity > 1
              ? { ...itm, quantity: itm.quantity - 1 }
              : itm
          );
          return { ...shop, items: updatedItems };
        }
        return shop;
      });
      setShops(updatedShops);
    };

    const toggleSelection = (shopIndex, itemIndex) => {
      const updatedShops = shops.map((shop, sIndex) => {
        if (sIndex === shopIndex) {
          const updatedItems = shop.items.map((itm, iIndex) =>
            iIndex === itemIndex ? { ...itm, selected: !itm.selected } : itm
          );
          return { ...shop, items: updatedItems };
        }
        return shop;
      });
      setShops(updatedShops);
    };

    const renderRightActions = () => (
      <StyledView className="flex-row my-2 mx-2.5">
        <TouchableOpacity
          onPress={editItem}
          className="bg-orange-400 justify-center items-center w-12 rounded-l-lg my-0.5">
          <Image source={editButton} className="w-6 h-6 tint-white" style={{ tintColor: 'white' }} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={deleteItem}
          className="bg-red-500 justify-center items-center w-12 rounded-r-lg my-0.5">
          <Image source={deleteButton} className="w-6 h-6" style={{ tintColor: 'white' }} />
        </TouchableOpacity>
      </StyledView>
    );

    const showItemDetails = () => {
      navigation.navigate('Product Details', { product: item });
    };

    return (
      <Swipeable
        ref={(ref) => { swipeableRef = ref; }}
        renderRightActions={renderRightActions}
        overshootRight={false}>
        <TouchableOpacity onPress={showItemDetails}>
          <StyledView className="my-2 mx-2.5 border border-gray-300 rounded-lg bg-white">
            <StyledView className="p-4 flex-row items-center">
              <StyledView className="mr-4">
                <CheckBox
                  isChecked={item.selected}
                  onClick={() => toggleSelection(shopIndex, itemIndex)} // Correctly pass shopIndex and itemIndex here
                />
              </StyledView>
              <Image
                source={placeholderImage}
                className="w-20 h-20 rounded-lg"
                resizeMode="cover"
              />
              <StyledView className="ml-4 flex-1">
                <StyledView className="flex-row items-center mb-2">
                  <StyledText className="text-lg font-medium text-gray-800">{item.crop_name}</StyledText>
                </StyledView>
                <StyledText className="text-base text-gray-600">₱ {item.crop_price.toFixed(2)}</StyledText>
              </StyledView>
              <StyledView className="flex-col items-center ml-4">
                <TouchableOpacity
                  onPress={incrementQuantity}
                  className="bg-[#00b251] justify-center items-center w-7 h-7 rounded-full mb-1.5">
                  <Text className="text-white text-xl">+</Text>
                </TouchableOpacity>
                <StyledText className="text-base text-gray-800 mb-1">{item.cart_total_quantity}</StyledText>
                <TouchableOpacity
                  onPress={decrementQuantity}
                  className="bg-red-500 justify-center items-center w-7 h-7 rounded-full">
                  <Text className="text-white text-xl">-</Text>
                </TouchableOpacity>
              </StyledView>
            </StyledView>
          </StyledView>
        </TouchableOpacity>
      </Swipeable>
    );
  };


  const renderShop = ({ item: shop, index: shopIndex }) => (
    <StyledView className="bg-white rounded-lg shadow mb-4">
      <StyledView className="p-4 flex-row items-center border-b border-gray-300 bg-gray-200 rounded-t-lg">
        <StyledView className="mr-4">
          <CheckBox
            isChecked={shop.items.every(item => item.selected)}
            onClick={() => toggleShopSelection(shopIndex)}
          />
        </StyledView>
        <StyledText className="text-xl font-bold text-gray-800">{shop.shop_name}</StyledText>
      </StyledView>

      <FlatList
        data={shop.items}
        renderItem={({ item, index: itemIndex }) =>
          renderItem({ item, shopIndex, itemIndex }) // Ensure correct item and indices are passed
        }
        keyExtractor={(item) => item.cart_id?.toString() ?? ""}
      />
    </StyledView>
  );


  const handleCheckout = () => {
    const selectedItems = shops.flatMap((shop) =>
      shop.items
        .filter((item) => item.selected)
        .map((item) => ({
          ...item,
          shopName: shop.shop_name,
        }))
    );

    if (selectedItems.length === 0) {
      Alert.alert("No items selected", "Please select items to proceed to checkout.");
    } else {
      navigation.navigate("CheckOutScreen", { items: selectedItems });
    }
  };

  return (
    <StyledView className="flex-1 bg-gray-100">
      <FlatList
        data={shops}
        renderItem={renderShop}
        keyExtractor={(shop) => (shop.shop_id ? shop.shop_id.toString() : "")}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      {/* Checkout button */}
      <TouchableOpacity
        onPress={handleCheckout}
        className="bg-[#00B251] justify-center items-center py-3 mx-2.5 rounded-lg mt-2.5">
        <StyledText className="text-lg font-bold text-white">Checkout</StyledText>
      </TouchableOpacity>
    </StyledView>
  );
}

export default CartScreen;
