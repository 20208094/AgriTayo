import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, SafeAreaView, Modal } from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Add vector icons
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";

function CheckOutScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { items: checkedOutItems, user: userData } = route.params || { items: [] };
  const [modalVisible, setModalVisible] = useState(false);
  const [shopDetails, setShopDetails] = useState(null);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const totalPrice = checkedOutItems.reduce(
    (total, item) => total + item.crop_price * item.cart_total_quantity,
    0
  );

  const totalweight = checkedOutItems.reduce(
    (total, item) => total + 1 * item.cart_total_quantity,
    0
  );

  const shippingFee = selectedShippingMethod === "Delivery"
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
        <Text className="text-lg font-bold text-gray-800">{item.crop_name}</Text>
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
          Quantity: {item.cart_total_quantity} {item.metric_system_symbol} @ ₱ {item.crop_price.toFixed(2)} each
        </Text>
        <Text className="font-semibold">
          Total: ₱ {(item.crop_price * item.cart_total_quantity).toFixed(2)}
        </Text>
      </View>
    );
  };

  const renderTotalPrice = () => (
    <View className="mt-1 p-4 bg-white rounded-lg shadow border border-[#00b251]">
      <Text className="text-lg font-bold text-gray-800">Subtotal: ₱ {subtotal.toFixed(2)}</Text>
      <Text className="text-lg font-bold text-gray-800">Shipping Fee: ₱ {shippingFee.toFixed(2)}</Text>
      <Text className="text-lg font-bold text-gray-800">Total Price: ₱ {total.toFixed(2)}</Text>
    </View>
  );

  const renderShippingMethods = () => (
    shopDetails && (
      <View className="mt-2 p-4 bg-white rounded-lg shadow border border-[#00b251]">
        <Text className="text-lg font-bold text-gray-800 mb-2">Choose Shipping Method</Text>
        {shopDetails.Delivery && (
          <TouchableOpacity
            className={`p-3 rounded-lg flex-row items-center justify-between mb-2 ${selectedShippingMethod === "Delivery" ? "bg-[#c6f7d8] border-l-4 border-[#00b251]" : "bg-white"}`}
            onPress={() => handleShippingOption("Delivery")}
          >
            <View className="flex-row items-center">
              <Icon name="truck" size={24} color={selectedShippingMethod === "Delivery" ? "#00b251" : "#aaa"} />
              <Text className="text-gray-800 ml-2">
                Delivery - ₱ {shopDetails.delivery_price.toFixed(2)}
              </Text>
            </View>
            {selectedShippingMethod === "Delivery" && (
              <Icon name="check" size={24} color="#00b251" />
            )}
          </TouchableOpacity>
        )}
        {shopDetails.Pickup && (
          <TouchableOpacity
            className={`p-3 rounded-lg flex-row items-center justify-between ${selectedShippingMethod === "Pickup" ? "bg-[#c6f7d8] border-l-4 border-[#00b251]" : "bg-white"}`}
            onPress={() => handleShippingOption("Pickup")}
          >
            <View className="flex-row items-center">
              <Icon name="storefront" size={24} color={selectedShippingMethod === "Pickup" ? "#00b251" : "#aaa"} />
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
    )
  );

  const renderPaymentMethods = () => (
    shopDetails && (
      <View className="mt-2 p-4 bg-white rounded-lg shadow border border-[#00b251]">
        <Text className="text-lg font-bold text-gray-800 mb-2">Choose Payment Method</Text>
        {shopDetails.cod && (
          <TouchableOpacity
            className={`p-3 rounded-lg flex-row items-center justify-between mb-2 ${selectedPaymentMethod === "COD" ? "bg-[#c6f7d8] border-l-4 border-[#00b251]" : "bg-white"}`}
            onPress={() => handlePaymentOption("COD")}
          >
            <View className="flex-row items-center">
              <Icon name="cash" size={24} color={selectedPaymentMethod === "COD" ? "#00b251" : "#aaa"} />
              <Text className="text-gray-800 ml-2">Cash on Delivery (COD)</Text>
            </View>
            {selectedPaymentMethod === "COD" && (
              <Icon name="check" size={24} color="#00b251" />
            )}
          </TouchableOpacity>
        )}
        {shopDetails.gcash && (
          <TouchableOpacity
            className={`p-3 rounded-lg flex-row items-center justify-between mb-2 ${selectedPaymentMethod === "GCash" ? "bg-[#c6f7d8] border-l-4 border-[#00b251]" : "bg-white"}`}
            onPress={() => handlePaymentOption("GCash")}
          >
            <View className="flex-row items-center">
              <Icon name="wallet" size={24} color={selectedPaymentMethod === "GCash" ? "#00b251" : "#aaa"} />
              <Text className="text-gray-800 ml-2">GCash</Text>
            </View>
            {selectedPaymentMethod === "GCash" && (
              <Icon name="check" size={24} color="#00b251" />
            )}
          </TouchableOpacity>
        )}
        {shopDetails.bank && (
          <TouchableOpacity
            className={`p-3 rounded-lg flex-row items-center justify-between mb-2 ${selectedPaymentMethod === "Bank" ? "bg-[#c6f7d8] border-l-4 border-[#00b251]" : "bg-white"}`}
            onPress={() => handlePaymentOption("Bank")}
          >
            <View className="flex-row items-center">
              <Icon name="bank" size={24} color={selectedPaymentMethod === "Bank" ? "#00b251" : "#aaa"} />
              <Text className="text-gray-800 ml-2">Bank Transfer</Text>
            </View>
            {selectedPaymentMethod === "Bank" && (
              <Icon name="check" size={24} color="#00b251" />
            )}
          </TouchableOpacity>
        )}
      </View>
    )
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
      orderType: 'normal',
      totalWeight: totalweight
    };

    try {
      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/checkoutOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': REACT_NATIVE_API_KEY,
        },
        body: JSON.stringify(orderDetails),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Order placed successfully:', result);
        alert('Order placed successfully!');
      } else {
        console.error('Failed to place order:', response.statusText);
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Network error. Please try again later.');
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
        ListHeaderComponent={() => (
          <View className="flex-1">
          </View>
        )}
        ListFooterComponent={() => (
          <View className="flex-1">
            {renderTotalPrice()}
            {renderShippingMethods()}
            {renderPaymentMethods()}
            <TouchableOpacity
              className="bg-[#00b251] py-3 rounded-lg justify-center items-center mt-2"
              onPress={handleCompleteOrder}
              disabled={!selectedShippingMethod || !selectedPaymentMethod} // Disable button if no options selected
            >
              <Text className="text-lg font-bold text-white">Complete Order</Text>
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
            <Text className="text-center text-xl font-bold pb-2 border-b">Order Summary</Text>
            <FlatList
              data={checkedOutItems}
              renderItem={renderSimpleItem}
              className="border-b"
              keyExtractor={(item) => item.cart_id.toString()}
            />
            <Text className="px-2 mt-1 pb-1 border-b">Payment: {selectedPaymentMethod}</Text>
            <Text className="px-2 mt-1">Shipping: {selectedShippingMethod}</Text>
            <Text className="px-2 mt-1">Shipping Fee: ₱ {shippingFee.toFixed(2)}</Text>
            <Text className="px-2 mt-1">Subtotal: ₱ {subtotal.toFixed(2)}</Text>
            <Text className="px-2 mt-1 pb-1 border-b">Total: ₱ {total.toFixed(2)}</Text>
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
    </SafeAreaView>
  );
}

export default CheckOutScreen;
