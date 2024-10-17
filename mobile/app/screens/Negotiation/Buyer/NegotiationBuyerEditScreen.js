import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, TextInput, Image, Modal, ScrollView, Dimensions } from 'react-native';
import logo from "../../../assets/logo.png";
import { styled } from 'nativewind'; // Import NativeWind

const { width, height } = Dimensions.get('window'); // Get screen dimensions

const dummyNegotiation = [
    {
        id: 1,
        productImage: logo,
        productName: "Patatas",
        productDescription: "Patatas masarap",
        productPrice: 10.0,
        status: "Negotiating",
        openOrCloseNegotiation: 'open'
    }
];

const negotiationData = {
    price: "10.00",
    amount: "1",
    total: "10.00",
};

const NegotiationBuyerEditScreen = () => {

    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('');
    const [total, setTotal] = useState(0);
    const [modalVisible, setModalVisible] = useState(false); // Modal state
    const [isReadMore, setIsReadMore] = useState(true); // Read more state

    // Effect to calculate the total price dynamically
    useEffect(() => {
        const priceNum = parseFloat(price) || 0;
        const amountNum = parseFloat(amount) || 0;
        setTotal((priceNum * amountNum).toFixed(2));
    }, [price, amount]);

    // Logic to only show "Read More" if the description is longer than 50 characters
    const shouldShowReadMore = dummyNegotiation[0].productDescription.length > 50;

    // Dynamic styles based on screen width and height
    const dynamicTextSize = width > 400 ? 'text-lg' : 'text-base'; // Adjust font size based on screen size
    const dynamicButtonPadding = width > 400 ? 'py-4' : 'py-3'; // Adjust button padding dynamically
    const dynamicImageHeight = height * 0.25; // Adjust image height to 25% of the screen height

    return (
        <SafeAreaView className="flex-1 bg-white p-4">
            <View className="flex-1">
                <View className="flex-1 justify-between">
                    {/* Product Details */}
                    <View className="px-1 py-1">
                        <View className="border-b border-gray-300 pb-4 mb-1">
                            <Image
                                source={dummyNegotiation[0].productImage}
                                className="w-full object-cover rounded-lg mb-4"
                                style={{ height: dynamicImageHeight }} // Dynamically set image height
                                resizeMode="contain" // Keep the image contained
                            />
                            <Text className={`${dynamicTextSize} font-semibold text-gray-800 mb-2`}>
                                {dummyNegotiation[0].productName}
                            </Text>
                            <Text className="text-sm text-gray-600 mb-2">
                                {isReadMore ? `${dummyNegotiation[0].productDescription.substring(0, 50)}${shouldShowReadMore ? '...' : ''}` : dummyNegotiation[0].productDescription}
                                {shouldShowReadMore && isReadMore && (
                                    <Text
                                        className="text-[#00B251] font-semibold"
                                        onPress={() => setModalVisible(true)}  // Set modalVisible to true
                                    >
                                        {' '}Read More
                                    </Text>
                                )}
                            </Text>
                            <Text className={`${dynamicTextSize} font-bold text-[#00B251]`}>
                                ₱{dummyNegotiation[0].productPrice}
                            </Text>
                        </View>
                    </View>

                    {/* Negotiation Details */}
                    {dummyNegotiation[0].openOrCloseNegotiation === 'open' ? (
                        <>
                            <View className="flex-row justify-between space-x-4 mt-1">
                                {/* Buyer Offer Section */}
                                <View className="flex-1 border border-gray-300 rounded-md p-4">
                                    <Text className={`${dynamicTextSize} font-semibold text-gray-800 mb-2`}>Buyer Offer</Text>
                                    <Text className="text-sm text-gray-600 mt-2">Price: ₱{negotiationData.price}</Text>
                                    <Text className="text-sm text-gray-600 mt-9">Amount: {negotiationData.amount}</Text>
                                    <Text className="font-bold text-lg text-black mt-7">Total: ₱{negotiationData.total}</Text>
                                </View>

                                {/* Your Offer Section */}
                                <View className="flex-1 border border-[#00B251] rounded-md p-4">
                                    <Text className={`${dynamicTextSize} font-semibold text-gray-800 mb-2`}>Your Offer</Text>
                                    <View className="space-y-4">
                                        <TextInput
                                            className="border border-gray-300 rounded-md p-1 text-gray-800"
                                            keyboardType="numeric"
                                            placeholder={`Price: ${negotiationData.price}`}
                                            value={price}
                                            onChangeText={setPrice}
                                            style={{ fontSize: width > 400 ? 18 : 16 }} // Adjust font size based on screen width
                                        />
                                        <TextInput
                                            className="border border-gray-300 rounded-md p-1 text-gray-800"
                                            keyboardType="numeric"
                                            placeholder={`Amount: ${negotiationData.amount}`}
                                            value={amount}
                                            onChangeText={setAmount}
                                            style={{ fontSize: width > 400 ? 18 : 16 }} // Adjust font size
                                        />
                                        <Text className={`${dynamicTextSize} font-bold text-gray-800`}>Total: ₱{total}</Text>
                                        <TouchableOpacity
                                            className={`border border-[#00B251] ${dynamicButtonPadding} rounded-md`}
                                            onPress={() => { }}
                                        >
                                            <Text className="text-[#00B251] text-center font-semibold">Negotiate</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            {/* Action Buttons */}
                            <View className="flex-row justify-between space-x-4 mt-4">
                                <TouchableOpacity
                                    className={`bg-[#00B251] ${dynamicButtonPadding} rounded-md flex-1`}
                                    onPress={() => { }}
                                >
                                    <Text className="text-white text-center font-semibold">Accept</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className={`bg-red-500 ${dynamicButtonPadding} rounded-md flex-1`}
                                    onPress={() => { }}
                                >
                                    <Text className="text-white text-center font-semibold">Decline</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <>
                            {/* Closed Negotiation State */}
                            <View className="border-b border-gray-300 pb-4 ml-2 mb-5">
                                <Text className="text-lg md:text-xl font-semibold text-red-600 mb-2">The buyer did not want to negotiate.</Text>
                                <Text className="text-sm md:text-base text-gray-600 mb-2">Price: ₱{negotiationData.price}</Text>
                                <Text className="text-sm md:text-base text-gray-600 mb-2">Amount: {negotiationData.amount}</Text>
                                <Text className="text-sm md:text-base text-gray-600">Total: ₱{negotiationData.total}</Text>
                            </View>

                            {/* Action Buttons */}
                            <View className="flex-row justify-between space-x-4 mb-40">
                                <TouchableOpacity
                                    className={`bg-[#00B251] ${dynamicButtonPadding} rounded-md flex-1`}
                                    onPress={() => { }}
                                >
                                    <Text className="text-white text-center font-semibold">Accept</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className={`bg-red-500 ${dynamicButtonPadding} rounded-md flex-1`}
                                    onPress={() => { }}
                                >
                                    <Text className="text-white text-center font-semibold">Decline</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}

                    {/* Modal for full product description */}
                    <Modal
                        visible={modalVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setModalVisible(false)}  // Close modal on back press
                    >
                        <View className="flex-1 justify-center items-center bg-black/50">
                            <View className="bg-white w-4/5 p-6 rounded-lg">
                                <Text className="text-lg font-bold text-[#00B251] mb-4">Product Description</Text>
                                <ScrollView className="mb-4">
                                    <Text className="text-sm text-gray-600">
                                        {dummyNegotiation[0].productDescription}
                                    </Text>
                                </ScrollView>
                                <TouchableOpacity
                                    className={`bg-[#00B251] ${dynamicButtonPadding} rounded-md`}
                                    onPress={() => setModalVisible(false)}  // Close modal on press
                                >
                                    <Text className="text-white text-center font-semibold">Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default NegotiationBuyerEditScreen;
