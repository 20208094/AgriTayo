import React from "react";
import { View, Text, FlatList, Dimensions, TouchableOpacity } from "react-native";
import { Swipeable } from 'react-native-gesture-handler';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

const { width } = Dimensions.get("window");

function CartScreen() {
  const cartItems = [
    { id: 1, title: "Cart Item 1", price: 10.0 },
    { id: 2, title: "Cart Item 2", price: 20.0 },
    { id: 3, title: "Cart Item 3", price: 30.0 },
  ];

  const renderItem = ({ item }) => {
    let swipeableRef = null;

    const renderRightActions = (progress, dragX) => {
      const deleteItem = () => {
        // Implement deletion logic here
        alert(`Deleting item: ${item.title}`);
        swipeableRef.close();
      };

      return (
        <StyledView className="flex-row">
          <TouchableOpacity onPress={deleteItem} style={{ backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', width: 80 }}>
            <StyledText className="text-white font-bold">Delete</StyledText>
          </TouchableOpacity>
        </StyledView>
      );
    };

    return (
      <Swipeable
        ref={(ref) => { swipeableRef = ref; }}
        renderRightActions={renderRightActions}
        overshootRight={false}
      >
        <StyledView className="my-2 mx-2.5">
          <StyledView className="bg-white rounded-lg shadow">
            <StyledView className="p-4">
              <StyledText className="text-lg font-medium mb-1 text-gray-800">{item.title}</StyledText>
              <StyledText className="text-base text-gray-600">₱ {item.price.toFixed(2)}</StyledText>
            </StyledView>
          </StyledView>
        </StyledView>
      </Swipeable>
    );
  };

  return (
    <StyledView className="flex-1 bg-gray-100 p-2.5">
      <StyledText className="text-2xl font-bold my-5 mx-2.5 text-gray-800">Cart</StyledText>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
    </StyledView>
  );
}

export default CartScreen;
