import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
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
            {/* ScrollView for list items */}
            <StyledScrollView contentContainerStyle={{ paddingVertical: 20 }} className="flex-1 p-5">
                <StyledView className="space-y-6 mb-10">
                    {dummyNegotiation.map((data) => (
                        <StyledTouchableOpacity 
                            key={data.id} 
                            className="bg-white border border-gray-300 rounded-lg shadow-lg p-5"
                            onPress={() => navigation.navigate('Seller Negotiation', { dummyNegotiation: data, negotiationData })}
                            style={{
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,
                            }}>
                            
                            <StyledView className="flex-row">
                                {/* Left Column: Full Image */}
                                <StyledView className="w-1/2 pr-3">
                                    <Image 
                                        source={data.productImage}
                                        className="w-full h-48 object-cover rounded-lg mb-3"
                                        resizeMode="cover"
                                    />
                                </StyledView>

                                {/* Right Column: Product Information */}
                                <StyledView className="w-1/2 space-y-3">
                                    <StyledText className="text-lg font-semibold text-[#00B251] text-center">
                                        {data.productName}
                                    </StyledText>
                                    <StyledText className="text-sm font-medium text-gray-500 text-center">
                                        ₱{data.productPrice.toFixed(2)}
                                    </StyledText>
                                    
                                    <StyledView className="border-t border-gray-300 mt-2 pt-2 space-y-1">
                                        <StyledText className="text-sm font-bold text-gray-800 text-center">Negotiation Status:</StyledText>
                                        <StyledText className={`text-sm ${data.status === 'Pending' ? 'text-gray-500' : 'text-[#00B251]'} text-center`}>
                                            {data.status || 'Pending'}
                                        </StyledText>
                                    </StyledView>

                                    {/* Offer Details */}
                                    <StyledView className="border-t border-gray-300 mt-2 pt-2 space-y-2">
                                        <StyledText className="text-sm text-gray-700 text-center">Offered Price: 
                                            <Text className="font-semibold text-gray-800"> ₱{negotiationData.price}</Text>
                                        </StyledText>
                                        <StyledText className="text-sm text-gray-700 text-center">Amount: 
                                            <Text className="font-semibold text-gray-800"> {negotiationData.amount}</Text>
                                        </StyledText>
                                        <StyledText className="text-sm text-gray-700 text-center">Total: 
                                            <Text className="font-semibold text-gray-800"> ₱{negotiationData.total}</Text>
                                        </StyledText>
                                    </StyledView>
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
