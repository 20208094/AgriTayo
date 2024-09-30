import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

function LearnAndHelpScreen({ navigation }) {
    // Function to navigate to the chat screen with the admin (user ID: 1)
    const handleChatSupportClick = () => {
        const adminId = 1;
        const adminName = 'Admin'; // Assuming the admin's name is 'Admin', modify if needed
        navigation.navigate('ChatScreen', { receiverId: adminId, receiverName: adminName });
    };

    return (
        <SafeAreaView className="flex-1 bg-white p-6">
            {/* Header Text */}
            <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">Learn and Help</Text>

            {/* Action Buttons */}
            <View className="flex-row justify-center space-x-8">
                {/* Seller FAQ Button */}
                <TouchableOpacity 
                    className="items-center"
                    onPress={() => navigation.navigate('Seller FAQ')}
                >
                    <View className="h-20 w-20 justify-center items-center bg-gray-100 rounded-full shadow-lg mb-3">
                        <FontAwesome5 name="lightbulb" size={26} color="#00B251" />
                    </View>
                    <Text className="text-center text-base text-gray-700">Seller FAQ</Text>
                </TouchableOpacity>
                
                {/* Chat Support Button */}
                <TouchableOpacity 
                    className="items-center" 
                    onPress={handleChatSupportClick} // Navigate to chat with admin
                >
                    <View className="h-20 w-20 justify-center items-center bg-gray-100 rounded-full shadow-lg mb-3">
                        <FontAwesome5 name="comments" size={26} color="#00B251" />
                    </View>
                    <Text className="text-center text-base text-gray-700">Chat Support</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default LearnAndHelpScreen;
