import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Modal,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NotificationIcon, MessagesIcon } from "../../components/SearchBarC";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Add vector icons
import { styled } from "nativewind";
import GoBack from "../../components/GoBack";

// Styled components
const ScreenContainer = styled(SafeAreaView, "flex-1 bg-gray-100 mt-8");
const Container = styled(View, "flex-1 bg-gray-100 p-4");
const Header = styled(View, "flex-row justify-between items-center mb-4");
const HeaderTitle = styled(Text, "text-2xl font-bold text-[#00b251]");
const ItemContainer = styled(View, "bg-white p-4 my-2 rounded-lg shadow");
const ItemTitle = styled(Text, "text-lg font-bold text-gray-800");
const ItemDetails = styled(Text, "text-base text-gray-600");
const TotalContainer = styled(View, "mt-4 p-4 bg-white rounded-lg shadow");
const TotalText = styled(Text, "text-lg font-bold text-gray-800");
const CompleteButton = styled(
  TouchableOpacity,
  "bg-[#00b251] py-3 rounded-lg justify-center items-center mt-4"
);
const CompleteButtonText = styled(Text, "text-lg font-bold text-white");
const EmptyText = styled(Text, "text-center text-gray-500 mt-4");

const ModalContainer = styled(View, "flex-1 justify-center items-center bg-[#00000080]");
const ModalContent = styled(View, "w-3/4 bg-white p-6 rounded-lg shadow-lg");
const PaymentOptionButton = styled(TouchableOpacity, "flex-row items-center bg-[#00b251] p-3 rounded-lg mt-4");
const PaymentOptionText = styled(Text, "text-center text-lg font-bold text-white flex-1");

function CheckOutScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { checkedOutItems } = route.params || { checkedOutItems: [] };
  const [modalVisible, setModalVisible] = useState(false);

  const renderItem = ({ item }) => (
    <ItemContainer>
      <ItemTitle>{item.title}</ItemTitle>
      <ItemDetails>Price: ₱ {item.price.toFixed(2)}</ItemDetails>
      <ItemDetails>Quantity: {item.quantity}</ItemDetails>
    </ItemContainer>
  );

  const totalPrice = checkedOutItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCompleteOrder = () => {
    setModalVisible(true);
  };

  const handlePaymentOption = (option) => {
    setModalVisible(false);
    alert(`Selected Payment Method: ${option}`);
    // Add further logic here to process payment
  };

  return (
    <ScreenContainer>
      <Container>
        <Header>
          <TouchableOpacity
            onPress={() => navigation.navigate("Notifications")}
          >
            <NotificationIcon />
          </TouchableOpacity>
          <HeaderTitle>Checkout</HeaderTitle>
          <TouchableOpacity onPress={() => navigation.navigate("Messages")}>
            <MessagesIcon />
          </TouchableOpacity>
        </Header>

        {checkedOutItems.length > 0 ? (
          <FlatList
            data={checkedOutItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ flexGrow: 1, marginBottom: 16 }}
          />
        ) : (
          <EmptyText>No items in your cart</EmptyText>
        )}

        <TotalContainer>
          <TotalText>Total Price: ₱ {totalPrice.toFixed(2)}</TotalText>
        </TotalContainer>

        <CompleteButton onPress={handleCompleteOrder}>
          <CompleteButtonText>Complete Order</CompleteButtonText>
        </CompleteButton>
      </Container>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <ModalContainer>
          <ModalContent>
            <Text className="text-center text-xl font-bold mb-4">Choose Payment Method</Text>

            {/* Cash on Delivery (COD) Option */}
            <PaymentOptionButton onPress={() => handlePaymentOption("COD")}>
              <Icon name="truck" size={24} color="white" />
              <PaymentOptionText>Cash on Delivery (COD)</PaymentOptionText>
            </PaymentOptionButton>

            {/* G-Cash Option */}
            <PaymentOptionButton onPress={() => handlePaymentOption("G-Cash")}>
              <Icon name="wallet" size={24} color="white" />
              <PaymentOptionText>G-Cash</PaymentOptionText>
            </PaymentOptionButton>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </ScreenContainer>
  );
}

export default CheckOutScreen;
