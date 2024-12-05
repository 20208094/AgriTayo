import React, {useState, useEffect} from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import GoBack from "../../components/GoBack";
import { Ionicons } from '@expo/vector-icons';

function NewPhoneNumberScreen({ navigation, route }) {

  const {secondaryPhoneNumber} = route.params

  const [newPassword, setNewPassword] = useState('')
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false)
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  console.log(secondaryPhoneNumber)

  const password_regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,30}$/;

  useEffect(() => {
    if (newPassword && !password_regex.test(newPassword)) {
      setPasswordError("Invalid Password. Please enter 8-30 characters, including letters and numbers.");
    } else {
      setPasswordError("");
    }
  }, [newPassword]);

  const handleNewPhoneNumber = async() => {
    setPasswordError("");

    let hasError = false;

    if (!newPassword) {
      setPasswordError("Enter your password");
      hasError = true;
    } else if (!password_regex.test(newPassword)) {
      setPasswordError("Invalid Password. Please enter 8-30 characters, including letters and numbers.");
      return;
    }
    
    const formData = new FormData();
    formData.append("phone_number", secondaryPhoneNumber)
    formData.append('pass', newPassword)

    if (!hasError && !passwordError) {
      setLoading(true);
      try {
        const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/changePhoneNumber/${secondaryPhoneNumber}`, {
          method: "PUT",
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Successfully Updated Phone Number and Password", data)
          setAlertMessage("Successfully Added Phone Number and Password");
          setAlertVisible(true);
          navigation.navigate("Login");
        } else {
          const errorData = await response.json();
          console.error("Adding new phone number and password failed:", errorData);
          setAlertMessage("Adding New Phone Number Failed. Please Try Again");
          setAlertVisible(true);
        }
      } catch (error) {
        console.error("Error during adding new phone number and password:", error);
        setAlertMessage("An error occurred. Please try again.");
        setAlertVisible(true);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <TouchableOpacity
      className="absolute top-4 left-4"
      onPress={() => navigation.replace("Login")} // Navigate back on press
    >
      <Ionicons name="arrow-back-outline" size={24} color="#00b251" />
    </TouchableOpacity>
      <View className="flex-1 justify-center items-center px-5">
        <View className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <Text className="text-2xl font-bold text-green-700 mb-4 text-center">
            Enter Your New Password
          </Text>
          <Text className="text-md font-semibold text-gray-700 mb-4 text-center">
            New Phone Number: {secondaryPhoneNumber}
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
            onPress={() => {
              setAlertMessage("Do you really want to add this new password?");
              setConfirmModalVisible(true);
            }}
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
        <View className="flex-1 justify-center items-center bg-black/50 bg-opacity-50">
          <View className="bg-white p-6 rounded-lg shadow-lg w-3/4">
            <Text className="text-lg font-semibold text-gray-900 mb-4 text-center">
              {alertMessage}
            </Text>
            <View className="flex-row justify-between mt-4">
              <TouchableOpacity
                className="p-2 bg-gray-300 rounded-lg flex-row justify-center items-center w-1/3"
                onPress={() => setConfirmModalVisible(false)}
              >
                <Text className="text-lg text-gray-800 text-center">No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="p-2 bg-[#00B251] rounded-lg flex-row justify-center items-center w-1/3"
                onPress={() => {
                  setConfirmModalVisible(false);
                  handleNewPhoneNumber();
                }}
              >
                <Text className="text-lg text-white text-center">Yes</Text>
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
        <View className="flex-1 justify-center items-center bg-black/50 bg-opacity-50">
          <View className="bg-white p-6 rounded-lg shadow-lg w-3/4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">{alertMessage}</Text>
            <TouchableOpacity
              className="mt-4 p-2 bg-[#00B251] rounded-lg flex-row justify-center items-center"
              onPress={() => setAlertVisible(false)}
            >
              <Ionicons name="checkmark-circle-outline" size={24} color="white" />
              <Text className="text-lg text-white ml-2">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default styled(NewPhoneNumberScreen);
