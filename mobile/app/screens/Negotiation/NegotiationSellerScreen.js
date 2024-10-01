import React, { useState, useEffect } from 'react'; 
import { SafeAreaView, View, Text, TouchableOpacity, TextInput } from 'react-native'; 
import CustomModal from '../../components/CustomModal';

function NegotiationSellerScreen({ route, navigation }) {
    const { dummyNegotiation, negotiationData } = route.params;

    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('');
    const [total, setTotal] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [negotiationSubmitted, setNegotiationSubmitted] = useState(false);
    const [negotiationAccepted, setNegotiationAccepted] = useState(false);

    useEffect(() => {
        const priceNum = parseFloat(price) || 0;
        const amountNum = parseFloat(amount) || 0;
        setTotal((priceNum * amountNum).toFixed(2));
    }, [price, amount]);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const handleNegotiate = () => {
        setNegotiationSubmitted(true);
        toggleModal(); 
    };

    const handleDecline = () => {
        
    };

    const handleAccept = () => {
        setNegotiationAccepted(true); 
    };

    const handleAcceptNegotiation = () => {
        
    }

    return (
        <SafeAreaView>
            <View>
                <Text>Product Name: {dummyNegotiation.productName}</Text>
                <Text>Description: {dummyNegotiation.productDescription}</Text>
                <Text>Price: {dummyNegotiation.productPrice}</Text>
            </View>

            <View>
                <Text>Offered Price: {negotiationData.price}</Text>
                <Text>Amount: {negotiationData.amount}</Text>
                <Text>Total: {negotiationData.total}</Text>
            </View>
            
            {!negotiationAccepted && (
                <View>
                    <TouchableOpacity onPress={handleAccept}>
                        <Text>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDecline}>
                        <Text>Decline</Text>
                    </TouchableOpacity>
                </View>
            )}

            {negotiationAccepted && !negotiationSubmitted && (
                <View>
                    <TouchableOpacity onPress={toggleModal}>
                        <Text>Negotiate</Text>
                    </TouchableOpacity>
                </View>
            )}

            <CustomModal isVisible={modalVisible} onClose={toggleModal}>
                <Text>Negotiate with Buyer</Text>
                <Text>Add the price and amount</Text>
                <TextInput
                    keyboardType='numeric'
                    placeholder='Enter the Price'
                    value={price}
                    onChangeText={setPrice}
                />
                <TextInput
                    keyboardType='numeric'
                    placeholder='Enter the Amount'
                    value={amount}
                    onChangeText={setAmount}
                />
                <Text>Total: {total}</Text>
                <TouchableOpacity onPress={toggleModal}>
                    <Text>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNegotiate}>
                    <Text>Add for Negotiation</Text>
                </TouchableOpacity>
            </CustomModal>

            {negotiationSubmitted && (
                <View>
                    <Text>Your Negotiation</Text>
                    <Text>Price: {price}</Text>
                    <Text>Amount: {amount}</Text>
                    <Text>Total: {total}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Buyer Negotiation')}>
                        <Text>Add for negotiation</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

export default NegotiationSellerScreen;
