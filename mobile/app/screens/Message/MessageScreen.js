import React, { useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, TextInput, Image } from "react-native";
import { styled } from 'nativewind';

const messagesData = [
  {
    id: 1,
    sender: "John Doe",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    message: "Hey, don't forget about the meeting at 3 PM.",
    isRead: false,
  },
  {
    id: 2,
    sender: "Jane Smith",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    message: "The new project updates have been released. Check them out!",
    isRead: false,
  },
  {
    id: 3,
    sender: "Alice Brown",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    message: "Join us for lunch at 12 PM in the cafeteria.",
    isRead: false,
  },
];

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledModalView = styled(View);
const StyledModalText = styled(Text);
const StyledModalTouchableOpacity = styled(TouchableOpacity);
const StyledModalTextInput = styled(TextInput);

function MessageScreen() {
  const [messages, setMessages] = useState(messagesData);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");

  const handlePress = (id) => {
    const message = messages.find(message => message.id === id);
    setSelectedMessage(message);
    markMessageAsRead(id);
  };

  const markMessageAsRead = (id) => {
    setMessages(messages.map(message => 
      message.id === id ? { ...message, isRead: true } : message
    ));
  };

  const closeModal = () => {
    setSelectedMessage(null);
    setReplyText("");
  };

  const handleReply = () => {
    // Implement reply functionality here, e.g., send replyText to backend or update state
    console.log(`Replying to message from ${selectedMessage.sender}: ${replyText}`);
    closeModal();
  };

  return (
    <StyledScrollView className="flex-1 p-4 bg-white">
      {messages.map((message) => (
        <StyledTouchableOpacity 
          key={message.id} 
          onPress={() => handlePress(message.id)}
          className={`flex-row items-center mb-4 p-3 rounded-lg shadow-sm ${message.isRead ? 'bg-white border-gray-300' : 'bg-green-100 border-green-500'}`}
        >
          <StyledView className="mr-3">
            <StyledTouchableOpacity className="rounded-full overflow-hidden">
              <Image source={{ uri: message.avatar }} style={{ width: 40, height: 40, borderRadius: 20 }} />
            </StyledTouchableOpacity>
          </StyledView>
          <StyledView className="flex-1">
            <StyledText className="font-semibold text-base">{message.sender}</StyledText>
            <StyledText className="text-sm text-gray-600">{message.message}</StyledText>
          </StyledView>
        </StyledTouchableOpacity>
      ))}

      {/* Modal for displaying full message */}
      <Modal
        visible={!!selectedMessage}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 justify-between bg-gray-900">
          <View className="flex-1">
            <TouchableWithoutFeedback onPress={closeModal}>
              <View className="flex-1"></View>
            </TouchableWithoutFeedback>
            <StyledModalView className="bg-white p-6 rounded-t-lg">
              <StyledText className="text-xl font-semibold mb-2 text-gray-800">{selectedMessage?.sender}</StyledText>
              <StyledText className="text-base text-gray-600 mb-4">{selectedMessage?.message}</StyledText>
              <View className="flex-row items-center justify-between bg-gray-100 p-3 rounded-lg">
                <StyledModalTextInput
                  multiline
                  numberOfLines={4}
                  value={replyText}
                  onChangeText={setReplyText}
                  placeholder="Type your reply here..."
                  className="flex-1 mr-2"
                />
                <StyledModalTouchableOpacity 
                  onPress={handleReply}
                  className="p-2 bg-blue-500 rounded-lg items-center justify-center"
                >
                  <StyledModalText className="text-white">Reply</StyledModalText>
                </StyledModalTouchableOpacity>
              </View>
            </StyledModalView>
          </View>
          <TouchableWithoutFeedback onPress={closeModal}>
            <View className="p-4 bg-gray-900 rounded-b-lg">
              <StyledModalText className="text-white">Close</StyledModalText>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    </StyledScrollView>
  );
}

export default MessageScreen;
