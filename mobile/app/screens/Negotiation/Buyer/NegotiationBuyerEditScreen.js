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

const { width, height } = Dimensions.get('window');

const NegotiationBuyerScreen = ({route}) => {
  const [offerPrice, setOfferPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [total, setTotal] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [isReadMore, setIsReadMore] = useState(true);
  const { data: negotiationData } = route.params;

  // Effect to calculate the total price dynamically
  useEffect(() => {
    const priceNum = parseFloat(offerPrice) || 0;
    const amountNum = parseFloat(amount) || 0;
    setTotal((priceNum * amountNum).toFixed(2));
  }, [offerPrice, amount]);
  
  handleMakeOffer = () => {
    updatedNegotiation = {}
    updatedNegotiation.user_amount = amount;
    updatedNegotiation.user_price = offerPrice;
    updatedNegotiation.user_total = total;
    updatedNegotiation.buyer_turn = false;

    // handleSubmit(updatedNegotiation);
  }
  
  handleAcceptOffer = () => {
    updatedNegotiation = {}
    updatedNegotiation.negotiation_status = 'Approved';
    updatedNegotiation.final_amount = negotiationData.shop_amount;
    updatedNegotiation.final_price = negotiationData.shop_price;
    updatedNegotiation.final_total = negotiationData.shop_total;

    // handleSubmit(updatedNegotiation);
  }
  
  handleDeclineOffer = () => {
    updatedNegotiation = {}
    updatedNegotiation.negotiation_status = 'Cancelled';

    // handleSubmit(updatedNegotiation);
  }

  const handleSubmit = async (updatedNegotiation) => {
    try {
      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/negotiations/${negotiationData.negotiation_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': REACT_NATIVE_API_KEY,
        },
        body: JSON.stringify(updatedNegotiation),
      });

      if (response.ok) {
        navigation.navigate("Orders", { screen: "To Confirm" })
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
  
  // Logic to only show "Read More" if the description is longer than 50 characters
  const shouldShowReadMore = negotiationData.crops.crop_description.length > 50;

  // Dynamic styles based on screen width and height
  const dynamicTextSize = width > 400 ? 'text-lg' : 'text-base'; // Adjust font size based on screen size
  const dynamicButtonPadding = width > 400 ? 'py-4' : 'py-3'; // Adjust button padding dynamically
  const dynamicImageHeight = height * 0.25; // Adjust image height to 25% of the screen height

  return (
    <SafeAreaView className="flex-1 bg-gray-50 p-4">
      <View className="flex-1">
        <View className="flex-1 justify-between">
          {/* Product Details */}
          <View className="px-1 py-1">
            <View className="border-b border-gray-300 pb-4 mb-1">
              <Image
                source={{ uri: negotiationData.crops.crop_image_url }}
                className="w-full object-cover rounded-lg mb-4"
                style={{ height: dynamicImageHeight }}
                resizeMode="contain"
              />
              <Text
                className={`${dynamicTextSize} font-semibold text-gray-800 mb-2`}
              >
                {negotiationData.crops.crop_name}
              </Text>
              <Text className="text-sm text-gray-600 mb-2">
                {isReadMore
                  ? `${negotiationData.crops.crop_description.substring(
                      0,
                      50
                    )}${shouldShowReadMore ? '...' : ''}`
                  : negotiationData.crops.crop_description}
                {shouldShowReadMore && isReadMore && (
                  <Text
                    className="text-[#00B251] font-semibold"
                    onPress={() => setModalVisible(true)} // Set modalVisible to true
                  >
                    {' '}
                    Read More
                  </Text>
                )}
              </Text>
              <Text
                className={`${dynamicTextSize} font-bold text-[#00B251]`}
              >
                ₱{negotiationData.crops.crop_price}
              </Text>
            </View>
          </View>

          {/* Negotiation Details */}
          {negotiationData.shop_open_for_negotiation ? (
            <>
              <View className="flex-row justify-between space-x-4 mt-1">
                {/* Seller Offer Section */}
                <View className="flex-1 border border-gray-300 rounded-md p-4 bg-white shadow-md">
                  <Text
                    className={`${dynamicTextSize} font-semibold text-gray-800 mb-2`}
                  >
                    Seller Offer
                  </Text>
                  <Text className="text-sm text-gray-600 mt-2">
                    Price: ₱{negotiationData.crops.crop_price}
                  </Text>
                  <Text className="text-sm text-gray-600 mt-9">
                    Amount: {negotiationData.user_amount}
                  </Text>
                  <Text className="font-bold text-lg text-black mt-7">
                    Total: ₱{negotiationData.final_total}
                  </Text>
                </View>

                {/* Your Offer Section */}
                <View className="flex-1 border border-[#00B251] rounded-md p-4 bg-white shadow-md">
                  <Text
                    className={`${dynamicTextSize} font-semibold text-gray-800 mb-2`}
                  >
                    Your Offer
                  </Text>
                  <View className="space-y-4">
                    <TextInput
                      className="border border-gray-300 rounded-md p-2 text-gray-800"
                      keyboardType="numeric"
                      placeholder={`Price: ₱${negotiationData.user_price}`}
                      value={offerPrice}
                      onChangeText={setOfferPrice}
                      style={{ fontSize: width > 400 ? 18 : 16 }} // Adjust font size based on screen width
                    />
                    <TextInput
                      className="border border-gray-300 rounded-md p-2 text-gray-800"
                      keyboardType="numeric"
                      placeholder={`Amount: ${negotiationData.user_amount}`}
                      value={amount}
                      onChangeText={setAmount}
                      style={{ fontSize: width > 400 ? 18 : 16 }} // Adjust font size
                    />
                    <Text
                      className={`${dynamicTextSize} font-bold text-gray-800`}
                    >
                      Total: ₱{total}
                    </Text>
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
                  className={`bg-[#00B251] ${dynamicButtonPadding} rounded-md flex-1`}
                  onPress={() => handleAcceptOffer()}
                >
                  <Text className="text-white text-center font-semibold">
                    Accept Offer
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`bg-red-500 ${dynamicButtonPadding} rounded-md flex-1`}
                  onPress={() => handleDeclineOffer()}
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
              <View className="border-b border-gray-300 pb-4 ml-2 mb-5">
                <Text className="text-lg md:text-xl font-semibold text-red-600 mb-2">
                  Negotiation Closed
                </Text>
                <Text className="text-sm md:text-base text-gray-600 mb-2">
                  Seller Price: ₱{negotiationData.crops.crop_price}
                </Text>
                <Text className="text-sm md:text-base text-gray-600 mb-2">
                  Your Offer: ₱{negotiationData.user_price}
                </Text>
                <Text className="text-sm md:text-base text-gray-600">
                  Total Amount: ₱{negotiationData.final_total}
                </Text>
              </View>

              {/* Action Buttons */}
              <View className="flex-row justify-between space-x-4 mb-40">
                <TouchableOpacity
                  className={`bg-[#00B251] ${dynamicButtonPadding} rounded-md flex-1`}
                  onPress={() => {
                    /* Handle acceptance */
                  }}
                >
                  <Text className="text-white text-center font-semibold">
                    Accept
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`bg-red-500 ${dynamicButtonPadding} rounded-md flex-1`}
                  onPress={() => {
                    /* Handle decline */
                  }}
                >
                  <Text className="text-white text-center font-semibold">
                    Decline
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
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NegotiationBuyerScreen;
