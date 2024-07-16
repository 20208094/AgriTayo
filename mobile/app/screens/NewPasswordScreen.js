import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function NewPasswordScreen({navigation}) {
  return (
    <SafeAreaView className=''>
      <View className="">
        <Text className="">Enter your new password</Text>
        <TextInput
          className=""
          placeholder="Password"
          secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity 
        className=""
        onPress={() => navigation.navigate('Login')}
        >
          <Text className="">Confirm</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default NewPasswordScreen;
