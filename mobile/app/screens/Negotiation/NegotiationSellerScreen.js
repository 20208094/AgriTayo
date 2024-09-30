import React, { useState, useEffect } from 'react'; 
import { SafeAreaView, View, Text, TouchableOpacity, TextInput } from 'react-native'; 
import Modal from '../../components/Modal';

function NegotiationSellerScreen({ route }) {
    const { dummyNegotiation, negotiationData } = route.params;

    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('');
    const [total, setTotal] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [negotiationSubmitted, setNegotiationSubmitted] = useState(false);

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

    return (
        <SafeAreaView className=''>
            <View className=''>
                <Text className=''>Product Name: {dummyNegotiation[0].productName}</Text>
                <Text className=''>Description: {dummyNegotiation[0].productDescription}</Text>
                <Text className=''>Price: {dummyNegotiation[0].productPrice}</Text>
            </View>
            <View className=''>
                <Text className=''>Offered Price: {negotiationData.price}</Text>
                <Text className=''>Amount: {negotiationData.amount}</Text>
                <Text className=''>Total: {negotiationData.total}</Text>
            </View>
            
            <View className=''>
                <TouchableOpacity className='' onPress={() => setNegotiationSubmitted(false)}>
                    <Text className=''>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity  className='' onPress={handleDecline}>
                    <Text className=''>Decline</Text>
                </TouchableOpacity>
            </View>

            {negotiationSubmitted && (
                <View className=''>
                    <TouchableOpacity  className='' onPress={toggleModal}>
                        <Text className=''>Negotiate</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Modal isVisible={modalVisible} onClose={toggleModal}>
                <Text className=''>Negotiate with Buyer</Text>
                <Text className=''>Add the price and amount</Text>
                <TextInput
                 className=''
                    keyboardType='numeric'
                    placeholder='Enter the Price'
                    value={price}
                    onChangeText={setPrice}
                />
                <TextInput
                 className=''
                    keyboardType='numeric'
                    placeholder='Enter the Amount'
                    value={amount}
                    onChangeText={setAmount}
                />
                <Text className=''>Total: {total}</Text>
                <TouchableOpacity  className='' onPress={toggleModal}>
                    <Text className=''>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity  className='' onPress={handleNegotiate}>
                    <Text  className=''>Add for Negotiation</Text>
                </TouchableOpacity>
            </Modal>

            {negotiationSubmitted && (
                <View className=''>
                    <Text  className=''>Your Negotiation</Text>
                    <Text className=''>Price: {price}</Text>
                    <Text  className=''>Amount: {amount}</Text>
                    <Text className=''>Total: {total}</Text>
                </View>
            )}
        </SafeAreaView>
    );
}

export default NegotiationSellerScreen;
