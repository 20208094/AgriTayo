import React, {useState, useEffect} from 'react'
import { Alert, SafeAreaView, View, Text, TouchableOpacity, TextInput} from 'react-native'

const dummyNegotiation = [
    {
        id: 1,
        productName: 'Patatas',
        productDescription: 'Patatas masarap',
        productPrice: 10.00,
    },
    {
        id: 2,
        productName: 'Tomato',
        productDescription: 'Tomato masarap',
        productPrice: 5.00,
    }
]

function NegotiationBuyerScreen({navigation}){
    const [price, setPrice] = useState('')
    const [amount, setAmount] = useState('')
    const [total, setTotal] = useState(0)

    useEffect (() =>{
        const priceNum = parseFloat(price) || 0
        const amountNum = parseFloat(amount) || 0
        setTotal((priceNum * amountNum).toFixed(2))
    }, [price, amount])

    const handleSubmit = () => {
        const negotiationData = {
            price, 
            amount,
            total
        }

        Alert.alert(
            'Negotiate Successfully',
            [
            {
                text: 'okay'
            }
        ])

        navigation.navigate('Seller Negotiation List', {dummyNegotiation, negotiationData})
    }

    return(
        <SafeAreaView className=''>
                <View className='' key={dummyNegotiation[0].id}>
                    <Text className=''>Product: {dummyNegotiation[0].productName}</Text>
                    <Text className=''>Description: {dummyNegotiation[0].productDescription}</Text>
                </View>
            <View className=''>
                <TextInput
                keyboardType='numeric'
                placeholder='Enter the price'
                value={price}
                onChangeText ={setPrice}
                />
                <TextInput
                keyboardType='numeric'
                placeholder='Enter the amount'
                value={amount}
                onChangeText={setAmount}
                />
                <Text className=''>Total: ₱ {total}</Text>
                <TouchableOpacity className='' onPress={handleSubmit}>
                    <Text className=''>Open</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default NegotiationBuyerScreen