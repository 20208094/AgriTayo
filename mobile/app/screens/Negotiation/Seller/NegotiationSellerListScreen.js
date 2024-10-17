import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { styled } from 'nativewind';
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/FontAwesome';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

function NegotiationSellerListScreen({ route, navigation }) {
    const [selectedStatus, setSelectedStatus] = useState("Ongoing");
    const [loading, setLoading] = useState(true);
    const [shopData, setShopData] = useState(null);
    const [negotiationData, setNegotiationData] = useState(null);
    const [cropsData, setCropsData] = useState(null);
    const [usersData, setUsersData] = useState(null);
    const [metricSystemData, setMetricSystemData] = useState(null);
    const [filteredNegotiations, setFilteredNegotiations] = useState([]);

    const getAsyncShopData = async () => {
        try {
            const storedData = await AsyncStorage.getItem("shopData");

            if (storedData) {
                const parsedData = JSON.parse(storedData);

                if (Array.isArray(parsedData)) {
                    const shop = parsedData[0];
                    setShopData(shop);
                } else {
                    setShopData(parsedData);
                }
            }
        } catch (error) {
            console.error("Failed to load shop data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchNegotiations = async () => {
        if (!shopData) return;

        try {
            const [negotiationsResponse, cropsResponse, usersResponse, metricResponse] = await Promise.all([
                fetch(`${REACT_NATIVE_API_BASE_URL}/api/negotiations?timestamp=${Date.now()}`, {
                    headers: {
                        'x-api-key': REACT_NATIVE_API_KEY,
                    },
                }),
                fetch(`${REACT_NATIVE_API_BASE_URL}/api/crops?timestamp=${Date.now()}`, {
                    headers: {
                        'x-api-key': REACT_NATIVE_API_KEY,
                    },
                }),
                fetch(`${REACT_NATIVE_API_BASE_URL}/api/users?timestamp=${Date.now()}`, {
                    headers: {
                        'x-api-key': REACT_NATIVE_API_KEY,
                    },
                }),
                fetch(`${REACT_NATIVE_API_BASE_URL}/api/metric_systems?timestamp=${Date.now()}`, {
                    headers: {
                        'x-api-key': REACT_NATIVE_API_KEY,
                    },
                }),
            ]);

            const [negotiationsData, cropsData, usersData, metricSystemsData] = await Promise.all([
                negotiationsResponse.ok ? negotiationsResponse.json() : [],
                cropsResponse.ok ? cropsResponse.json() : [],
                usersResponse.ok ? usersResponse.json() : [],
                metricResponse.ok ? metricResponse.json() : [],
            ]);

            const filteredNegos = negotiationsData
                .filter(negotiation => negotiation.shop_id === shopData.shop_id)
                .sort((a, b) => b.negotiation_id - a.negotiation_id);

            const enhancedNegotiations = filteredNegos.map(negotiation => {
                const cropInfo = cropsData.find(crop => crop.crop_id === negotiation.crop_id);
                const userInfo = usersData.find(user => user.user_id === negotiation.user_id);
                const metricInfo = metricSystemsData.find(metric => metric.metric_system_id === negotiation.metric_system_id);

                return {
                    ...negotiation,
                    crops: cropInfo || {},
                    users: userInfo || {},
                    metric_system: metricInfo || {},
                };
            });

            setNegotiationData(enhancedNegotiations);

        } catch (error) {
            console.error('Error fetching negotiations or related data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await getAsyncShopData();
        };

        fetchData();
    }, []);

    useEffect(() => {
        let interval;

        if (shopData) {
            fetchNegotiations();
            interval = setInterval(() => {
                fetchNegotiations();
            }, 5000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [shopData]);

    useEffect(() => {
        if (negotiationData) {
            const filtered = negotiationData.filter((data) => {
                const cleanedStatus = data.negotiation_status.replace(/'::character varying/g, "").replace(/'/g, "").trim();
                return cleanedStatus === selectedStatus;
            });
            setFilteredNegotiations(filtered);
        }
    }, [negotiationData, selectedStatus]);

    if (loading) {
        return (
            <SafeAreaView className="bg-white flex-1 justify-center items-center">
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <StyledSafeAreaView className="flex-1 bg-white">
            <StyledView className="flex-row justify-around py-1">
                {["Ongoing", "Approved", "Completed", "Cancelled"].map((status) => (
                    <StyledTouchableOpacity
                        key={status}
                        className={`border-b-2 ${selectedStatus === status ? 'border-[#00B251]' : 'border-transparent'}`}
                        onPress={() => setSelectedStatus(status)}
                    >
                        <StyledText className={`text-lg font-semibold ${selectedStatus === status ? 'text-[#00B251]' : 'text-gray-600'}`}>
                            {status}
                        </StyledText>
                    </StyledTouchableOpacity>
                ))}
            </StyledView>

            <StyledScrollView contentContainerStyle={{ paddingVertical: 20 }} className="flex-1 px-5 bg-white">
                <StyledView className="space-y-6 mb-10">
                    {filteredNegotiations && filteredNegotiations.length > 0 ? (
                        filteredNegotiations.map((data) => (
                            <StyledTouchableOpacity
                                key={data.negotiation_id}
                                className="bg-white border border-gray-300 rounded-lg shadow-lg p-4"
                                onPress={() => navigation.navigate('Seller Negotiation')}
                                style={{
                                    shadowColor: "#000",
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    elevation: 5,
                                }}
                            >
                                <StyledView className="flex-row bg-white rounded-lg shadow-md ">
                                    <StyledView className="w-1/3 pr-2">
                                        <Image
                                            source={{ uri: data.crops.crop_image_url }}
                                            className="w-full h-32 object-cover rounded-md"
                                            resizeMode="cover"
                                        />
                                    </StyledView>

                                    <StyledView className="w-2/3 pl-2 space-y-2">
                                        {/* Crop Name */}
                                        <StyledText className="text-xl font-bold text-[#00B251]">
                                            {data.crops.crop_name}
                                        </StyledText>

                                        {/* Buyer's Details */}
                                        <StyledText className="text-sm font-semibold text-gray-600">
                                            Buyer: <Text className="text-gray-800">{data.users.firstname} {data.users.lastname}</Text>
                                        </StyledText>

                                        {/* Price Section */}
                                        <StyledView className="bg-gray-50 p-2 rounded-lg border border-gray-200">
                                            {/* Original Price */}
                                            <StyledView className="flex-row justify-between items-center pb-1 mb-1.5 border-b border-gray-400">
                                                <StyledText className="text-sm font-medium text-gray-700">Original Price:</StyledText>
                                                <StyledText className="text-sm text-gray-800">
                                                    ₱{data.crops.crop_price.toFixed(2)} / {data.metric_system.metric_system_symbol}
                                                </StyledText>
                                            </StyledView>

                                            {/* Buyer's Offered Price */}
                                            <StyledView className="flex-row justify-between items-center mb-1">
                                                <StyledText className="text-sm font-medium text-gray-700">Offered Price:</StyledText>
                                                <StyledText className="text-sm text-gray-800">₱{data.user_price.toFixed(2)}</StyledText>
                                            </StyledView>

                                            {/* Offered Amount */}
                                            <StyledView className="flex-row justify-between items-center mb-1">
                                                <StyledText className="text-sm font-medium text-gray-700">Offered Amount:</StyledText>
                                                <StyledText className="text-sm text-gray-800">
                                                    {data.user_amount} {data.metric_system.metric_system_symbol}
                                                </StyledText>
                                            </StyledView>

                                            {/* Total Offered Price */}
                                            <StyledView className="flex-row justify-between items-center mb-1">
                                                <StyledText className="text-sm font-medium text-gray-700">Total Offered Price:</StyledText>
                                                <StyledText className="text-sm font-bold text-[#00B251]">₱{data.user_total.toFixed(2)}</StyledText>
                                            </StyledView>
                                        </StyledView>
                                    </StyledView>
                                </StyledView>
                                {data.buyer_turn ? (
                                    <StyledView className="flex-row items-center space-x-2 mt-2">
                                        {/* Icon for waiting */}
                                        <Icon name="hourglass-half" size={20} color="#FFA500" />
                                        {/* Waiting for response message */}
                                        <StyledText className="text-gray-700 font-medium">
                                            Waiting for <Text className="font-bold">Buyer's</Text> response.
                                        </StyledText>
                                    </StyledView>
                                ) : (
                                    <StyledView className="flex-row items-center space-x-2 mt-2">
                                        {/* Icon for counteroffer */}
                                        <Icon name="handshake-o" size={20} color="#00B251" />
                                        {/* Counteroffer message */}
                                        <StyledText className="text-gray-700 font-medium">
                                            <Text className="font-bold">Buyer</Text> has made an offer. Tap the item for details.
                                        </StyledText>
                                    </StyledView>
                                )}
                            </StyledTouchableOpacity>
                        ))
                    ) : (
                        <StyledText className="text-center text-gray-500">
                            No negotiation data found
                        </StyledText>
                    )}
                </StyledView>
            </StyledScrollView>
        </StyledSafeAreaView>
    );
}

export default NegotiationSellerListScreen;
