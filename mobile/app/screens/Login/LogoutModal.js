import React, { useState } from "react";
import { View, Text, Modal, Button, ActivityIndicator } from "react-native";
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
      <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
        <View className="bg-white rounded-lg p-4 w-4/5">
          {loading ? (
            <View className="flex items-center justify-center">
              <ActivityIndicator size="large" color="#0000ff" />
              <Text className="text-lg font-semibold mt-4">Logging out...</Text>
            </View>
          ) : (
            <>
              <Text className="text-lg font-semibold mb-4">
                Are you sure you want to log out?
              </Text>
              {errorMessage ? (
                <Text className="text-red-600 mb-4">{errorMessage}</Text>
              ) : null}
              <View className="flex-row justify-around">
                <Button title="Cancel" onPress={onCancel} />
                <Button title="Log Out" onPress={handleLogout} color="red" />
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default styled(LogoutModal);
