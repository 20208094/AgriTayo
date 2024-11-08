import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Switch,
  Modal,
} from "react-native";
import logo from "../../../assets/logo.png";
import { styled } from "nativewind";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";

const StyledSafeAreaView = styled(SafeAreaView);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);
const StyledModal = styled(Modal);

function NegotiationBuyerScreen({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [total, setTotal] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { product } = route.params;
  const toggleSwitch = () => setIsChecked(!isChecked);
  const [userData, setUserData] = useState([]);

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
    const priceNum = parseFloat(price) || 0;
    const amountNum = parseFloat(amount) || 0;
    setTotal((priceNum * amountNum).toFixed(2));
  }, [price, amount]);

  const handleSubmit = () => {
    setConfirmationModalVisible(true);
  };

  const handleCreateNegotiation = async (negotiationDetails) => {
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

      // Log the response status for debugging
      console.log('API response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Negotiation placed successfully. Response:', result);
        // alert('Negotiation placed successfully!');
        // Only set modal visible after success
        setModalVisible(true);
      } else {
        const errorResponse = await response.text(); // Capture the response body
        console.error('Failed to place negotiation. Status:', response.status, 'Status Text:', response.statusText);
        console.error('Error response from server:', errorResponse);
        setAlertMessage('Failed to place negotiation. Please try again.');
        setAlertVisible(true);
      }
    } catch (error) {
      // Log the full error object for better debugging
      console.error('Error placing negotiation:', error);
      setAlertMessage('Network error. Please try again later.');
      setAlertVisible(true);
    } finally {
      console.log('Finished handling negotiation bid, closing confirmation modal.');
      setConfirmationModalVisible(false); // Close the confirmation modal after request
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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading Bid...</Text>
      </View>
    );
  }

  return (
    <StyledSafeAreaView className="flex-1 p-5 bg-white">
      {/* Product Info */}
      <StyledView className="mb-3 items-center">
        <Image
          source={{ uri: product.crop_image_url }}
          className="w-40 h-40"
        />
        <StyledText className="text-lg font-bold mt-4 text-black">
          Product: {product.crop_name}
        </StyledText>
        <StyledText className="text-sm text-gray-600">
          Description: {product.crop_description}
        </StyledText>
        <StyledText className="text-sm text-gray-600">
          Product Price: {product.crop_price}
        </StyledText>
        <StyledText className="text-sm text-gray-600">
          Measurement unit: {product.metric_system_symbol}
        </StyledText>
      </StyledView>

      <StyledView className="mb-4">
        <StyledText className=" text-black ml-1">
          Enter the Price:
        </StyledText>
        <StyledTextInput
          className={`border border-[#00B251] rounded-lg p-3 text-black`}
          keyboardType="numeric"
          placeholder="₱00.00"
          value={price}
          onChangeText={setPrice}
        />
        <StyledText className=" mt-2 text-black ml-1">
          Enter the Quantity:
        </StyledText>
        <StyledTextInput
          className={`border border-[#00B251] rounded-lg p-3 text-black`}
          keyboardType="numeric"
          placeholder="0"
          value={amount}
          onChangeText={setAmount}
        />
      </StyledView>

      {/* Total */}
      <StyledText className="text-lg font-bold mb-4 text-black">
        Total: ₱ {total}
      </StyledText>

      {/* New Toggle Switch */}
      <StyledView className="flex-row items-center mb-4">
        <StyledText className="text-lg font-bold text-black">
          Open for Negotiation:
        </StyledText>
        <StyledText className="text-red-700 font-bold text-base ml-3">
          No
        </StyledText>
        <StyledTouchableOpacity
          className="relative inline-flex items-center cursor-pointer ml-1"
          onPress={toggleSwitch}
        >

          <StyledView
            className={`relative w-[44px] h-[24px] rounded-full transition-colors duration-300 ${isChecked ? "bg-green-600" : "bg-gray-200"
              }`}
          >
            <StyledView
              className={`absolute top-[2px] start-[2px] h-[20px] w-[20px] rounded-full transition-transform duration-300 ${isChecked
                ? "translate-x-[20px] bg-white"
                : "translate-x-0 bg-gray-400"
                }`}
            />
          </StyledView>
        </StyledTouchableOpacity>
        <StyledText className="text-green-700 font-bold text-base ml-1">
          Yes
        </StyledText>
      </StyledView>

      {/* Submit Button */}
      <StyledTouchableOpacity
        className={`rounded-lg p-4 bg-green-600 `}
        onPress={handleSubmit}
      >
        <StyledText className="text-center text-white font-bold">
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
              onPress={() => setModalVisible(false)}
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
    </StyledSafeAreaView>
  );
}

export default NegotiationBuyerScreen;
