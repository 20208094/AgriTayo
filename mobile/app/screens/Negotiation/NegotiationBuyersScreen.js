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
import logo from "../../assets/logo.png";
import { styled } from "nativewind";

const dummyNegotiation = [
  {
    id: 1,
    productImage: logo,
    productName: "Patatas",
    productDescription: "Patatas masarap",
    productPrice: 10.0,
  },
];

const StyledSafeAreaView = styled(SafeAreaView);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);
const StyledModal = styled(Modal);

function NegotiationBuyerScreen({ navigation }) {
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [total, setTotal] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [isChecked, setIsChecked] = useState(false); // State for toggle (checked or not)

  const toggleSwitch = () => setIsChecked(!isChecked); // Toggle functionalit

  useEffect(() => {
    const priceNum = parseFloat(price) || 0;
    const amountNum = parseFloat(amount) || 0;
    setTotal((priceNum * amountNum).toFixed(2));
  }, [price, amount]);

  const handleSubmit = () => {
    setConfirmationModalVisible(true); // Show "Are you sure?" modal
  };

  const handleConfirmYes = () => {
    setConfirmationModalVisible(false); // Close "Are you sure?" modal
    setModalVisible(true); // Show "Negotiation Successful!" modal
  };

  return (
    <StyledSafeAreaView className="flex-1 p-5 bg-white">
      {/* Product Info */}
      <StyledView className="mb-6 items-center">
        <Image
          source={dummyNegotiation[0].productImage}
          className="w-40 h-40"
        />
        <StyledText className="text-lg font-bold mt-4 text-black">
          Product: {dummyNegotiation[0].productName}
        </StyledText>
        <StyledText className="text-sm text-gray-600">
          Description: {dummyNegotiation[0].productDescription}
        </StyledText>
        <StyledText className="text-sm text-gray-600">
          Product Price: {dummyNegotiation[0].productPrice}
        </StyledText>
      </StyledView>

      <StyledView className="mb-4">
        <StyledTextInput
          className={`border border-[#00B251] rounded-lg p-3 text-black`}
          keyboardType="numeric"
          placeholder="Enter the price"
          value={price}
          onChangeText={setPrice}
        />
        <StyledTextInput
          className={`border border-[#00B251] rounded-lg p-3 mt-3 text-black`}
          keyboardType="numeric"
          placeholder="Enter the amount"
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
          Open for:
        </StyledText>
        <StyledTouchableOpacity
          className="relative inline-flex items-center cursor-pointer ml-4"
          onPress={toggleSwitch}
        >
          <StyledView
            className={`relative w-[44px] h-[24px] rounded-full transition-colors duration-300 ${
              isChecked ? "bg-green-600" : "bg-gray-200"
            }`}
          >
            <StyledView
              className={`absolute top-[2px] start-[2px] h-[20px] w-[20px] rounded-full transition-transform duration-300 ${
                isChecked
                  ? "translate-x-[20px] bg-white"
                  : "translate-x-0 bg-gray-400"
              }`}
            />
          </StyledView>
        </StyledTouchableOpacity>
        <StyledText className="text-lg font-bold text-black">
          {" "}
          Negotiation
        </StyledText>
      </StyledView>

      {/* Submit Button */}
      <StyledTouchableOpacity
        className={`rounded-lg p-4 bg-green-600 `}
        onPress={handleSubmit}
      >
        <StyledText className="text-center text-white font-bold">
          Create Negotiate
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
    </StyledSafeAreaView>
  );
}

export default NegotiationBuyerScreen;
