import React, { useState } from "react";
import { View, Text, FlatList, Dimensions, TouchableOpacity, Image, Alert, Modal } from "react-native";
import CheckBox from 'react-native-check-box';
import deleteButton from "../../assets/delete.png";
import editButton from "../../assets/edit.png";
import placeholderImage from "../../assets/placeholder.png"; // Placeholder image for item
import { Swipeable } from 'react-native-gesture-handler';
import { styled } from 'nativewind';
import { useNavigation } from "@react-navigation/native";

const StyledView = styled(View);
const StyledText = styled(Text);

const { width } = Dimensions.get("window");

function CartScreen() {
  const navigation = useNavigation();
  const initialShops = [
    {
      id: 1,
      name: "Shop 1",
      items: [
        { id: 1, title: "Shop 1 Item 1", price: 10.0, quantity: 1, selected: false },
        { id: 2, title: "Shop 1 Item 2", price: 20.0, quantity: 1, selected: false },
      ],
    },
    {
      id: 2,
      name: "Shop 2",
      items: [
        { id: 3, title: "Shop 2 Item 1", price: 30.0, quantity: 1, selected: false },
        { id: 4, title: "Shop 2 Item 2", price: 40.0, quantity: 1, selected: false },
      ],
    },
    {
      id: 3,
      name: "Shop 3",
      items: [
        { id: 5, title: "Shop 3 Item 1", price: 50.0, quantity: 1, selected: false },
        { id: 6, title: "Shop 3 Item 2", price: 60.0, quantity: 1, selected: false },
      ],
    },
  ];

  const [shops, setShops] = useState(initialShops);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const toggleShopSelection = (shopIndex) => {
    const updatedShops = shops.map((shop, sIndex) => {
      if (sIndex === shopIndex) {
        const areAllItemsSelected = shop.items.every(item => item.selected);
        const updatedItems = shop.items.map(item => ({ ...item, selected: !areAllItemsSelected }));
        return { ...shop, items: updatedItems };
      }
      return shop;
    });
    setShops(updatedShops);
  };

  const renderItem = ({ item, shopIndex, itemIndex }) => {
    let swipeableRef = null;

    const deleteItem = () => {
      Alert.alert("Delete Item", `Deleting item: ${item.title}`);
      swipeableRef.close();
      const updatedShops = shops.map((shop, sIndex) => {
        if (sIndex === shopIndex) {
          const updatedItems = shop.items.filter((_, iIndex) => iIndex !== itemIndex);
          return { ...shop, items: updatedItems };
        }
        return shop;
      });
      setShops(updatedShops);
    };

    const editItem = () => {
      Alert.alert("Edit Item", `Editing item: ${item.title}`);
      swipeableRef.close();
    };

    const incrementQuantity = () => {
      const updatedShops = shops.map((shop, sIndex) => {
        if (sIndex === shopIndex) {
          const updatedItems = shop.items.map((item, iIndex) =>
            iIndex === itemIndex ? { ...item, quantity: item.quantity + 1 } : item
          );
          return { ...shop, items: updatedItems };
        }
        return shop;
      });
      setShops(updatedShops);
    };

    const decrementQuantity = () => {
      const updatedShops = shops.map((shop, sIndex) => {
        if (sIndex === shopIndex) {
          const updatedItems = shop.items.map((item, iIndex) =>
            iIndex === itemIndex && item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : item
          );
          return { ...shop, items: updatedItems };
        }
        return shop;
      });
      setShops(updatedShops);
    };

    const toggleSelection = () => {
      const updatedShops = shops.map((shop, sIndex) => {
        if (sIndex === shopIndex) {
          const updatedItems = shop.items.map((item, iIndex) =>
            iIndex === itemIndex ? { ...item, selected: !item.selected } : item
          );
          return { ...shop, items: updatedItems };
        }
        return shop;
      });
      setShops(updatedShops);
    };

    const renderRightActions = (progress, dragX) => (
      <StyledView className="flex-row my-2 mx-2.5">
        <TouchableOpacity
          onPress={editItem}
          className="bg-[#F4A261] justify-center items-center w-12 rounded-l-lg my-0.5">
          <Image source={editButton} className="w-6 h-6 tint-white" style={{ tintColor: 'white' }} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={deleteItem}
          className="bg-[#E76F51] justify-center items-center w-12 rounded-r-lg my-0.5">
          <Image source={deleteButton} className="w-6 h-6" style={{ tintColor: 'white' }} />
        </TouchableOpacity>
      </StyledView>
    );

    const showItemDetails = () => {
      setSelectedItem(item);
      setModalVisible(true);
    };

    return (
      <Swipeable
        ref={(ref) => { swipeableRef = ref; }}
        renderRightActions={renderRightActions}
        overshootRight={false}>
        <TouchableOpacity onPress={showItemDetails}>
          <StyledView className="my-2 mx-3 border border-gray-200 rounded-lg bg-white shadow-lg p-4">
            <StyledView className="flex-row items-center">
              <StyledView className="mr-4">
                <CheckBox
                  isChecked={item.selected}
                  onClick={toggleSelection}
                  className="mr-2"
                />
              </StyledView>
              <Image
                source={placeholderImage}
                className="w-16 h-16 rounded-lg"
                resizeMode="cover"
              />
              <StyledView className="ml-4 flex-1">
                <StyledView className="flex-row items-center mb-1">
                  <StyledText className="text-lg font-semibold text-gray-900">{item.title}</StyledText>
                </StyledView>
                <StyledText className="text-base text-gray-700">₱ {item.price.toFixed(2)}</StyledText>
              </StyledView>
              <StyledView className="flex-col items-center ml-4">
                <TouchableOpacity
                  onPress={incrementQuantity}
                  className="bg-[#00B215] justify-center items-center w-7 h-7 rounded-full mb-1.5">
                  <Text className="text-white text-xl">+</Text>
                </TouchableOpacity>
                <StyledText className="text-base text-gray-900 mb-1">{item.quantity}</StyledText>
                <TouchableOpacity
                  onPress={decrementQuantity}
                  className="bg-[#FF3B30] justify-center items-center w-7 h-7 rounded-full">
                  <Text className="text-white text-xl">-</Text>
                </TouchableOpacity>
              </StyledView>
            </StyledView>
          </StyledView>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  const renderShop = ({ item: shop, index: shopIndex }) => (
    <StyledView className="bg-white rounded-lg shadow-lg mb-4">
      <StyledView className="p-4 flex-row items-center border-b border-gray-300 bg-[#F1F5F9] rounded-t-lg">
        <StyledView className="mr-4">
          <CheckBox
            isChecked={shop.items.every(item => item.selected)}
            onClick={() => toggleShopSelection(shopIndex)}
          />
        </StyledView>
        <StyledText className="text-lg font-bold text-gray-900">{shop.name}</StyledText>
      </StyledView>
      <FlatList
        data={shop.items}
        renderItem={({ item, index }) => renderItem({ item, shopIndex, itemIndex: index })}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 10 }} />
    </StyledView>
  );

  const handleCheckout = () => {
    const selectedItems = shops.flatMap(shop => shop.items.filter(item => item.selected));
    if (selectedItems.length > 0) {
      navigation.navigate("CheckoutScreen", { selectedItems });
    } else {
      Alert.alert("Checkout", "No items selected for checkout.");
    }
  };

  return (
    <StyledView className="flex-1 bg-gray-50 p-3">
      <FlatList
        data={shops}
        renderItem={renderShop}
        keyExtractor={(shop) => shop.id.toString()}
        contentContainerStyle={{ paddingBottom: 10 }} />
      <TouchableOpacity
        onPress={handleCheckout}
        className="bg-[#00B215] justify-center items-center py-4 mx-3 rounded-lg mt-4 shadow-lg">
        <StyledText className="text-lg font-semibold text-white">Proceed to Checkout</StyledText>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <StyledView className="flex-1 justify-center items-center bg-[#00000080]">
          <StyledView className="bg-white rounded-lg w-[90%] p-4 shadow-lg">
            {selectedItem && (
              <>
                <StyledText className="text-2xl font-semibold text-gray-900">{selectedItem.title}</StyledText>
                <Image
                  source={placeholderImage}
                  className="w-full h-48 mt-4 rounded-lg"
                  resizeMode="contain"
                />
                <StyledText className="text-lg text-gray-700 mt-4">Price: ₱ {selectedItem.price.toFixed(2)}</StyledText>
                <StyledText className="text-lg text-gray-700 mt-2">Quantity: {selectedItem.quantity}</StyledText>
              </>
            )}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-[#00B215] justify-center items-center py-3 mt-6 rounded-lg">
              <StyledText className="text-lg font-semibold text-white">Close</StyledText>
            </TouchableOpacity>
          </StyledView>
        </StyledView>
      </Modal>
    </StyledView>
  );
}

export default CartScreen;
