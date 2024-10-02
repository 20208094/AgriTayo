import React, { useState, useEffect } from 'react'; 
import { SafeAreaView, View, Text, TouchableOpacity, TextInput, Image, Modal, ScrollView } from 'react-native'; 
import logo from "../../assets/logo.png"; 
import { styled } from 'nativewind'; // Import NativeWind

const dummyNegotiation = [
    {
        id: 1,
        productImage: logo,
        productName: "Patatas",
        productDescription: "Patatas masarap",
        productPrice: 10.0,
        status: "Negotiating",
        openOrCloseNegotiation: 'close'
    }
]

const negotiationData = {
    price: "10.00",
    amount: "1",
    total: "10.00",
}

const NegotiationBuyerEditScreen = () => {

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
            <View className="px-4 py-6">
                {/* Product Details */}
                <View className="border-b border-gray-300 pb-4 mb-4">
                    <Image 
                        source={dummyNegotiation[0].productImage}
                        className="w-full h-96 object-cover rounded-lg mb-4" 
                        resizeMode="cover"
                    />
                    <Text className="text-xl font-semibold text-gray-800 mb-2">
                        {dummyNegotiation[0].productName}
                    </Text>
                    <Text className="text-sm text-gray-600 mb-2">
                        {isReadMore ? `${dummyNegotiation[0].productDescription.substring(0, 50)}...` : dummyNegotiation[0].productDescription}
                        <Text 
                            className="text-[#00B251] font-semibold"
                            onPress={() => setModalVisible(true)}
                        >
                            {isReadMore ? ' Read More' : ''}
                        </Text>
                    </Text>
                    <Text className="text-lg font-bold text-[#00B251]">
                        ₱{dummyNegotiation[0].productPrice}
                    </Text>
                </View>

                {/* Negotiation Details */}
                {dummyNegotiation[0].openOrCloseNegotiation === 'open' ? (
                    <>
                        <View className="flex-row space-x-4 mb-5">
                            {/* Buyer Offer Section */}
                            <View className="flex-1 border border-gray-300 rounded-md p-4">
                                <Text className="text-lg font-semibold text-gray-800 mb-2">Buyer Offer</Text>
                                <Text className="text-sm text-gray-600 mt-4">Price: ₱{negotiationData.price}</Text>
                                <Text className="text-sm text-gray-600 mt-12">Amount: {negotiationData.amount}</Text>
                                <Text className="font-bold text-lg text-black mt-9">Total: ₱{negotiationData.total}</Text>
                            </View>

                            {/* Your Offer Section */}
                            <View className="flex-1 border border-gray-300 rounded-md p-4">
                                <Text className="text-lg font-semibold text-gray-800 mb-2">Your Offer</Text>
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
                                    <Text className="text-lg font-bold text-gray-800">Total: ₱{total}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View className="flex-row justify-between space-x-4">
                            <TouchableOpacity
                                className="bg-[#00B251] py-3 rounded-md flex-1"
                                onPress={() => {}}
                            >
                                <Text className="text-white text-center font-semibold">Accept</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="bg-gray-400 py-3 rounded-md flex-1"
                                onPress={() => {}}
                            >
                                <Text className="text-white text-center font-semibold">Decline</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="border border-[#00B251] py-3 rounded-md flex-1"
                                onPress={() => {}}
                            >
                                <Text className="text-[#00B251] text-center font-semibold">Negotiate</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <>
                        {/* Closed Negotiation State */}
                        <View className="border-b border-gray-300 pb-4 mb-4">
                            <Text className="text-lg font-semibold text-red-600 mb-2">The buyer did not want to negotiate.</Text>
                            <Text className="text-sm text-gray-600">Price: ₱{negotiationData.price}</Text>
                            <Text className="text-sm text-gray-600">Amount: {negotiationData.amount}</Text>
                            <Text className="text-sm text-gray-600">Total: ₱{negotiationData.total}</Text>
                        </View>

                        {/* Action Buttons */}
                        <View className="flex-row justify-between space-x-4">
                            <TouchableOpacity
                                className="bg-[#00B251] py-3 rounded-md flex-1"
                                onPress={() => {}}
                            >
                                <Text className="text-white text-center font-semibold">Accept</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="bg-gray-400 py-3 rounded-md flex-1"
                                onPress={() => {}}
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
                            <Text className="text-lg font-bold text-[#00B251] mb-4">Product Description</Text>
                            <ScrollView className="mb-4">
                                <Text className="text-sm text-gray-600">{dummyNegotiation[0].productDescription}</Text>
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
        </SafeAreaView>
    );
};

export default NegotiationBuyerEditScreen;
