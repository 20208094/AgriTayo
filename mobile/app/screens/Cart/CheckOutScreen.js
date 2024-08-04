import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NotificationIcon, MessagesIcon } from "../../components/SearchBarC";
import { styled } from "nativewind";
import GoBack from "../../components/GoBack";

// Styled components
const Container = styled(View, "flex-1 bg-gray-100 p-4");
const Header = styled(View, "flex-row justify-between items-center mb-4");
const HeaderTitle = styled(Text, "text-2xl font-bold text-[#50d71e]");
const ItemContainer = styled(View, "bg-white p-4 my-2 rounded-lg shadow");
const ItemTitle = styled(Text, "text-lg font-bold text-gray-800");
const ItemDetails = styled(Text, "text-base text-gray-600");
const TotalContainer = styled(View, "mt-4 p-4 bg-white rounded-lg shadow");
const TotalText = styled(Text, "text-lg font-bold text-gray-800");
const CompleteButton = styled(
  TouchableOpacity,
  "bg-[#50d71e] py-3 rounded-lg justify-center items-center mt-4"
);
const CompleteButtonText = styled(Text, "text-lg font-bold text-white");

function CheckOutScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { checkedOutItems } = route.params || { checkedOutItems: [] }; // Receive checked-out items from navigation params

  const renderItem = ({ item }) => (
    <ItemContainer>
      <ItemTitle>{item.title}</ItemTitle>
      <ItemDetails>Price: ₱ {item.price.toFixed(2)}</ItemDetails>
      <ItemDetails>Quantity: {item.quantity}</ItemDetails>
    </ItemContainer>
  );

  // Calculate total price
  const totalPrice = checkedOutItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100 mt-8">
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

        <FlatList
          data={checkedOutItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ flexGrow: 1, marginBottom: 16 }}
        />

        <TotalContainer>
          <TotalText>Total Price: ₱ {totalPrice.toFixed(2)}</TotalText>
        </TotalContainer>

        <CompleteButton onPress={() => alert("Order Completed")}>
          <CompleteButtonText>Complete Order</CompleteButtonText>
        </CompleteButton>
      </Container>
    </SafeAreaView>
  );
}

export default CheckOutScreen;
