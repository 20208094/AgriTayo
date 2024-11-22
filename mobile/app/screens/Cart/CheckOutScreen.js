import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Modal,
  TextInput
} from "react-native";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Add vector icons
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import { Ionicons } from "@expo/vector-icons";

function CheckOutScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    items: checkedOutItems,
    user: userData,
    order_type,
    cart_type,
  } = route.params || { items: [] };
  const [modalVisible, setModalVisible] = useState(false);
  const [shopDetails, setShopDetails] = useState(null);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [checkOutAddress, setCheckOutAddress] = useState('')

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const totalPrice = checkedOutItems.reduce(
    (total, item) => total + item.crop_price * item.cart_total_quantity,
    0
  );

  const totalweight = checkedOutItems.reduce(
    (total, item) => total + 1 * item.cart_total_quantity,
    0
  );

  const shippingFee =
    selectedShippingMethod === "Delivery"
      ? shopDetails?.delivery_price || 0
      : selectedShippingMethod === "Pickup"
        ? shopDetails?.pickup_price || 0
        : 0;

  const subtotal = totalPrice;
  const total = subtotal + shippingFee;

  const fetchShops = async (shopId) => {
    try {
      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/shops`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });
      const shops = await response.json();

      const filteredShops = shops.filter((shop) => shop.shop_id === shopId);
      setShopDetails(filteredShops[0]); // Store the first matching shop
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (checkedOutItems.length > 0) {
        const shopId = checkedOutItems[0]?.shop_id;
        if (shopId) {
          fetchShops(shopId);
        }
      }
    }, [checkedOutItems])
  );

  const handleCompleteOrder = () => setModalVisible(true);
  const handlePaymentOption = (option) => setSelectedPaymentMethod(option);
  const handleShippingOption = (option) => setSelectedShippingMethod(option);

  const renderItem = ({ item }) => {
    const itemTotal = item.crop_price * item.cart_total_quantity; // Calculate total for the item
    return (
      <View className="bg-white p-4 my-1 rounded-lg border border-[#00b251]">
        <Text className="text-lg font-bold text-gray-800">
          {item.crop_name}
        </Text>
        <Text className="text-base text-gray-600">
          Price: ₱ {item.crop_price.toFixed(2)} per {item.metric_system_name}
        </Text>
        <Text className="text-base text-gray-600">
          Quantity: {item.cart_total_quantity} {item.metric_system_symbol}
        </Text>
        <View className="border my-1 border-[#00b251]/75" />
        <Text className="text-base font-semibold text-gray-700">
          Total: ₱ {itemTotal.toFixed(2)}
        </Text>
      </View>
    );
  };

  const renderSimpleItem = ({ item }) => {
    return (
      <View className="p-2 border-b border-gray-300">
        <Text className="text-gray-800">{item.crop_name}</Text>
        <Text className="text-gray-600">
          Quantity: {item.cart_total_quantity} {item.metric_system_symbol} @ ₱{" "}
          {item.crop_price.toFixed(2)} each
        </Text>
        <Text className="font-semibold">
          Total: ₱ {(item.crop_price * item.cart_total_quantity).toFixed(2)}
        </Text>
      </View>
    );
  };

  const renderTotalPrice = () => (
    <View className="mt-2 p-4 bg-white rounded-lg shadow border border-[#00b251]">
      <Text className="text-lg font-bold text-gray-800">
        Subtotal: ₱ {subtotal.toFixed(2)}
      </Text>
      <Text className="text-lg font-bold text-gray-800">
        Shipping Fee: ₱ {shippingFee.toFixed(2)}
      </Text>
      <Text className="text-lg font-bold text-gray-800">
        Total Price: ₱ {total.toFixed(2)}
      </Text>
    </View>
  );

  const renderWarningInfo = () => (
    <View className="mt-1 p-4 bg-white rounded-lg shadow border-2 border-orange-400">
      <Text className="text-base font-bold text-orange-500">
        NOTE: AgriTayo will not handle shipping and payment, this will only
        serve as a way to inform the seller for your chosen shipping and
        payment option.
      </Text>
    </View>
  );

  const renderShippingMethods = () =>
    shopDetails && (
      <View className="mt-2 p-4 bg-white rounded-lg shadow border border-[#00b251]">
        <Text className="text-lg font-bold text-gray-800 mb-2">
          Choose Shipping Method
        </Text>
        {shopDetails.delivery && (
          <TouchableOpacity
            className={`p-3 rounded-lg flex-row items-center justify-between mb-2 ${selectedShippingMethod === "Delivery"
              ? "bg-[#c6f7d8] border-l-4 border-[#00b251]"
              : "bg-white"
              }`}
            onPress={() => handleShippingOption("Delivery")}
          >
            <View className="flex-row items-center">
              <Icon
                name="truck"
                size={24}
                color={
                  selectedShippingMethod === "Delivery" ? "#00b251" : "#aaa"
                }
              />
              <Text className="text-gray-800 ml-2">
                Delivery - ₱ {shopDetails.delivery_price.toFixed(2)}
              </Text>
              <Text className="text-sm mb-2 text-gray-800">
              </Text>
            </View>
            {selectedShippingMethod === "Delivery" && (
              <Icon name="check" size={24} color="#00b251" />
            )}
          </TouchableOpacity>
        )}
        {selectedShippingMethod === "Delivery" && (
          <View className="mt-1 mb-1 border-b-2 border-green-600">
            <Text className="text-sm text-gray-800">Enter Your Address:</Text>
            <TextInput
              className="w-full p-2 mb-2 bg-white rounded-lg shadow-md border border-gray-400"
              placeholder="#123 Barangay Maria Basa, Baguio City"
              value={checkOutAddress}
              onChangeText={setCheckOutAddress}
            />
          </View>
        )}
        {shopDetails.pickup && (
          <TouchableOpacity
            className={`p-3 rounded-lg flex-row items-center justify-between ${selectedShippingMethod === "Pickup"
              ? "bg-[#c6f7d8] border-l-4 border-[#00b251]"
              : "bg-white"
              }`}
            onPress={() => handleShippingOption("Pickup")}
          >
            <View className="flex-row items-center">
              <Icon
                name="storefront"
                size={24}
                color={selectedShippingMethod === "Pickup" ? "#00b251" : "#aaa"}
              />
              <Text className="text-gray-800 ml-2">
                Pickup - ₱ {shopDetails.pickup_price.toFixed(2)}
              </Text>
            </View>
            {selectedShippingMethod === "Pickup" && (
              <Icon name="check" size={24} color="#00b251" />
            )}
          </TouchableOpacity>
        )}
      </View>
    );

  const renderPaymentMethods = () =>
    shopDetails && (
      <View className="mt-2 p-4 bg-white rounded-lg shadow border border-[#00b251]">
        <Text className="text-lg font-bold text-gray-800 mb-2">
          Choose Payment Method
        </Text>
        {shopDetails.cod && (
          <TouchableOpacity
            className={`p-3 rounded-lg flex-row items-center justify-between mb-2 ${selectedPaymentMethod === "COD"
              ? "bg-[#c6f7d8] border-l-4 border-[#00b251]"
              : "bg-white"
              }`}
            onPress={() => handlePaymentOption("COD")}
          >
            <View className="flex-row items-center">
              <Icon
                name="cash"
                size={24}
                color={selectedPaymentMethod === "COD" ? "#00b251" : "#aaa"}
              />
              <Text className="text-gray-800 ml-2">Cash on Delivery (COD)</Text>
            </View>
            {selectedPaymentMethod === "COD" && (
              <Icon name="check" size={24} color="#00b251" />
            )}
          </TouchableOpacity>
        )}
        {shopDetails.gcash && (
          <TouchableOpacity
            className={`p-3 rounded-lg flex-row items-center justify-between mb-2 ${selectedPaymentMethod === "GCash"
              ? "bg-[#c6f7d8] border-l-4 border-[#00b251]"
              : "bg-white"
              }`}
            onPress={() => handlePaymentOption("GCash")}
          >
            <View className="flex-row items-center">
              <Icon
                name="wallet"
                size={24}
                color={selectedPaymentMethod === "GCash" ? "#00b251" : "#aaa"}
              />
              <Text className="text-gray-800 ml-2">GCash</Text>
            </View>
            {selectedPaymentMethod === "GCash" && (
              <Icon name="check" size={24} color="#00b251" />
            )}
          </TouchableOpacity>
        )}
        {shopDetails.bank && (
          <TouchableOpacity
            className={`p-3 rounded-lg flex-row items-center justify-between mb-2 ${selectedPaymentMethod === "Bank"
              ? "bg-[#c6f7d8] border-l-4 border-[#00b251]"
              : "bg-white"
              }`}
            onPress={() => handlePaymentOption("Bank")}
          >
            <View className="flex-row items-center">
              <Icon
                name="bank"
                size={24}
                color={selectedPaymentMethod === "Bank" ? "#00b251" : "#aaa"}
              />
              <Text className="text-gray-800 ml-2">Bank Transfer</Text>
            </View>
            {selectedPaymentMethod === "Bank" && (
              <Icon name="check" size={24} color="#00b251" />
            )}
          </TouchableOpacity>
        )}
      </View>
    );

  const handleSubmit = async () => {
    const orderDetails = {
      items: checkedOutItems,
      shippingMethod: selectedShippingMethod,
      paymentMethod: selectedPaymentMethod,
      totalPrice: total,
      statusId: 1,
      userId: userData.user_id,
      shopId: shopDetails.shop_id,
      orderType: order_type,
      cartType: cart_type,
      totalWeight: totalweight,
      shop_number: shopDetails.shop_number,
      shippingAddress: checkOutAddress || null
    };

    try {
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/checkoutOrder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": REACT_NATIVE_API_KEY,
          },
          body: JSON.stringify(orderDetails),
        }
      );

      if (response.ok) {
        navigation.pop(1);
        navigation.navigate("Orders", { screen: "To Confirm" });
      } else {
        console.error("Failed to place order:", response.statusText);
        setAlertMessage("Failed to place order. Please try again.");
        setAlertVisible(true);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setAlertMessage("Network error. Please try again later.");
      setAlertVisible(true);
    } finally {
      setModalVisible(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 mt-2">
      <FlatList
        data={checkedOutItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.cart_id.toString()}
        contentContainerStyle={{ paddingBottom: 16, paddingHorizontal: 16 }}
        ListHeaderComponent={() => <View className="flex-1"></View>}
        ListFooterComponent={() => (
          <View className="flex-1">
            {renderWarningInfo()}
            {renderShippingMethods()}
            {renderPaymentMethods()}
            {renderTotalPrice()}
            <TouchableOpacity
              className="bg-[#00b251] py-3 rounded-lg justify-center items-center mt-2"
              onPress={handleCompleteOrder}
              disabled={!selectedShippingMethod || !selectedPaymentMethod} // Disable button if no options selected
            >
              <Text className="text-lg font-bold text-white">
                Complete Order
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Confirmation Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          className="flex-1 justify-center items-center bg-[#00000080]"
        >
          <View className="w-3/4 bg-white p-6 rounded-lg shadow-lg">
            <Text className="text-center text-xl font-bold pb-2 border-b">
              Order Summary
            </Text>
            <FlatList
              data={checkedOutItems}
              renderItem={renderSimpleItem}
              className="border-b"
              keyExtractor={(item) => item.cart_id.toString()}
            />
            <Text className="px-2 mt-1 pb-1 border-b">
              Payment: {selectedPaymentMethod}
            </Text>
            <Text className="px-2 mt-1">
              Shipping: {selectedShippingMethod}
            </Text>
            <Text className="px-2 mt-1">
              Shipping Fee: ₱ {shippingFee.toFixed(2)}
            </Text>
            <Text className="px-2 mt-1">Subtotal: ₱ {subtotal.toFixed(2)}</Text>
            <Text className="px-2 mt-1 pb-1 border-b">
              Total: ₱ {total.toFixed(2)}
            </Text>
            <TouchableOpacity
              className="bg-[#00b251] py-3 rounded-lg justify-center items-center mt-4"
              onPress={handleSubmit}
            >
              <Text className="text-lg font-bold text-white">Place Order</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-blue-400 py-3 rounded-lg justify-center items-center mt-4"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-lg font-bold text-white">Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
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
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              {alertMessage}
            </Text>
            <TouchableOpacity
              className="mt-4 p-2 bg-[#00B251] rounded-lg flex-row justify-center items-center"
              onPress={() => setAlertVisible(false)}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={24}
                color="white"
              />
              <Text className="text-lg text-white ml-2">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default CheckOutScreen;
