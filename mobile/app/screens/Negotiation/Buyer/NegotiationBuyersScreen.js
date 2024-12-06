import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Switch,
  Modal, ScrollView
} from "react-native";
import logo from "../../../assets/logo.png";
import { styled } from "nativewind";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";
import placeholderimg from "../../../assets/placeholder.png"

const StyledSafeAreaView = styled(SafeAreaView);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);
const StyledModal = styled(Modal);

const PRICE_REGEX = /^(?:[1-9]\d*|\d+\.\d{1,2}|0\.\d{1,2})$/;
const QUANTITY_REGEX = /^[1-9]\d*$/;

function NegotiationBuyerScreen({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [total, setTotal] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const { product } = route.params;
  const toggleSwitch = () => setIsChecked(!isChecked);
  const [userData, setUserData] = useState([]);

  const [quantityError, setQuantityError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const getAsyncUserData = async () => {
    setLoading(true);
    try {
      const storedData = await AsyncStorage.getItem('userData');

      if (storedData) {
        const parsedData = JSON.parse(storedData);

        if (Array.isArray(parsedData)) {
          const user = parsedData[0];
          setUserData(user);
        } else {
          setUserData(parsedData);
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
    }, [])
  );


  useEffect(() => {
    const amountNum = parseFloat(amount) || 0;
    const totalNum = parseFloat(total) || 0;

    if (amountNum > 0 && totalNum > 0) {
      const calculatedPrice = (totalNum / amountNum).toFixed(2);
      setPrice(calculatedPrice);
    } else {
      setPrice('0.00');
    }
  }, [total, amount]);

  useEffect(() => {
    if (amount === '') {
      setQuantityError('');
      setPrice('0.00');
      return;
    }

    if (!QUANTITY_REGEX.test(amount)) {
      setQuantityError('Please enter a valid whole number greater than 0');
      return;
    }

    const numericValue = parseInt(amount, 10);

    if (numericValue > product.crop_quantity) {
      setQuantityError(`Quantity cannot exceed available stock (${product.crop_quantity})`);
      return;
    }

    if (numericValue < product.minimum_negotiation) {
      setQuantityError(`Minimum quantity for negotiation is ${product.minimum_negotiation}`);
      return;
    }

    setQuantityError('');
  }, [amount, product.crop_quantity, product.minimum_negotiation]);

  useEffect(() => {
    if (total === '') {
      setPriceError('');
      setPrice('0.00');
      return;
    }

    if (!PRICE_REGEX.test(total)) {
      setPriceError('Please enter a valid amount (e.g., 100 or 100.50)');
      return;
    }

    if (parseFloat(price) <= (product.crop_price * 0.7)) {
      setPriceError(`Minimum price per ${product.metric.metric_system_symbol}: ₱${(product.crop_price * 0.7).toFixed(2)} (70% of ₱${product.crop_price})`);
      return;
    }

    if (parseFloat(price) >= (product.crop_price * 1.3)) {
      setPriceError(`Maximum price per ${product.metric.metric_system_symbol}: ₱${(product.crop_price * 1.3).toFixed(2)} (130% of ₱${product.crop_price})`);
      return;
    }

    setPriceError('');
  }, [total, price, product.crop_price, product.metric.metric_system_symbol]);

  const handleSubmit = () => {
    // Check for empty fields
    if (!amount || !total) {
      setAlertMessage("Please fill in all required fields (Quantity and Total Offer)");
      setAlertVisible(true);
      return;
    }

    // Check for validation errors
    if (quantityError || priceError) {
      setAlertMessage("Please fix the validation errors before proceeding");
      setAlertVisible(true);
      return;
    }

    // If all validations pass, show confirmation modal
    setConfirmationModalVisible(true);
  };

  const handleCreateNegotiation = async (negotiationDetails) => {
    // Validate required fields again before API call
    if (!negotiationDetails.user_amount || !negotiationDetails.user_total) {
      setAlertMessage("Missing required fields. Please fill in all information.");
      setAlertVisible(true);
      setConfirmationModalVisible(false);
      return;
    }

    console.log('Initiating API call to create negotiation with details:', negotiationDetails);

    try {
      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/negotiations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': REACT_NATIVE_API_KEY,
        },
        body: JSON.stringify(negotiationDetails),
      });

      console.log('API response status:', response.status);

      if (response.ok) {
        navigation.pop();
        navigation.navigate("Buyer Negotiation List");
      } else {
        const errorResponse = await response.json(); // Changed from response.text()
        console.error('Failed to place negotiation. Status:', response.status, 'Status Text:', response.statusText);
        console.error('Error response from server:', errorResponse);
        setAlertMessage(errorResponse.error || 'Failed to place negotiation. Please try again.');
        setAlertVisible(true);
      }
    } catch (error) {
      console.error('Error placing negotiation:', error);
      setAlertMessage('Network error. Please try again later.');
      setAlertVisible(true);
    } finally {
      setConfirmationModalVisible(false);
    }
  };

  const handleConfirmYes = () => {
    const negotiationDetails = {
      user_id: userData.user_id,
      shop_id: product.shop_id,
      crop_id: product.crop_id,
      metric_system_id: product.metric_system_id,
      user_price: parseFloat(price),
      user_amount: parseFloat(amount),
      user_total: parseFloat(total),
      user_open_for_negotiation: isChecked,
      shop_number: product.shop.shop_number,
      crop_name: product.crop_name,
    };

    handleCreateNegotiation(negotiationDetails);
  };

  const handleAmountChange = (text) => {
    setAmount(text);
  };

  const handleTotalChange = (text) => {
    let formattedText = text;
    if (text.startsWith('.')) {
      formattedText = `0${text}`;
    }

    const parts = formattedText.split('.');
    if (parts[1] && parts[1].length > 2) {
      formattedText = `${parts[0]}.${parts[1].slice(0, 2)}`;
    }

    setTotal(formattedText);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading Bid...</Text>
      </View>
    );
  }

  return (
    <StyledSafeAreaView className="flex-1 px-5 py-2 bg-white ">
      <ScrollView className="">
        {/* Product Info */}
        <StyledView className="mx-1 mb-2 p-3 bg-white rounded-lg shadow-lg border-2 border-green-600">
          <View className="w-full overflow-hidden rounded-2xl border-2 border-green-600">
            <Image
              source={product.crop_image_url ? { uri: product.crop_image_url } : placeholderimg}
              className="w-full h-40"
              resizeMode="cover"
            />

          </View>

          {/* Product Name */}
          <StyledText className="text-2xl text-center font-extrabold text-[#00b251] tracking-wide mt-1">
            {product.crop_name}
          </StyledText>

          {/* Description */}
          <Text className="text-lg font-semibold text-gray-800 mb-1">Description:</Text>
          <Text className="text-base text-gray-600 leading-relaxed ml-4">
            {product.crop_description}
          </Text>

          {/* Price */}
          <Text className="text-lg font-semibold text-gray-800 mt-1">Original Price per Unit:</Text>
          <Text className="text-lg font-bold text-[#00B251] ml-4">
            ₱{parseFloat(product.crop_price).toFixed(2)}/{product.metric.metric_system_symbol}
          </Text>

          {/* Available */}
          <Text className="text-lg font-semibold text-gray-800 mt-1">Available Quantity:</Text>
          <Text className="text-lg font-bold text-[#00B251] ml-4">
            {product.crop_quantity} {product?.metric?.metric_system_symbol || 'unit'}/s
          </Text>
        </StyledView>

        {/* Price and Quantity Input */}
        <StyledView className="mx-1 mb-2 p-3 py-2 bg-white rounded-lg shadow-lg border-2 border-green-600">
          <StyledView className="pb-3 mx-2">
            <View>
              {/* Quantity Section */}
              <View className="mb-2">
                <StyledText className="text-lg font-medium text-gray-800">
                  Desired quantity in {product?.metric?.metric_system_symbol || 'unit'}:
                </StyledText>
                {quantityError && (
                  <Text className="text-red-500 text-sm mt-1">
                    {quantityError}
                  </Text>
                )}
                <StyledTextInput
                  className="border-2 text-lg border-[#00B251] rounded-lg p-3 text-gray-600 mt-2"
                  keyboardType="numeric"
                  placeholder="0"
                  value={amount}
                  onChangeText={handleAmountChange}
                />
              </View>

              {/* Total Offer Section */}
              <View className="mb-2">
                <StyledText className="text-lg font-medium text-gray-800">
                  Price you want to offer:
                </StyledText>
                <StyledText className="text-sm text-gray-600 mt-1">
                  Minimum price per {product.metric.metric_system_symbol}: ₱{(product.crop_price * 0.7).toFixed(2)} (70% of ₱{product.crop_price})
                </StyledText>
                <StyledText className="text-sm text-gray-600">
                  Maximum price per {product.metric.metric_system_symbol}: ₱{(product.crop_price * 1.3).toFixed(2)} (130% of ₱{product.crop_price})
                </StyledText>
                <StyledText className="text-sm text-gray-600 mt-1">
                  You can offer between ₱{(product.crop_price * amount * 0.7).toFixed(2)} to ₱{(product.crop_price * amount * 1.3).toFixed(2)} for {amount} {product.metric.metric_system_symbol}
                </StyledText>
                {priceError && (
                  <Text className="text-red-500 text-sm mt-1">
                    {priceError}
                  </Text>
                )}
                <StyledTextInput
                  className="border-2 text-lg border-[#00B251] rounded-lg p-3 text-gray-600 mt-2"
                  keyboardType="numeric"
                  placeholder="₱00.00"
                  value={total}
                  onChangeText={handleTotalChange}
                />
              </View>

              <StyledText className="text-lg font-medium text-gray-800 mt-2 border-t-2 border-gray-500">
                Calculated Price per {product.metric.metric_system_name}:
              </StyledText>
              <StyledText className="text-lg font-bold text-[#00B251]">
                ₱ {price || '0.00'}
              </StyledText>
            </View>
          </StyledView>
        </StyledView>


        {/* Submit Button */}
        <StyledTouchableOpacity
          className={`rounded-lg p-3 bg-green-600 `}
          onPress={handleSubmit}
        >
          <StyledText className="text-center text-xl text-white font-bold">
            Create Negotiation
          </StyledText>
        </StyledTouchableOpacity>

        {/* Are you sure? Confirmation Modal */}
        <StyledModal
          animationType="slide"
          transparent={true}
          visible={confirmationModalVisible}
          onRequestClose={() => setConfirmationModalVisible(false)}
        >
          <StyledView className="flex-1 justify-center items-center bg-black/50">
            <StyledView className="w-4/5 p-6 bg-white rounded-lg shadow-lg items-center">
              <StyledText className="text-xl font-bold text-black mb-4">
                Are you sure?
              </StyledText>
              <StyledText className="text-base text-gray-600 mb-6">
                Do you want to proceed with this negotiation?
              </StyledText>
              <StyledView className="flex-row justify-between w-full">
                <StyledTouchableOpacity
                  className="flex-1 mr-2 bg-gray-300 p-4 rounded-lg"
                  onPress={() => setConfirmationModalVisible(false)}
                >
                  <StyledText className="text-center text-black font-bold">
                    No
                  </StyledText>
                </StyledTouchableOpacity>
                <StyledTouchableOpacity
                  className="flex-1 ml-2 bg-green-600 p-4 rounded-lg"
                  onPress={handleConfirmYes}
                >
                  <StyledText className="text-center text-white font-bold">
                    Yes
                  </StyledText>
                </StyledTouchableOpacity>
              </StyledView>
            </StyledView>
          </StyledView>
        </StyledModal>

        {/* Success Modal */}
        <StyledModal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}
        >
          <StyledView className="flex-1 justify-center items-center bg-black/50">
            <StyledView className="w-4/5 p-6 bg-white rounded-lg shadow-lg items-center">
              <StyledText className="text-xl font-bold text-green-600 mb-4">
                Negotiation Successful!
              </StyledText>
              <StyledText className="text-base text-gray-600 mb-6">
                You have successfully negotiated. The seller will review your
                offer.
              </StyledText>
              <StyledTouchableOpacity
                className="w-full bg-green-600 p-4 rounded-lg"
                onPress={() => navigation.navigate("Buyer Negotiation List") && setModalVisible(false)}
              >
                <StyledText className="text-center text-white font-bold">
                  Okay
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          </StyledView>
        </StyledModal>
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
      </ScrollView>
    </StyledSafeAreaView>
  );
}

export default NegotiationBuyerScreen;
