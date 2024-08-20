import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, View, Text, Image, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { styled } from "nativewind";
import michael from "../../assets/ehh.png";

function MessageSellerScreen({ route }) {
  const { product } = route.params;
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    // Example chat messages
    { id: 1, text: "Hi, I have a question about the product.", sender: "buyer" },
    { id: 2, text: "Sure, what would you like to know?", sender: "seller" },
  ]);

  const flatListRef = useRef();

  const handleSendMessage = () => {
    if (message.trim()) {
      setChatHistory([
        ...chatHistory,
        { id: chatHistory.length + 1, text: message, sender: "buyer" },
      ]);
      setMessage("");
    }
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [chatHistory]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4 bg-gray-100 flex-row items-center border-b border-gray-300">
        <Image source={michael} className="w-20 h-20 rounded-full" />
        <View className="ml-4">
          <Text className="text-lg font-bold">{product.seller.name}</Text>
          <Text className="text-sm text-gray-500">Last seen: 5 minutes ago</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={chatHistory}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className={`p-4 m-2 rounded-lg ${item.sender === "buyer" ? "bg-[#00B251] self-end" : "bg-gray-200 self-start"}`}>
            <Text className={`${item.sender === "buyer" ? "text-white" : "text-black"}`}>{item.text}</Text>
          </View>
        )}
        className="flex-1 p-4 bg-gray-50"
      />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="p-4 bg-white border-t border-gray-300">
        <View className="flex-row items-center rounded-full border border-gray-300 p-2">
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            className="flex-1 p-2 text-gray-700"
          />
          <TouchableOpacity onPress={handleSendMessage} className="bg-[#00B251] p-2 rounded-full ml-2">
            <Text className="text-white font-bold">Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default styled(MessageSellerScreen);
