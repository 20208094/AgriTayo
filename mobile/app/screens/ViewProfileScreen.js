import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Modal, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons'; // Ensure you have this package installed

const editButton = require('../assets/edit.png');
const userImage = require('../assets/user.png'); // Import the user image

function ViewProfileScreen({ route, navigation }) {
    const { profile } = route.params;

    // State to manage input values
    const [firstName, setFirstName] = useState(profile.firstname);
    const [middleName, setMiddleName] = useState(profile.middlename);
    const [lastName, setLastName] = useState(profile.lastname);
    const [birthday, setBirthday] = useState(profile.birthday);
    const [gender, setGender] = useState(profile.gender);
    const [email, setEmail] = useState(profile.email);
    const [phone, setPhone] = useState(profile.phone || '091234567890'); // Default phone number

    const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <ScrollView className="flex-1 px-4">
                <View className="bg-white p-4 rounded-lg shadow-sm relative">
                    {/* Back Button */}
                    <TouchableOpacity 
                        className="absolute top-4 left-4"
                        onPress={() => navigation.goBack()} // Navigate back on press
                    >
                        <Ionicons name="arrow-back-outline" size={24} color="#50d71e" />
                    </TouchableOpacity>

                    {/* Circular frame with user image and shadow effect */}
                    <View className="items-center mb-4 mt-8">
                        <View className="relative w-24 h-24 rounded-full border-4 border-green-500 shadow-lg bg-white">
                            <Image 
                                source={userImage} 
                                className="w-full h-full rounded-full" 
                            />
                            <TouchableOpacity 
                                className="absolute bottom-0 right-0 bg-green-500 p-2 rounded-full"
                                onPress={() => setModalVisible(true)} // Show modal on press
                            >
                                <Ionicons name="pencil" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="flex-row items-center mb-2">
                        <Ionicons name="person-circle-outline" size={24} color="#50d71e" />
                        <Text className="text-lg font-medium text-gray-800 ml-2">Account Information</Text>
                    </View>

                    <View className="flex-row justify-between mb-2">
                        <View className="w-30%">
                            <Text className="text-base text-gray-600">First Name</Text>
                            <TextInput
                                value={firstName}
                                onChangeText={setFirstName}
                                className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
                            />
                        </View>
                        <View className="w-30%">
                            <Text className="text-base text-gray-600">Middle Name</Text>
                            <TextInput
                                value={middleName}
                                onChangeText={setMiddleName}
                                className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
                            />
                        </View>
                        <View className="w-30%">
                            <Text className="text-base text-gray-600">Last Name</Text>
                            <TextInput
                                value={lastName}
                                onChangeText={setLastName}
                                className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
                            />
                        </View>
                    </View>

                    <View className="mb-2">
                        <Text className="text-base text-gray-600 flex-row items-center">
                            <Ionicons name="calendar-outline" size={20} color="#50d71e" /> Birthday
                        </Text>
                        <TextInput
                            value={birthday}
                            onChangeText={setBirthday}
                            className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
                        />
                    </View>
                    <View className="mb-2">
                        <Text className="text-base text-gray-600 flex-row items-center">
                            <Ionicons name="male-female-outline" size={20} color="#50d71e" /> Gender
                        </Text>
                        <TextInput
                            value={gender}
                            onChangeText={setGender}
                            className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
                        />
                    </View>
                    <View className="mb-2">
                        <Text className="text-base text-gray-600 flex-row items-center">
                            <Ionicons name="mail-outline" size={20} color="#50d71e" /> Email
                        </Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
                        />
                    </View>
                    <View className="mb-4">
                        <Text className="text-base text-gray-600 flex-row items-center">
                            <Ionicons name="call-outline" size={20} color="#50d71e" /> Phone
                        </Text>
                        <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            className="mt-1 text-lg text-gray-900 border border-gray-300 rounded-lg p-2"
                            placeholder="091234567890" // Placeholder for phone number
                        />
                    </View>
                </View>

                <TouchableOpacity 
                    className="bg-green-500 py-3 rounded-lg flex-row justify-center items-center shadow-lg"
                    onPress={() => navigation.navigate('Edit Profile', { profile })}
                >
                    <Image source={editButton} className="w-6 h-6" style={{ tintColor: 'white' }} />
                    <Text className="text-lg text-white ml-2">Edit Profile</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Modal for user gallery */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                    <View className="bg-white p-6 rounded-lg shadow-lg w-3/4">
                        <Text className="text-lg font-semibold text-gray-900">User Gallery Here</Text>
                        <Pressable
                            className="absolute top-2 right-2 p-2 rounded-full bg-gray-200"
                            onPress={() => setModalVisible(false)}
                        >
                            <Ionicons name="close" size={24} color="gray" />
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

export default ViewProfileScreen;
