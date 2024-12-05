import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import { Ionicons } from "@expo/vector-icons";

function ChangePasswordScreen({ navigation, route }) {
  const { userData } = route.params;

  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const password_regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,30}$/;

  useEffect(() => {
    if (newPassword && !password_regex.test(newPassword)) {
      setPasswordError(
        "Invalid Password. Please enter 8-30 characters, including letters and numbers."
      );
    } else {
      setPasswordError("");
    }
  }, [newPassword]);

  console.log(userData);

  const handleNewPassword = async () => {
    setPasswordError("");
    let hasError = false;

    if (!newPassword) {
      setPasswordError("Enter your password");
      hasError = true;
    } else if (!password_regex.test(newPassword)) {
      setPasswordError(
        "Invalid Password. Please enter 8-30 characters, including letters and numbers"
      );
      return;
    }

    const formData = new FormData();
    formData.append("pass", newPassword);

    setLoading(true);
    try {
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/editPassword/${userData.user_id}`,
        {
          method: "PUT",
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Successfully Updated Password", data);
        setAlertMessage("Successfully Updated Password");
        setAlertVisible(true);
        navigation.navigate("Profile");
      } else {
        const errorData = await response.json();
        console.error("Updating new password failed:", errorData);
        setAlertMessage("Updating the New Password Failed. Please Try Again");
        setAlertVisible(true);
      }
    } catch (error) {
      console.error("Error during updating the new password:", error);
      setAlertMessage("An error occurred. Please try again.");
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 justify-center items-center px-5">
        <View className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <Text className="text-2xl font-bold text-green-700 mb-4 text-center">
            Enter Your New Password
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
            placeholder="e.g., &#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          {passwordError ? (
            <Text className="w-4/5 text-red-500 mb-4">{passwordError}</Text>
          ) : null}
          <TouchableOpacity
            onPress={() => setConfirmModalVisible(true)}
            className="bg-green-600 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-bold text-center">Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-[80%]">
            <Text className="text-lg font-semibold mb-4">
              Confirm New Password
            </Text>
            <Text>Do you really want to update this password?</Text>
            <View className="flex-row justify-end mt-4 space-x-4">
              <TouchableOpacity
                className="bg-gray-300 px-4 py-2 rounded-lg"
                onPress={() => setConfirmModalVisible(false)}
              >
                <Text className="text-black">No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-[#00B251] px-4 py-2 rounded-lg"
                onPress={() => {
                  setConfirmModalVisible(false);
                  handleNewPassword();
                }}
              >
                <Text className="text-white">Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Alert Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={alertVisible}
        onRequestClose={() => setAlertVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-[80%]">
            <Text className="text-lg mb-4 text-center">{alertMessage}</Text>
            <TouchableOpacity
              className="bg-[#00B251] p-3 rounded-lg flex-row justify-center items-center"
              onPress={() => setAlertVisible(false)}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={24}
                color="white"
              />
              <Text className="text-white text-center font-semibold ml-2">
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default styled(ChangePasswordScreen);
