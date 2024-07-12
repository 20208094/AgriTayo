import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import MessageTable from "../components/MessageTable";

const messages = [
  {
    id: 1,
    title: "this is a title",
    messages: "this is a message",
  },

  {
    id: 2,
    title: "this is a title 2",
    messages: "this is a message 2",
  },
];

function MessageScreen() {
  return (
    <ScrollView className=''>
      {messages.map((message) => (
        <MessageTable key={message.id} message={message} />
      ))}
    </ScrollView>
  );
}

export default MessageScreen;
