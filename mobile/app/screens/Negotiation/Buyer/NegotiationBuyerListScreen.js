import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { styled } from 'nativewind';
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/FontAwesome';
import NavigationbarComponent from "../../../components/NavigationbarComponent";

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
    const [shopsData, setShopsData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [metricSystemData, setMetricSystemData] = useState(null);
    const [filteredNegotiations, setFilteredNegotiations] = useState([]);

    const getAsyncUserData = async () => {
        try {
            const storedData = await AsyncStorage.getItem("userData");

            if (storedData) {
                const parsedData = JSON.parse(storedData);

                if (Array.isArray(parsedData)) {
                    const user = parsedData[0];
                    setUserData(user);
                } else {
                    setUserData(user);
                }
            }
        } catch (error) {
            console.error("Failed to load user data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchNegotiations = async () => {
        if (!userData) return;

        try {
            const [negotiationsResponse, cropsResponse, shopsResponse, metricResponse] = await Promise.all([
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
                fetch(`${REACT_NATIVE_API_BASE_URL}/api/shops?timestamp=${Date.now()}`, {
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

            const [negotiationsData, cropsData, shopsData, metricSystemsData] = await Promise.all([
                negotiationsResponse.ok ? negotiationsResponse.json() : [],
                cropsResponse.ok ? cropsResponse.json() : [],
                shopsResponse.ok ? shopsResponse.json() : [],
                metricResponse.ok ? metricResponse.json() : [],
            ]);

            const filteredNegos = negotiationsData
                .filter(negotiation => negotiation.user_id === userData.user_id)
                .sort((a, b) => b.negotiation_id - a.negotiation_id);

            const enhancedNegotiations = filteredNegos.map(negotiation => {
                const cropInfo = cropsData.find(crop => crop.crop_id === negotiation.crop_id);
                const shopInfo = shopsData.find(shop => shop.shop_id === negotiation.shop_id);
                const metricInfo = metricSystemsData.find(metric => metric.metric_system_id === negotiation.metric_system_id);

                return {
                    ...negotiation,
                    crops: cropInfo || {},
                    shops: shopInfo || {},
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
            await getAsyncUserData();
        };

        fetchData();
    }, []);

    useEffect(() => {
        let interval;

        if (userData) {
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
    }, [userData]);

    useEffect(() => {
        if (negotiationData) {
            const filtered = negotiationData.filter((data) => {
                const cleanedStatus = data.negotiation_status.replace(/'::character varying/g, "").replace(/'/g, "").trim();
                return cleanedStatus === selectedStatus;
            });
            setFilteredNegotiations(filtered);
        }
    }, [negotiationData, selectedStatus]);

    const handleCheckout = (product) => {
        const selectedItems = [{
            cart_crop_id: product.crop_id,
            cart_id: product.negotiation_id,
            cart_metric_system_id: product.metric_system.metric_system_id,
            cart_total_price: product.final_total,
            cart_total_quantity: product.final_amount,
            cart_user_id: product.user_id,
            crop_id: product.crop_id,
            crop_image_url: product.crops.crop_image_url,
            crop_name: product.crops.crop_name,
            crop_price: product.final_price,
            crop_quantity: product.crops.crop_quantity,
            metric_system_name: product.metric_system.metric_system_name,
            metric_system_symbol: product.metric_system.metric_system_symbol,
            selected: true,
            shopName: product.shops.shop_name,
            shop_id: product.shop_id,
            crop_class: product.crops.crop_class,
            crop_description: product.crops.crop_description,
        }];

        navigation.navigate("CheckOutScreen", { items: selectedItems, user: userData, order_type: 'negotiation', cart_type: 'negotiate' });
    };

    if (loading) {
        return (
            <SafeAreaView className="bg-white flex-1 justify-center items-center">
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <>
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
                                    className="bg-white border border-[#00b251] rounded-lg shadow-lg p-4"
                                    onPress={() => navigation.navigate('Buyer Edit Negotiation', { data })}
                                    style={{
                                        shadowColor: "#000",
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 3.84,
                                        elevation: 5,
                                    }}
                                >
                                    <StyledView className="flex-row">
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
                                                    Buyer: <Text className="text-gray-800">{data.shops.shop_name}</Text>
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
                                                        <StyledText className="text-sm font-medium text-gray-700">Your Offered Price:</StyledText>
                                                        <StyledText className="text-sm text-gray-800">₱{data.user_price.toFixed(2)}</StyledText>
                                                    </StyledView>

                                                    {/* Offered Amount */}
                                                    <StyledView className="flex-row justify-between items-center mb-1">
                                                        <StyledText className="text-sm font-medium text-gray-700">Your Offered Amount:</StyledText>
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
                                    </StyledView>

                                    <StyledView className="w-full p-1">
                                        {(() => {
                                            if (data.buyer_turn === true && selectedStatus === 'Ongoing') {
                                                return (
                                                    <StyledView className="flex-row items-center space-x-2">
                                                        {/* Icon for counteroffer */}
                                                        <Icon name="handshake-o" size={20} color="#00B251" />
                                                        {/* Counteroffer message */}
                                                        <StyledText className="text-gray-700 font-medium">
                                                            <Text className="font-bold">Seller</Text> has made a counteroffer. Tap the item for details.
                                                        </StyledText>
                                                    </StyledView>
                                                );
                                            } else if (data.buyer_turn === false && selectedStatus === 'Ongoing') {
                                                return (
                                                    <StyledView className="flex-row items-center space-x-2">
                                                        {/* Icon for waiting */}
                                                        <Icon name="hourglass-half" size={20} color="#FFA500" />
                                                        {/* Waiting for response message */}
                                                        <StyledText className="text-gray-700 font-medium">
                                                            Waiting for <Text className="font-bold">Seller's</Text> response.
                                                        </StyledText>
                                                    </StyledView>
                                                );
                                            } else if (selectedStatus === 'Approved') {
                                                return (
                                                    <StyledView className="flex-row items-center w-full mt-1">
                                                        {/* Proceed to Checkout Button */}
                                                        <StyledTouchableOpacity
                                                            className="bg-[#00B251] px-1 py-1 rounded-lg w-full h-9"
                                                            onPress={() => handleCheckout(data)}
                                                        >
                                                            <StyledText className="text-white font-bold text-center text-base">Proceed to Checkout</StyledText>
                                                        </StyledTouchableOpacity>
                                                    </StyledView>
                                                );
                                            } else {
                                                return (
                                                    <StyledView className="flex-row items-center space-x-2">
                                                        {/* Icon for waiting */}
                                                        <Icon name="hourglass-half" size={20} color="#FFA500" />
                                                        {/* Waiting for response message */}
                                                        <StyledText className="text-gray-700 font-medium">
                                                            Tap the item for details.
                                                        </StyledText>
                                                    </StyledView>
                                                );
                                            }
                                        })()}
                                    </StyledView>
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
            <NavigationbarComponent />
        </>
    );
}

export default NegotiationSellerListScreen;
