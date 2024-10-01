import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';

function NegotiationSellerListScreen({ route, navigation }) {
    const { dummyNegotiation, negotiationData } = route.params;

    return (
        <SafeAreaView>
            <View>
                {dummyNegotiation.map((data) => (
                    <TouchableOpacity 
                        key={data.id} 
                        onPress={() => navigation.navigate('Seller Negotiation', { dummyNegotiation: data, negotiationData })}>
                        <View>
                            <Text>{data.productName}</Text>
                            <Text>{data.productPrice}</Text>
                            <Text>Negotiation:</Text>
                            <Text>{negotiationData.price}</Text>
                            <Text>{negotiationData.amount}</Text>
                            <Text>{negotiationData.total}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </SafeAreaView>
    );
}

export default NegotiationSellerListScreen;
