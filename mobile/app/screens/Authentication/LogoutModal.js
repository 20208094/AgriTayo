import React, { useState } from "react";
import { View, Text, Modal, ActivityIndicator, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";

const LogoutModal = ({ isVisible, onCancel, fetchUserSession, navigation }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogout = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/logout`, {
        method: "POST",
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Navigator' }],
        });
      } else {
        console.error("Error logging out:", response.statusText);
        setErrorMessage("Failed to log out. Please try again.");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      setErrorMessage("Logout failed due to a network issue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal transparent={true} visible={isVisible} animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/50 ">
        <View className="bg-white rounded-lg p-6 w-11/12 max-w-md">
          {loading ? (
            <View className="flex items-center justify-center">
              <ActivityIndicator size="large" color="#00B251" />
              <Text className="text-lg font-semibold mt-4">Logging out...</Text>
            </View>
          ) : (
            <>
              <Text className="text-xl font-semibold text-gray-800 mb-6 text-center">
                Are you sure you want to log out?
              </Text>
              {errorMessage ? (
                <Text className="text-red-600 mb-4 text-center">{errorMessage}</Text>
              ) : null}
              <View className="flex-row justify-between">
                <TouchableOpacity 
                  className="bg-gray-200 rounded-full px-6 py-3 flex-1 mx-2"
                  onPress={onCancel}
                >
                  <Text className="text-gray-800 text-center font-semibold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-[#00B251] rounded-full px-6 py-3 flex-1 mx-2"
                  onPress={handleLogout}
                >
                  <Text className="text-white text-center font-semibold">Log Out</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default styled(LogoutModal);
