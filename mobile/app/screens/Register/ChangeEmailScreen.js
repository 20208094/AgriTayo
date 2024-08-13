import React, {useState} from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
  
function ChangeEmailScreen({ navigation }) {
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newEmailError, setNewEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const password_regex = /^[A-Za-z\d@.#$!%*?&^]{8,30}$/;
  const newEmail_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = () => {
    setNewEmailError('')
    setPasswordError('')

    let hasError = false;

    if (!newEmail) {
      setNewEmailError('Enter your Email')
      hasError = true
    }

    if (!password) {
      setPasswordError('Enter your Password')
      hasError = true
    }

    if (!hasError){
      if(newEmail_regex.test(newEmail) && password_regex.test(password)){
        navigation.navigate('OTP Screen')
      }else{
        if(!newEmail_regex.test(newEmail)){
          setNewEmailError('Invalid Email. Please try again')
        }
        if(!password_regex.test(password)){
          setPasswordError('Invalid Password. Please try again')
        }
      }
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 justify-center items-center px-5">
        <View className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <Text className="text-2xl font-bold text-green-700 mb-4 text-center">
            Change Email Address
          </Text>
          <Text className="text-base text-gray-600 mb-4 text-center">
            Please enter your new email and current password
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
            placeholder="New Email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setNewEmail}
            value={newEmail}
          />
          {newEmailError ? <Text className="w-4/5 text-red-500 mb-4">{newEmailError}</Text> : null}
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-2 mb-6"
            placeholder="Password"
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setPassword}
            value={password}
          />
           {passwordError ? <Text className="w-4/5 text-red-500 mb-4">{passwordError}</Text> : null}
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="bg-gray-300 px-4 py-2 rounded-lg"
            >
              <Text className="text-gray-700 font-bold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-green-600 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-bold">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default styled(ChangeEmailScreen);
