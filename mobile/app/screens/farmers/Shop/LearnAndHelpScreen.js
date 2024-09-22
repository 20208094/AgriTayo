import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

function LearnAndHelpScreen({ navigation }) {
    return (
        <SafeAreaView className="flex-1 bg-white p-4">
            <Text className="text-xl font-semibold text-gray-800 mb-4">Learn and Help</Text>
            <View className="flex-row justify-between">
                <TouchableOpacity 
                    className="items-center" 
                    onPress={() => navigation.navigate('Seller FAQ')}
                >
                    <View className="h-16 w-16 justify-center items-center bg-gray-100 rounded-full mb-2">
                        <FontAwesome5 name="lightbulb" size={24} color="#00B251" />
                    </View>
                    <Text className="text-center text-sm text-gray-600">Seller FAQ</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    className="items-center" 
                    onPress={() => navigation.navigate('Chat Support')}
                >
                    <View className="h-16 w-16 justify-center items-center bg-gray-100 rounded-full mb-2">
                        <FontAwesome5 name="comments" size={24} color="#00B251" />
                    </View>
                    <Text className="text-center text-sm text-gray-600">Chat Support</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default LearnAndHelpScreen;
