import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Image, Text, TouchableOpacity } from "react-native";

function BiddingDetailsScreen({ route }) {
    const { data } = route.params;
  
    // Convert initial time to seconds
    const initialTimeInSeconds = data.day * 86400 + data.hour * 3600 + data.minutes * 60;

    // State to store remaining time in seconds
    const [remainingTime, setRemainingTime] = useState(initialTimeInSeconds);

    // useEffect to handle countdown logic
    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingTime(prevTime => {
                if (prevTime <= 0) {
                    clearInterval(interval); // Stop the timer when it reaches zero
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(interval); // Clear the interval on component unmount
    }, []);

    // Function to format time in days, hours, and minutes
    const formatTime = (totalSeconds) => {
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    return (
        <SafeAreaView className="">
            <View className="">
                <Image
                    source={data.pic}
                    className="w-full h-50 rounded-lg mb-2.5"
                />
            </View>
            <View className="">
                <Text className="">
                    Current Highest Bid: ₱{data.currentHighestBid}
                </Text>
                {/* Countdown Timer */}
                <Text className="">
                    {formatTime(remainingTime)}
                </Text>
            </View>
            <View className="">
                <Image source={data.michael} className="w-24 h-24 rounded-full" />
                <Text className="">{data.shopName}</Text>
            </View>
            <View className="">
                <Text className="">Product Details</Text>
                <Text className=''>{data.discription}</Text>
            </View>
            <TouchableOpacity className="">
                <Text className="">Place a Bid</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

export default BiddingDetailsScreen;
