import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { useNavigation } from "@react-navigation/native";

function FilterProductsScreen() {
  // State management for each dropdown
  const [category, setCategory] = useState(null);
  const [subcategory, setSubcategory] = useState(null);
  const [variety, setVariety] = useState(null);
  const [product, setProduct] = useState(null);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [priceRange, setPriceRange] = useState([10, 40]);
  const [selectedQuantity, setSelectedQuantity] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [activeField, setActiveField] = useState('');
  const navigation = useNavigation();

  const toggleClassSelection = (classType) => {
    if (selectedClasses.includes(classType)) {
      setSelectedClasses(selectedClasses.filter(item => item !== classType));
    } else {
      setSelectedClasses([...selectedClasses, classType]);
    }
  };

  const getButtonStyle = (classType) => ({
    backgroundColor: selectedClasses.includes(classType) ? '#00B251' : '#8f8d8d',
    padding: 12,
    borderRadius: 5,
    minWidth: 55,
    justifyContent: 'center',
    alignItems: 'center',
  });

  const quantities = [
    { label: '1-5', value: '1-5' },
    { label: '6-10', value: '6-10' },
    { label: '11-20', value: '11-20' },
    { label: '20+', value: '20+' },
  ];

  // Data for the modal items
  const modalItems = {
    category: [
      { label: 'Electronics', value: 'electronics' },
      { label: 'Clothing', value: 'clothing' },
      { label: 'Furniture', value: 'furniture' },
    ],
    subcategory: [
      { label: 'Phones', value: 'phones' },
      { label: 'Laptops', value: 'laptops' },
      { label: 'Chairs', value: 'chairs' },
    ],
    variety: [
      { label: 'Budget', value: 'budget' },
      { label: 'Premium', value: 'premium' },
    ],
    product: [
      { label: 'iPhone', value: 'iphone' },
      { label: 'MacBook', value: 'macbook' },
      { label: 'Office Chair', value: 'office_chair' },
    ],
  };

  const handleOpenModal = (field) => {
    setModalData(modalItems[field]);
    setActiveField(field);
    setSearchText(''); // Reset search text
    setModalVisible(true);
  };

  const handleSubmit = () => {
    const filterData = {
      category,
      subcategory,
      variety,
      product,
      selectedClasses,
      priceRange,
      selectedQuantity,
    };
    console.log("Applied Filters:", filterData);
    navigation.navigate("Compare Shops")
  };

  const handleSelectItem = (item) => {
    switch (activeField) {
      case 'category':
        setCategory(item.value);
        break;
      case 'subcategory':
        setSubcategory(item.value);
        break;
      case 'variety':
        setVariety(item.value);
        break;
      case 'product':
        setProduct(item.value);
        break;
      default:
        break;
    }
    setModalVisible(false);
  };

  const filteredItems = modalData.filter(item =>
    item.label.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView className="bg-gray-100 flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="p-4">
          {/* Category Button */}
          <Text className="text-lg font-semibold mb-1">Choose Category:</Text>
          <TouchableOpacity onPress={() => handleOpenModal('category')} className="mb-4 border border-gray-500 rounded-lg p-2 px-4 mx-2 ">
            <Text className="text-base">{category ? `Category: ${category}` : '-- Select a Category --'}</Text>
          </TouchableOpacity>

          {/* Subcategory Button */}
          <Text className="text-lg font-semibold mb-1">Choose Subcategory:</Text>
          <TouchableOpacity onPress={() => handleOpenModal('subcategory')} className="mb-4 border border-gray-500 rounded-lg p-2 px-4 mx-2">
            <Text className="text-base">{subcategory ? `Subcategory: ${subcategory}` : '-- Select a Subcategory --'}</Text>
          </TouchableOpacity>

          {/* Variety Button */}
          <Text className="text-lg font-semibold mb-1">Choose Variety:</Text>
          <TouchableOpacity onPress={() => handleOpenModal('variety')} className="mb-4 border border-gray-500 rounded-lg p-2 px-4 mx-2">
            <Text className="text-base">{variety ? `Variety: ${variety}` : '-- Select a Variety --'}</Text>
          </TouchableOpacity>

          {/* Product Button */}
          <Text className="text-lg font-semibold mb-1">Choose Product:</Text>
          <TouchableOpacity onPress={() => handleOpenModal('product')} className="mb-4 border border-gray-500 rounded-lg p-2 px-4 mx-2">
            <Text className="text-base">{product ? `Product: ${product}` : '-- Select a Product --'}</Text>
          </TouchableOpacity>

          {/* Class Selection */}
          <View className="mb-4">
            <Text className="mb-2 text-lg font-semibold">Choose Class:</Text>
            <View className="flex-row justify-around">
              {['A', 'B', 'C', 'D'].map((classType) => (
                <TouchableOpacity
                  key={classType}
                  onPress={() => toggleClassSelection(classType)}
                  style={getButtonStyle(classType)}
                >
                  <Text className="text-white font-semibold">{classType}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Price Range Slider */}
          <View className="mb-4">
            <Text className="text-lg font-semibold">Choose Preferred Price:</Text>
            <View className="w-full items-center">
              <View className="flex-row justify-between w-full items-center">
                <Text className="text-base font-semibold text-gray-500 text-right">₱0</Text>
                <MultiSlider
                  values={priceRange}
                  min={0}
                  max={50}
                  step={1}
                  onValuesChange={(values) => setPriceRange(values)}
                  selectedStyle={{
                    backgroundColor: '#00B251',
                  }}
                  unselectedStyle={{
                    backgroundColor: '#cccccc',
                  }}
                  containerStyle={{ width: '90%', height: 40 }}
                />
                <Text className="text-base font-semibold text-gray-500">₱50</Text>
              </View>
              <View className="flex-row justify-between w-3/5">
                <Text className="text-lg font-semibold">₱{priceRange[0]}</Text>
                <Text className="text-lg font-semibold">to</Text>
                <Text className="text-lg font-semibold">₱{priceRange[1]}</Text>
              </View>
            </View>
          </View>

          {/* Quantity Selection */}
          <View className="">
            <Text className="mb-2 text-lg font-semibold">How Much Would You Like to Buy?</Text>
            <View className="flex-row justify-around">
              {quantities.map((qty) => (
                <TouchableOpacity
                  key={qty.value}
                  onPress={() => setSelectedQuantity(qty.value)}
                  style={{
                    backgroundColor: selectedQuantity === qty.value ? '#00B251' : '#8f8d8d',
                    padding: 10,
                    borderRadius: 5,
                    minWidth: 60,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text className="text-white font-semibold">{qty.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View className="flex-row justify-between px-4 py-4 bg-white border-t border-gray-200">
        <TouchableOpacity
          onPress={() => console.log("Cancel")}
          className="bg-gray-400 p-3 rounded-lg w-[45%] items-center"
        >
          <Text className="text-white font-semibold">Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-green-600 p-3 rounded-lg w-[45%] items-center"
        >
          <Text className="text-white font-semibold">Apply Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Selecting Items */}
      <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View className="flex-1 justify-center bg-black/50">
        <View className="bg-white mx-4 rounded-lg p-6 shadow-lg h-screen max-h-[80%]">
          <TextInput
            placeholder="Search..."
            value={searchText}
            onChangeText={setSearchText}
            className="border border-gray-300 p-3 rounded-lg mb-4"
          />
          <ScrollView>
            {filteredItems.map(item => (
              <TouchableOpacity
                key={item.value}
                onPress={() => handleSelectItem(item)}
                className={`px-2 py-1 border-b border-gray-300 rounded-lg ${
                  (activeField === 'category' && category === item.value) ||
                  (activeField === 'subcategory' && subcategory === item.value) ||
                  (activeField === 'variety' && variety === item.value) ||
                  (activeField === 'product' && product === item.value)
                    ? 'bg-green-300'
                    : 'bg-white'
                }`}
              >
                <Text className="text-lg text-black">{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={() => setModalVisible(false)} className="mt-4 bg-gray-400 p-3 rounded-lg">
            <Text className="text-white text-center">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    </SafeAreaView>
  );
}

export default FilterProductsScreen;
