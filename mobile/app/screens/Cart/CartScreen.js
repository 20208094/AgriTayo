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
  TextInput,
} from "react-native";
import CheckBox from "react-native-check-box";
import placeholderImage from "../../assets/placeholder.png"; // Placeholder image for item
import { Swipeable } from "react-native-gesture-handler";
import { styled } from "nativewind";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Ionicons } from "@expo/vector-icons";

const StyledView = styled(View);
const StyledText = styled(Text);

function CartScreen() {
  const navigation = useNavigation();
  const [shops, setShops] = useState([]);
  const [userData, setUserData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [newQuantity, setNewQuantity] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSwiped, setIsSwiped] = useState(false);
  const [selectedShopIndex, setSelectedShopIndex] = useState(null);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

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
      setAlertMessage("Error", "Could not fetch crops, please try again later.");
      setAlertVisible(true);
      return []; // Return an empty array on error
    }
  };

  const fetchCarts = async () => {
    // Ensure userId is present before making the fetch call
    if (!userId) {
      setAlertMessage("User ID is not available", "Please log in to access your cart.");
      setAlertVisible(true);
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
        shop_id: cart.crop.shop_id,
        crop_price: cart.crop.crop_price,
        crop_image_url: cart.crop.crop_image_url,
        crop_description: cart.crop.crop_description,
        crop_quantity: cart.crop.crop_quantity,
        // Include crop data as part of the cart object
        metric_system_name: cart.metric_system.metric_system_name,
        metric_system_symbol: cart.metric_system.metric_system_symbol,
      }));
      return flattenedCarts;
    } catch (error) {
      console.error("Error fetching carts:", error);
      setAlertMessage("Error", "Could not fetch carts, please try again later.");
      setAlertVisible(true);
      return [];
    }
  };

  const initializeData = async () => {
    // setLoading(true);
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
              shop_id: cart.shop_id,
              cart_id: cart.cart_id,
              cart_crop_id: cart.cart_crop_id,
              crop_name: cart.crop_name,
              crop_price: cart.crop_price,
              crop_quantity: cart.crop_quantity,
              crop_image_url: cart.crop_image_url,
              metric_system_name: cart.metric_system_name,
              metric_system_symbol: cart.metric_system_symbol,
              cart_metric_system_id: cart.cart_metric_system_id,
              cart_user_id: cart.cart_user_id,
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

        const sortedShops = filteredShops.map((shop) => ({
          ...shop,
          items: shop.items.sort((a, b) => a.cart_id - b.cart_id)
      }));
      
      setShops(sortedShops);
      setLoading(false);

      } catch (error) {
        console.error("Error initializing data:", error);
        setAlertMessage("Error", "Failed to initialize cart data. Please try again later.");
        setAlertVisible(true);
      }
    } else {
      console.warn("User ID not available");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        initializeData();
      }
    }, [userId])
  );

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
      return {
        ...shop,
        items: shop.items.map((itm) => ({ ...itm, selected: false })), // Deselect all items from other shops
      };
    });
    setShops(updatedShops);
  };

  const updateCartOnBackend = async (cart, newQuantity) => {
    try {
      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/carts/${cart.cart_id}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "x-api-key": REACT_NATIVE_API_KEY,
        },
        body: JSON.stringify({
          cart_id: cart.cart_id,
          cart_total_quantity: newQuantity,
          cart_user_id: cart.cart_user_id,
          cart_crop_id: cart.cart_crop_id,
          cart_metric_system_id: cart.cart_metric_system_id
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text(); // Read response body for debugging
        console.error('Response not ok:', errorBody);
        throw new Error('Failed to update cart on backend');
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      setAlertMessage("Error", "Could not update cart, please try again.");
      setAlertVisible(true);
    }
  };

  const deleteCartOnBackend = async (cart) => {
    try {
      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/carts/${cart.cart_id}`, {
        method: 'DELETE',
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Response not ok:', errorBody);
        throw new Error('Failed to delete cart on backend');
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      setAlertMessage("Error", "Could not delete cart, please try again.");
      setAlertVisible(true);
    }
  };

  const updateQuantity = async () => {
    // setLoading(true);
    if (selectedItem) {
      const updatedQuantity = newQuantity;

      // Update the local state
      const updatedShops = shops.map((shop) => {
        return {
          ...shop,
          items: shop.items.map((itm) => {
            if (itm.cart_id === selectedItem.cart_id) {
              return { ...itm, cart_total_quantity: updatedQuantity };
            }
            return itm;
          }),
        };
      });
      setShops(updatedShops);
      await updateCartOnBackend(selectedItem, updatedQuantity);
      // initializeData();
      setModalVisible(false);
      // setLoading(false);
    }
  };

  const renderItem = ({ item, shopIndex, itemIndex }) => {
    let swipeableRef = null;

    const editItem = () => {
      setSelectedItem(item);
      setNewQuantity(item.cart_total_quantity);
      setModalVisible(true);
      swipeableRef.close();
    };

    const deleteItem = () => {
      setSelectedItem(item);
      const updatedShops = shops.map((shop, sIndex) => {
        if (sIndex === shopIndex) {
          const updatedItems = shop.items.filter((_, iIndex) => iIndex !== itemIndex);
          return { ...shop, items: updatedItems };
        }
        return shop;
      });
      deleteCartOnBackend(item);
      setShops(updatedShops);
      initializeData();
      swipeableRef.close();
    };

    const incrementQuantity = async () => {
      const updatedQuantity = item.cart_total_quantity + 1;
      const updatedTotalPrice = item.crop_price * updatedQuantity;

      // Update state
      const updatedShops = shops.map(cartItem => {
        if (cartItem.cart_id === item.cart_id) {
          return { ...cartItem, cart_total_quantity: updatedQuantity, cart_total_price: updatedTotalPrice };
        }
        return cartItem;
      });

      setShops(updatedShops);
      await updateCartOnBackend(item, updatedQuantity);

      // Reload data after successful update
      initializeData();
    };

    const decrementQuantity = async () => {
      if (item.cart_total_quantity > 1) {
        const updatedQuantity = item.cart_total_quantity - 1;
        const updatedTotalPrice = item.crop_price * updatedQuantity;

        // Update state
        const updatedShops = shops.map(cartItem => {
          if (cartItem.cart_id === item.cart_id) {
            return { ...cartItem, cart_total_quantity: updatedQuantity, cart_total_price: updatedTotalPrice };
          }
          return cartItem;
        });

        setShops(updatedShops);
        await updateCartOnBackend(item, updatedQuantity);

        // Reload data after successful update
        initializeData();
      }
    };


    const toggleSelection = (shopIndex, itemIndex) => {
      const updatedShops = shops.map((shop, sIndex) => {
        if (sIndex === shopIndex) {
          const updatedItems = shop.items.map((itm, iIndex) => {
            if (iIndex === itemIndex) {
              // Toggle the selected state of the current item
              const newSelectedState = !itm.selected;

              // If deselecting the item, clear the selection for other shops
              if (!newSelectedState) {
                setSelectedShopIndex(null); // Clear selected shop index
                return { ...itm, selected: false }; // Deselect the current item
              }

              // If selecting, maintain the selection state
              return { ...itm, selected: true };
            }
            return itm;
          });
          return { ...shop, items: updatedItems };
        }
        return {
          ...shop,
          items: shop.items.map((itm) => ({ ...itm, selected: false })), // Deselect all items from other shops
        };
      });
      setShops(updatedShops);
    };



    const renderRightActions = () => (
      <StyledView className="flex-row my-2">
        <TouchableOpacity
          onPress={editItem}
          className="bg-orange-400 justify-center items-center w-12">
          <MaterialIcons name="edit" size={35} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={deleteItem}
          className="bg-red-500 justify-center items-center w-12 rounded-r-lg">
          <MaterialIcons name="delete-forever" size={35} color="white" />
        </TouchableOpacity>
      </StyledView>
    );

    const showItemDetails = () => {
      navigation.navigate('Product Details', { product: item });
    };

    const handleSwipeableWillOpen = () => {
      setIsSwiped(true);
    };

    const handleSwipeableWillClose = () => {
      setIsSwiped(false);
    };

    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading product...</Text>
        </View>
      );
    }

    return (
      <StyledView className="mx-2.5">
        <Swipeable
          ref={(ref) => { swipeableRef = ref; }}
          renderRightActions={renderRightActions}
          onSwipeableWillOpen={handleSwipeableWillOpen}
          onSwipeableWillClose={handleSwipeableWillClose}
          overshootRight={false}
        >
          <TouchableOpacity onPress={showItemDetails}>
            <StyledView className={`my-2 border border-gray-300 bg-white ${isSwiped ? 'rounded-l-lg' : 'rounded-lg'}`}>
              <StyledView className="p-4 flex-row items-center">
                <StyledView className="mr-4">
                  {/* Render checkbox only if the shop is selected or if no item is selected */}
                  {selectedShopIndex === null || selectedShopIndex === shopIndex ? (
                    <CheckBox
                      isChecked={item.selected}
                      onClick={() => toggleSelection(shopIndex, itemIndex)}
                    />
                  ) : null}
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
                  <StyledText className="text-base text-gray-600">₱ {item.crop_price.toFixed(2)} per {item.metric_system_name}</StyledText>
                </StyledView>
                <StyledView className="flex-col items-center ml-4">
                  <TouchableOpacity
                    onPress={incrementQuantity}
                    className="bg-[#00b251] justify-center text-center items-center w-7 h-7 rounded-full">
                    <FontAwesome name="plus" size={18} color="white" />
                  </TouchableOpacity>
                  <StyledText className="text-base font-bold text-gray-800 my-1">{item.cart_total_quantity} {item.metric_system_symbol}</StyledText>
                  <TouchableOpacity
                    onPress={decrementQuantity}
                    className="bg-red-500 justify-center items-center w-7 h-7 rounded-full">
                    <FontAwesome name="minus" size={18} color="white" />
                  </TouchableOpacity>
                </StyledView>
              </StyledView>
            </StyledView>
          </TouchableOpacity>
        </Swipeable>
      </StyledView>
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
          renderItem({ item, shopIndex, itemIndex })
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
      setAlertMessage("No items selected", "Please select items to proceed to checkout.");
      setAlertVisible(true);
    } else {
      navigation.navigate("CheckOutScreen", { items: selectedItems, user: userData, order_type: 'normal', cart_type: 'cart' });
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
        className="bg-[#00B251] justify-center items-center py-3 mx-2.5 rounded-lg my-2.5">
        <StyledText className="text-lg font-bold text-white">Checkout</StyledText>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 justify-center items-center bg-gray-600/50">
          <View className="bg-white rounded-lg p-4 w-80">
            <Text className="text-lg font-bold mb-4">Edit Quantity</Text>
            <TextInput
              keyboardType="numeric"
              value={newQuantity.toString()}
              onChangeText={setNewQuantity}
              className="border border-gray-300 p-2 rounded mb-4"
              placeholder="Enter new quantity"
            />
            <View className="flex-row justify-between">
              <TouchableOpacity onPress={() => setModalVisible(false)} className="bg-gray-300 py-2 px-4 rounded">
                <Text className="text-lg">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={updateQuantity} className="bg-green-500 py-2 px-4 rounded">
                <Text className="text-lg text-white">Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    </StyledView>
    
  );
}

export default CartScreen;
