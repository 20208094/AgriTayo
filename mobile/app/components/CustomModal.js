import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

const CustomModal = ({ isVisible, onClose, children }) => {
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
        <View className='w-4/5 p-5 bg-white rounded-lg items-center'>
        {children}
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal
