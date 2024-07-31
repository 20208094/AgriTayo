import React from "react";
import { View, Text, TextInput, TouchableOpacity} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function PhoneAuthenticationScreen({ navigation, route }) {
  const { profile } = route.params;
  return (
    <SafeAreaView className="">
      <View className="">
        <Text className="">Verify with Text Message</Text>
        <Text className="">A 6 digit code will be sent to</Text>
        <Text className="">{profile.phone}</Text>
      </View>
      <View className="">
        <Text className="">Please enter the authentication code.</Text>
        <TextInput
          className=""
          placeholder=""
          keyboardType="numeric"
          maxLength={1}
        />
        <TextInput
          className=""
          placeholder=""
          keyboardType="numeric"
          maxLength={1}
        />
        <TextInput
          className=""
          placeholder=""
          keyboardType="numeric"
          maxLength={1}
        />
        <TextInput
          className=""
          placeholder=""
          keyboardType="numeric"
          maxLength={1}
        />
        <TextInput
          className=""
          placeholder=""
          keyboardType="numeric"
          maxLength={1}
        />
        <TextInput
          className=""
          placeholder=""
          keyboardType="numeric"
          maxLength={1}
        />
        <View className="flex-row items-center mb-6">
          <Text className="text-gray-600">Didn’t receive the code? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Authentication')}>
            <Text className="text-green-500">Resend</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default PhoneAuthenticationScreen;
