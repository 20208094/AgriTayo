import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, TextInput, ScrollView, Image, Modal } from 'react-native';
import { styled } from 'nativewind'; // Import NativeWind

const NegotiationSellerScreen = ({ route, navigation }) => {
    const { dummyNegotiation, negotiationData } = route.params;

    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('');
    const [total, setTotal] = useState(0);
    const [modalVisible, setModalVisible] = useState(false); // Modal state
    const [isReadMore, setIsReadMore] = useState(true); // Read more state

    useEffect(() => {
        const priceNum = parseFloat(price) || 0;
        const amountNum = parseFloat(amount) || 0;
        setTotal((priceNum * amountNum).toFixed(2));
    }, [price, amount]);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1">
                <View className="px-4 py-6">
                    {/* Product Details */}
                    <View className="border-b border-gray-300 pb-4 mb-4">
                        <Image 
                            source={dummyNegotiation.productImage}
                            className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-lg mb-4"
                            resizeMode="cover"
                        />
                        <Text className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">{dummyNegotiation.productName}</Text>
                        <Text className="text-sm md:text-base text-gray-600 mb-2">
                            {isReadMore ? `${dummyNegotiation.productDescription.substring(0, 50)}...` : dummyNegotiation.productDescription}
                            <Text
                                className="text-[#00B251] font-semibold"
                                onPress={() => setModalVisible(true)}
                            >
                                {isReadMore ? ' Read More' : ''}
                            </Text>
                        </Text>
                        <Text className="text-lg md:text-xl font-bold text-[#00B251]">₱{dummyNegotiation.productPrice}</Text>
                    </View>

                    {/* Buyer and Seller Negotiation Details */}
                    {dummyNegotiation.openOrCloseNegotiation === 'open' ? (
                        <>
                            {/* Buyer and Seller Sections Side by Side */}
                            <View className="flex-row space-x-4 mb-5">
                                {/* Buyer Offer Section */}
                                <View className="flex-1 border border-gray-300 rounded-md p-4">
                                    <Text className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Buyer Offer</Text>
                                    <Text className="text-sm md:text-base text-gray-600 mt-4">Price: ₱{negotiationData.price}</Text>
                                    <Text className="text-sm md:text-base text-gray-600 mt-12">Amount: {negotiationData.amount}</Text>
                                    <Text className="font-bold text-lg md:text-xl text-black mt-9">Total: ₱{negotiationData.total}</Text>
                                </View>

                                {/* Your Offer Section */}
                                <View className="flex-1 border border-[#00B251] rounded-md p-4">
                                    <Text className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Your Offer</Text>
                                    <View className="space-y-4">
                                        <TextInput
                                            className="border border-gray-300 rounded-md p-3 text-gray-800"
                                            keyboardType="numeric"
                                            placeholder={`Price: ${negotiationData.price}`}
                                            value={price}
                                            onChangeText={setPrice}
                                        />
                                        <TextInput
                                            className="border border-gray-300 rounded-md p-3 text-gray-800"
                                            keyboardType="numeric"
                                            placeholder={`Amount: ${negotiationData.amount}`}
                                            value={amount}
                                            onChangeText={setAmount}
                                        />
                                        <Text className="text-lg md:text-xl font-bold text-gray-800">Total: ₱{total}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Action Buttons */}
                            <View className="flex-row justify-between space-x-4 mb-6">
                                <TouchableOpacity
                                    className="bg-[#00B251] py-3 rounded-md flex-1"
                                    onPress={() => navigation.navigate('Buyer Edit Negotiation')}
                                >
                                    <Text className="text-white text-center font-semibold">Accept</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="bg-gray-400 py-3 rounded-md flex-1"
                                    onPress={() => { }}
                                >
                                    <Text className="text-white text-center font-semibold">Decline</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="border border-[#00B251] py-3 rounded-md flex-1"
                                    onPress={() => { }}
                                >
                                    <Text className="text-[#00B251] text-center font-semibold">Negotiate</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <>
                            {/* Closed Negotiation State */}
                            <View className="border-b border-gray-300 pb-4 mb-4">
                                <Text className="text-lg md:text-xl font-semibold text-red-600 mb-2">The buyer did not want to negotiate.</Text>
                                <Text className="text-sm md:text-base text-gray-600">Price: ₱{negotiationData.price}</Text>
                                <Text className="text-sm md:text-base text-gray-600">Amount: {negotiationData.amount}</Text>
                                <Text className="text-sm md:text-base text-gray-600">Total: ₱{negotiationData.total}</Text>
                            </View>

                            {/* Action Buttons */}
                            <View className="flex-row justify-between space-x-4 mb-6">
                                <TouchableOpacity
                                    className="bg-[#00B251] py-3 rounded-md flex-1"
                                    onPress={() => navigation.navigate('Buyer Edit Negotiation')}
                                >
                                    <Text className="text-white text-center font-semibold">Accept</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="bg-gray-400 py-3 rounded-md flex-1"
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
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View className="flex-1 justify-center items-center bg-gray-600 bg-opacity-25">
                            <View className="bg-white w-4/5 p-6 rounded-lg">
                                <Text className="text-lg md:text-xl font-bold text-[#00B251] mb-4">Product Description</Text>
                                <ScrollView className="mb-4">
                                    <Text className="text-sm md:text-base text-gray-600">{dummyNegotiation.productDescription}</Text>
                                </ScrollView>
                                <TouchableOpacity
                                    className="bg-[#00B251] py-3 rounded-md"
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text className="text-white text-center font-semibold">Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default NegotiationSellerScreen;
