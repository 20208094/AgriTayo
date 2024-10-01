import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styled } from 'nativewind';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

function NegotiationSellerListScreen({ route, navigation }) {
    const { dummyNegotiation, negotiationData } = route.params;

    return (
        <StyledSafeAreaView className="flex-1 bg-white">
            {/* Ensure ScrollView takes up the full available height */}
            <StyledScrollView contentContainerStyle={{ paddingVertical: 1 }} className="flex-1 p-10">
                <StyledView className="space-y-4 mb-20">
                    {dummyNegotiation.map((data) => (
                        <StyledTouchableOpacity 
                            key={data.id} 
                            className="bg-white border border-[#00B251] rounded-lg shadow-sm p-4"
                            onPress={() => navigation.navigate('Seller Negotiation', { dummyNegotiation: data, negotiationData })}>
                            
                            <StyledView className="space-y-2">
                                <StyledText className="text-lg font-semibold text-[#00B251]">{data.productName}</StyledText>
                                <StyledText className="text-sm text-gray-600">₱{data.productPrice}</StyledText>
                                <StyledText className="text-sm font-bold text-black">Negotiation:</StyledText>
                                <StyledText className="text-sm text-gray-500">{data.status || 'Pending'}</StyledText>

                                <StyledView className="mt-2 space-y-1">
                                    <StyledText className="text-sm text-gray-500">Offered Price: ₱{negotiationData.price}</StyledText>
                                    <StyledText className="text-sm text-gray-500">Amount: {negotiationData.amount}</StyledText>
                                    <StyledText className="text-sm text-gray-500">Total: ₱{negotiationData.total}</StyledText>
                                </StyledView>
                            </StyledView>
                        </StyledTouchableOpacity>
                    ))}
                </StyledView>
            </StyledScrollView>
        </StyledSafeAreaView>
    );
}

export default NegotiationSellerListScreen;
