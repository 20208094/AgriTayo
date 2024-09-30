import React, {useState, useEffect} from 'react'
import { SafeAreaView, View, Text, TouchableOpacity} from 'react-native'

const dummyNegotiation = [
    {
        id: 1,
        productName: 'Patatas',
        productDescription: 'Patatas masarap',
        productPrice: 10.00,
    }
]

function NegotiationBuyerScreen({navigation}){
    const [price, setPrice] = useState('')
    const [amount, setAmount] = useState('')
    const [total, setTotal] = useState('')

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

        navigation.navigate('Seller Negotiation', {dummyNegotiation, negotiationData})
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
                placeholer='Enter the amount'
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