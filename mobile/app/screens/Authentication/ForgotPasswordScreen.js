import React, {useState, useEffect} from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import GoBack from "../../components/GoBack";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";

function ForgotPasswordScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const phone_regex = /^(?:\+63|0)9\d{2}[-\s]?\d{3}[-\s]?\d{4}$/;
  const [phoneError, setPhoneError] = useState("");
  const [phoneNumbersList, setPhoneNumbersList] = useState([]);

  useEffect(() => {
    const fetchPhoneNumbers = async () => {
      try {
        const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/users`, {
          headers: { "x-api-key": REACT_NATIVE_API_KEY },
        });
        if (response.ok) {
          const data = await response.json();
          const numbers = data.map((user) => user.phone_number);
          setPhoneNumbersList(numbers);
        } else {
          console.error("Failed to fetch phone numbers");
        }
      } catch (error) {
        console.error("Error fetching phone numbers:", error);
      }
    };

    fetchPhoneNumbers();
  }, []);

  const handleConfirm = () => {
    setPhoneError("");

    if (!phoneNumber) {
      setPhoneError("Enter your phone number");
      return;
    } else if (!phone_regex.test(phoneNumber)) {
      setPhoneError("Invalid phone number format. Please use 09 followed by 9 digits.");
      return;
    }else if (phoneNumbersList.includes(phoneNumber)) {
      navigation.navigate("Change Password OTP", { phoneNumber });
      Alert.alert('Success!','Phone Number Confirmed')
    } else {
      Alert.alert("Error", "Phone number not found. Please try again.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <GoBack navigation={navigation}/>
      <View className="flex-1 justify-center items-center px-5">
        <View className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <Text className="text-2xl font-bold text-green-700 mb-4 text-center">
            Phone Number
          </Text>
          <Text className="text-base text-gray-600 mb-4 text-center">
            Enter your phone number
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
            placeholder="Phone Number"
            keyboardType="phone-pad"
            autoCapitalize="none"
            autoCorrect={false}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          {phoneError ? (
            <Text className="w-4/5 text-red-500 mb-4">{phoneError}</Text>
          ) : null}
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              className="bg-gray-300 px-4 py-2 rounded-lg"
            >
              <Text className="text-gray-700 font-bold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Confirm Phone Number",
                  "Is this really your phone number?",
                  [
                    {
                      text: "No",
                      style: "cancel",
                    },
                    {
                      text: "Yes",
                      onPress: handleConfirm,
                    },
                  ],
                  { cancelable: false }
                );
              }}
              className="bg-green-600 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-bold">Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default styled(ForgotPasswordScreen);
