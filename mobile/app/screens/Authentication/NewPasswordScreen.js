import React, {useState} from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";

function NewPasswordScreen({ navigation, route }) {

  const {phoneNumber} = route.params

  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)

  console.log(phoneNumber)

  const handleNewPassword = async() => {
    const formData = new FormData();
    formData.append("pass", newPassword)

      setLoading(true);
      try {
        const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/changePassword/${phoneNumber}`, {
          method: "PUT",
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Successfully Updated Password")
          Alert.alert("Success!", "Successfully Updated Password")
          navigation.navigate("Login");
        } else {
          const errorData = await response.json();
          console.error("Registration failed:", errorData);
          alert("Registration Failed. Please Try Again");
        }
      } catch (error) {
        console.error("Error during registration:", error);
        alert("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 justify-center items-center px-5">
        <View className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <Text className="text-2xl font-bold text-green-700 mb-4 text-center">
            Enter Your New Password
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
            placeholder="Password"
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Confirm New Password",
                "Do you really want to update this password?",
                [
                  {
                    text: "No",
                    onPress: () => console.log("New Password Updated"),
                    style: "cancel",
                  },
                  {
                    text: "Yes",
                    onPress: handleNewPassword,
                  },
                ],
                { cancelable: false }
              );
            }}
            className="bg-green-600 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-bold text-center">Confirm </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default styled(NewPasswordScreen);
