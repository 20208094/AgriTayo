import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import { styled } from 'nativewind';
import { useNavigation } from '@react-navigation/native';


const { width, height } = Dimensions.get('window');
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);

const PRICE_REGEX = /^(?:[1-9]\d*|\d+\.\d{1,2}|0\.\d{1,2})$/;
const QUANTITY_REGEX = /^[1-9]\d*$/;

const NegotiationBuyerScreen = ({ route }) => {
  const { data: negotiationData } = route.params;
  const navigation = useNavigation();
  const [offerPrice, setOfferPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [total, setTotal] = useState('');
  const [priceError, setPriceError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleSwitch = () => setIsChecked(!isChecked);
  const [isChecked, setIsChecked] = useState(true);

  // Effect to calculate the total price dynamically
  useEffect(() => {
    const amountNum = parseFloat(amount) || 0;
    const totalNum = parseFloat(total) || 0;
    
    if (amountNum > 0 && totalNum > 0) {
      const calculatedPrice = (totalNum / amountNum).toFixed(2);
      setOfferPrice(calculatedPrice);
    } else {
      setOfferPrice('0.00');
    }
  }, [total, amount]);

  // Add validation for amount
  useEffect(() => {
    if (amount === '') {
      setAmountError('');
      setOfferPrice('0.00');
      return;
    }

    if (!QUANTITY_REGEX.test(amount)) {
      setAmountError('Please enter a valid whole number greater than 0');
      return;
    }

    setAmountError('');
  }, [amount]);

  // Add validation for total and calculated price
  useEffect(() => {
    if (total === '') {
      setPriceError('');
      setOfferPrice('0.00');
      return;
    }

    if (!PRICE_REGEX.test(total)) {
      setPriceError('Please enter a valid amount (e.g., 100 or 100.50)');
      return;
    }

    setPriceError('');
  }, [total, offerPrice]);

  // Update the input handlers
  const handleAmountChange = (text) => {
    setAmount(text);
  };

  const handleTotalChange = (text) => {
    // Handle empty input
    if (text === '') {
      setTotal('');
      return;
    }

    // If input starts with decimal, add leading zero
    if (text.startsWith('.')) {
      text = '0' + text;
    }

    // Remove any non-numeric characters except decimal point
    const cleanedText = text.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = cleanedText.split('.');
    if (parts.length > 2) return;

    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
      parts[1] = parts[1].substring(0, 2);
      setTotal(`${parts[0]}.${parts[1]}`);
      return;
    }

    setTotal(cleanedText);
  };

  handleMakeOffer = async () => {
    if (!amount && !total) {
      setAmountError('Enter Quantity');
      setPriceError('Enter Total Offer');
      return;
    }
    if (!amount) {
      setAmountError('Enter Quantity');
      setPriceError('');
      return;
    }
    if (!total) {
      setAmountError('');
      setPriceError('Enter Total Offer');
      return;
    }

    const formData = new FormData();
    formData.append("user_amount", amount);
    formData.append("user_price", offerPrice);
    formData.append("user_total", total);
    formData.append("buyer_turn", false);
    formData.append("user_open_for_negotiation", isChecked);
    formData.append("negotiation_status", negotiationData.negotiation_status);
    formData.append("final_amount", negotiationData.final_amount);
    formData.append("final_price", negotiationData.final_price);
    formData.append("final_total", negotiationData.final_total);

    const isSuccess = await handleSubmit(formData);

    if (isSuccess) {
      navigation.navigate("Buyer Negotiation List", { screen: "Ongoing" });
    } else {
      alert('Failed to update the offer. Please try again.');
    }
  }

  handleAcceptOffer = async () => {
    const formData = new FormData();
    formData.append("user_amount", negotiationData.user_amount);
    formData.append("user_price", negotiationData.user_price);
    formData.append("user_total", negotiationData.user_total);
    formData.append("buyer_turn", negotiationData.buyer_turn);
    formData.append("user_open_for_negotiation", negotiationData.user_open_for_negotiation);
    formData.append("negotiation_status", 'Approved');
    formData.append("final_amount", negotiationData.shop_amount);
    formData.append("final_price", negotiationData.shop_price);
    formData.append("final_total", negotiationData.shop_total);

    const isSuccess = await handleSubmit(formData);

    if (isSuccess) {
      navigation.navigate("Buyer Negotiation List", { screen: "Approved" });
    } else {
      alert('Failed to decline the offer. Please try again.');
    }
  }

  handleDeclineOffer = async () => {
    const formData = new FormData();
    formData.append("user_amount", negotiationData.user_amount);
    formData.append("user_price", negotiationData.user_price);
    formData.append("user_total", negotiationData.user_total);
    formData.append("buyer_turn", negotiationData.buyer_turn);
    formData.append("user_open_for_negotiation", negotiationData.user_open_for_negotiation);
    formData.append("negotiation_status", 'Cancelled');
    formData.append("final_amount", negotiationData.final_amount);
    formData.append("final_price", negotiationData.final_price);
    formData.append("final_total", negotiationData.final_total);

    const isSuccess = await handleSubmit(formData);

    if (isSuccess) {
      navigation.navigate("Buyer Negotiation List", { screen: "Cancelled" });
    } else {
      alert('Failed to decline the offer. Please try again.');
    }
  }

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/negotiations/${negotiationData.negotiation_id}`, {
        method: "PUT",
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
        body: formData,
      });

      if (response.ok) {
        return true;
      } else {
        console.error('Failed to place order:', response.statusText);
      }
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setModalVisible(false);
    }
  };

  const confirmAction = async () => {
    if (confirmationAction === "accept") {
      await handleAcceptOffer();
    } else if (confirmationAction === "decline") {
      await handleDeclineOffer();
    }
  };

  // Logic to only show "Read More" if the description is longer than 50 characters
  const shouldShowReadMore = negotiationData.crops.crop_description.length > 50;

  // Dynamic styles based on screen width and height
  const dynamicButtonPadding = width > 400 ? 'py-4' : 'py-3'; // Adjust button padding dynamically
  const dynamicImageHeight = height * 0.25; // Adjust image height to 25% of the screen height

  return (
    <SafeAreaView className="flex-1 bg-gray-50 p-4">
      <View className="flex-1">
        <View className="flex-1 justify-between">
          {/* Product Details */}
          <View className="px-1 py-1">
            <View className="border-b border-gray-300">
              <Image
                source={{ uri: negotiationData.crops.crop_image_url }}
                className="w-full object-cover rounded-lg mb-4"
                style={{ height: dynamicImageHeight }}
                resizeMode="contain"
              />
              <Text
                className={`text-lg font-semibold text-gray-800 mb-2`}
              >
                {negotiationData.crops.crop_name}
              </Text>
              <Text className="text-sm text-gray-600">
                {isReadMore
                  ? `${negotiationData.crops.crop_description.substring(
                    0,
                    50
                  )}${shouldShowReadMore ? '...' : ''}`
                  : negotiationData.crops.crop_description}
                {shouldShowReadMore && isReadMore && (
                  <Text className="text-[#00B251] font-semibold" onPress={() => setModalVisible(true)} >
                    {' '} Read More
                  </Text>
                )}
              </Text>
            </View>
          </View>

          {/* Negotiation Details */}
          {negotiationData.negotiation_status !== 'Ongoing' ? (
            <>
              <View className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white mb-5 ml-2 mt-3">
                {/* Pricing Information */}
                <View className="space-y-1 mb-4">
                  <View className="flex-row justify-between">
                    <Text className="text-lg md:text-base font-bold text-gray-700">Final Price:</Text>
                    <Text className="text-lg md:text-base text-gray-600">₱{parseFloat(negotiationData.final_price).toFixed(2)}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-lg md:text-base font-bold text-gray-700">Final Quantity:</Text>
                    <Text className="text-lg md:text-base text-gray-600">{negotiationData.final_amount} {negotiationData.metric_system.metric_system_symbol}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-lg md:text-base font-bold text-gray-700">Final Total Price:</Text>
                    <Text className="text-lg md:text-base text-gray-600">₱{parseFloat(negotiationData.final_total).toFixed(2)}</Text>
                  </View>
                </View>
              </View>
              <View className="flex-row ">
                {/* Your Offer Section */}
                <View className="flex-1 border border-white rounded-md p-4 bg-white shadow-md h-96">

                </View>
              </View>
            </>
          ) : !negotiationData.buyer_turn ? (
            <>
              <View className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white mb-5 ml-2 mt-3">
                {/* Message */}
                <Text className="text-lg md:text-xl font-semibold text-orange-600 mb-3">
                  Please wait for the seller to make a new offer, Accept, or Decline the negotiation
                </Text>

                {/* Pricing Information */}
                <View className="space-y-1 mb-4">
                  <View className="flex-row justify-between">
                    <Text className="text-lg md:text-base font-bold text-gray-700">Your Price:</Text>
                    <Text className="text-lg md:text-base text-gray-600">₱{parseFloat(negotiationData.user_price).toFixed(2)}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-lg md:text-base font-bold text-gray-700">Quantity:</Text>
                    <Text className="text-lg md:text-base text-gray-600">{negotiationData.user_amount} {negotiationData.metric_system.metric_system_symbol}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-lg md:text-base font-bold text-gray-700">Total Price:</Text>
                    <Text className="text-lg md:text-base text-gray-600">₱{parseFloat(negotiationData.user_total).toFixed(2)}</Text>
                  </View>
                </View>
              </View>
              <View className="flex-row ">
                {/* Your Offer Section */}
                <View className="flex-1 border border-white rounded-md p-4 bg-white shadow-md h-96">

                </View>
              </View>
            </>
          ) : negotiationData.shop_open_for_negotiation ? (
            <>
              <View className="flex-row space-x-4 ">
                {/* Seller Offer Section */}
                <View className=" border border-gray-300 rounded-md p-4 bg-white shadow-md">
                  <Text
                    className={`text-lg font-semibold text-gray-800 mb-2`}
                  >
                    Seller Offer:
                  </Text>
                  <Text className="text-sm text-gray-600 mt-2">
                    Price: ₱{parseFloat(negotiationData.shop_price).toFixed(2)}
                  </Text>
                  <Text className="text-sm text-gray-600 mt-9">
                    Quantity: {negotiationData.shop_amount} {negotiationData.metric_system.metric_system_symbol}
                  </Text>
                  <Text className="font-bold text-base text-black mt-7">
                    Total: ₱{negotiationData.shop_total}
                  </Text>
                </View>

                {/* Your Offer Section */}
                <View className="flex-1 border border-[#00B251] rounded-md p-4 bg-white shadow-md">
                  <Text className={`text-lg font-semibold text-gray-800 mb-2`}>
                    Your New Offer:
                  </Text>
                  <View>
                    <Text className={`text-base font-bold text-gray-800`}>
                      Quantity:
                      {amountError ? (
                        <Text className="text-sm font-bold text-red-500"> {amountError}</Text>
                      ) : null}
                    </Text>
                    <TextInput
                      className="border border-gray-300 rounded-md p-2 text-gray-800"
                      keyboardType="numeric"
                      placeholder={`${negotiationData.user_amount} ${negotiationData.metric_system.metric_system_symbol}`}
                      value={amount}
                      onChangeText={handleAmountChange}
                      style={{ fontSize: width > 400 ? 18 : 16 }}
                    />

                    <Text className={`text-base font-bold text-gray-800 mt-2`}>
                      Total Offer:
                      {priceError ? (
                        <Text className="text-sm font-bold text-red-500"> {priceError}</Text>
                      ) : null}
                    </Text>
                    <TextInput
                      className="border border-gray-300 rounded-md p-2 text-gray-800"
                      keyboardType="numeric"
                      placeholder="₱00.00"
                      placeholderTextColor="#9CA3AF"
                      value={total}
                      onChangeText={handleTotalChange}
                    />

                    <Text className={`text-base font-bold text-gray-800 mt-2`}>
                      Calculated Price per {negotiationData.metric_system.metric_system_symbol}:
                    </Text>
                    <Text className="text-xl font-bold text-[#00B251]">
                      ₱ {offerPrice || '0.00'}
                    </Text>

                    {/* New Toggle Switch */}
                    <StyledText className="text-base font-bold text-gray-800 mt-2">
                      Allow Seller to Negotiate?
                    </StyledText>
                    <StyledView className="flex-row items-center mb-4 w-full">
                      <StyledText className="text-red-700 font-bold text-base ml-12">
                        No
                      </StyledText>
                      <StyledTouchableOpacity
                        className="relative inline-flex items-center cursor-pointer ml-1"
                        onPress={toggleSwitch}
                      >

                        <StyledView
                          className={`relative w-[44px] h-[24px] rounded-full transition-colors duration-300 ${isChecked ? "bg-green-600" : "bg-gray-300"
                            }`}
                        >
                          <StyledView
                            className={`absolute top-[2px] start-[2px] h-[20px] w-[20px] rounded-full transition-transform duration-300 ${isChecked
                              ? "translate-x-[20px] bg-white"
                              : "translate-x-0 bg-gray-500"
                              }`}
                          />
                        </StyledView>
                      </StyledTouchableOpacity>
                      <StyledText className="text-green-700 font-bold text-base ml-1">
                        Yes
                      </StyledText>
                    </StyledView>

                    <TouchableOpacity
                      className={`border border-[#00B251] ${dynamicButtonPadding} rounded-md bg-[#00B251]`}
                      onPress={() => handleMakeOffer()}
                    >
                      <Text className="text-white text-center font-semibold">
                        Make Offer
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row justify-between space-x-4 mt-4">
                <TouchableOpacity
                  className={`bg-[#00B251] py-4 rounded-md flex-1`}
                  onPress={() => {
                    setConfirmationModalVisible(true);
                    setConfirmationAction("accept");
                  }}
                >
                  <Text className="text-white text-center font-semibold">
                    Accept Offer
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`bg-red-500 py-4 rounded-md flex-1`}
                  onPress={() => {
                    setConfirmationModalVisible(true);
                    setConfirmationAction("decline");
                  }}
                >
                  <Text className="text-white text-center font-semibold">
                    Decline Offer
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              {/* Closed Negotiation State */}
              <View className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white mb-5 ml-2">
                {/* Message */}
                <Text className="text-lg md:text-xl font-semibold text-red-500 mb-9">
                  The seller has chosen not to allow negotiation. Please accept or decline the offer.
                </Text>

                {/* Pricing Information */}
                <View className="space-y-1 mb-4">
                  <View className="flex-row justify-between">
                    <Text className="text-lg md:text-base font-bold text-gray-700">Seller Price:</Text>
                    <Text className="text-lg md:text-base text-gray-600">₱{parseFloat(negotiationData.shop_price).toFixed(2)}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-lg md:text-base font-bold text-gray-700">Quantity:</Text>
                    <Text className="text-lg md:text-base text-gray-600">{negotiationData.shop_amount} {negotiationData.metric_system.metric_system_symbol}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-lg md:text-base font-bold text-gray-700">Total Price:</Text>
                    <Text className="text-lg md:text-base text-gray-600">₱{parseFloat(negotiationData.shop_total).toFixed(2)}</Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row justify-between space-x-4 mt-4">
                <TouchableOpacity
                  className={`bg-[#00B251] py-4 rounded-md flex-1`}
                  onPress={() => {
                    setConfirmationModalVisible(true);
                    setConfirmationAction("accept");
                  }}
                >
                  <Text className="text-white text-center font-semibold">
                    Accept Offer
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`bg-red-500 py-4 rounded-md flex-1`}
                  onPress={() => {
                    setConfirmationModalVisible(true);
                    setConfirmationAction("decline");
                  }}
                >
                  <Text className="text-white text-center font-semibold">
                    Decline Offer
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Modal for full product description */}
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)} // Close modal on back press
          >
            <View className="flex-1 justify-center items-center bg-black/50">
              <View className="bg-white w-4/5 p-6 rounded-lg shadow-lg">
                <Text className="text-lg font-bold text-[#00B251] mb-4">
                  Product Description
                </Text>
                <ScrollView className="mb-4">
                  <Text className="text-sm text-gray-600">
                    {negotiationData.crops.crop_description}
                  </Text>
                </ScrollView>
                <TouchableOpacity
                  className={`bg-[#00B251] ${dynamicButtonPadding} rounded-md`}
                  onPress={() => setModalVisible(false)} // Close modal on press
                >
                  <Text className="text-white text-center font-semibold">
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Confirmation Modal */}
          <Modal
            visible={confirmationModalVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setConfirmationModalVisible(false)}
          >
            <View className="flex-1 justify-center items-center bg-black/50">
              <View className="bg-white w-4/5 p-6 rounded-lg shadow-lg">
                <Text className="text-lg font-bold text-gray-800 mb-4">
                  Are you sure you want to {confirmationAction === "accept" ? "accept" : "decline"} the offer?
                </Text>
                <View className="flex-row justify-between">
                  <TouchableOpacity
                    className="bg-gray-300 px-4 py-2 rounded-md mr-2 flex-1"
                    onPress={() => setConfirmationModalVisible(false)}
                  >
                    <Text className="text-center font-semibold text-gray-700">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-[#00B251] px-4 py-2 rounded-md flex-1"
                    onPress={confirmAction}
                  >
                    <Text className="text-white text-center font-semibold">
                      Confirm
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NegotiationBuyerScreen;
