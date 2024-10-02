import React, { useState, useEffect } from 'react'; 
import { SafeAreaView, View, Text, TouchableOpacity, TextInput } from 'react-native'; 

const dummyNegotiation = [
    {
        id: 1,
        productName: "Patatas",
        productDescription: "Patatas masarap",
        productPrice: 10.0,
        status: "Negotiating",
        openOrCloseNegotiation: 'open'
      }
]

const negotiationData = {
    price: "10.00",
    amount: "1",
    total: "10.00",
  }

function NegotiationBuyerEditScreen() {

    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('');
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const priceNum = parseFloat(price) || 0;
        const amountNum = parseFloat(amount) || 0;
        setTotal((priceNum * amountNum).toFixed(2));
    }, [price, amount]);

    return (
        <SafeAreaView>
            <View>
                <Text>{dummyNegotiation[0].productName}</Text>
                <Text>{dummyNegotiation[0].productDescription}</Text>
                <Text>{dummyNegotiation[0].productPrice}</Text>
            </View>
            {dummyNegotiation[0].openOrCloseNegotiation === 'open' && (
                <>
            <View>
                <Text>Buyer</Text>
                <Text>{negotiationData.price}</Text>
                <Text>{negotiationData.amount}</Text>
                <Text>{negotiationData.total}</Text>
                <Text>{dummyNegotiation[0].openOrCloseNegotiation}</Text>
            </View>
            <View>
                <Text>You</Text>
                <TextInput
                    keyboardType='numeric'
                    placeholder={negotiationData.price.toString()}
                    value={price}
                    onChangeText={setPrice}
                />
                <TextInput
                    keyboardType='numeric'
                    placeholder={negotiationData.amount.toString()}
                    value={amount}
                    onChangeText={setAmount}
                />
                <Text>Total: {total}</Text>
            </View>
            <View>
                <TouchableOpacity onPress={() => {}}>
                    <Text>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {}}>
                    <Text>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {}}>
                    <Text>Negotiate</Text>
                </TouchableOpacity>
            </View>
            </>
             )}
            {dummyNegotiation[0].openOrCloseNegotiation === 'close' && (
                <>
                    <View>
                        <Text>The buyer did not want to negotiate.</Text>
                        <Text>Buyer</Text>
                        <Text>{negotiationData.price}</Text>
                        <Text>{negotiationData.amount}</Text>
                        <Text>{negotiationData.total}</Text>
                        <Text>{dummyNegotiation[0].openOrCloseNegotiation}</Text>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => {}}>
                            <Text>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {}}>
                            <Text>Decline</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
}

export default NegotiationBuyerEditScreen;
