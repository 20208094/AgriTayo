import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";

function BusinessInformationScreen({ navigation, route }) {
  const { profile } = route.params;
  const submitBusinessInformationOption = [
    { label: "Submit Now", value: "now" },
    { label: "Submit Later", value: "later" },
  ];
  const [selectedBusinessInformation, setSelectedBusinessInformation] =
    useState("");

  const sellerTypeOption = [
    { label: "Sole Proprietorship", value: "soleProprietorship" },
    { label: "Partnership/Corporation", value: "partnershipCorporation" },
  ];

  const [selectedSelerType, setSelectedSelerType] = useState("");

  const valueAddedTaxRegistrationStatusOption = [
    { label: "Vat Registered", value: "vatRegistered" },
    { label: "Non-Vat Registered", value: "nonVatRegistered" },
  ];

  const [
    selectedValueAddedTaxRegistrationStatus,
    setselectedValueAddedTaxRegistrationStatus,
  ] = useState("");

  const submitSwornDeclarationOption = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ];

  const [selectedsubmitSwornDeclaration, setselectedsubmitSwornDeclaration] =
    useState("");

  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  return (
    <SafeAreaView className="">
      <ScrollView className="">
        <Text className="">Shop Infromation</Text>
        <Text className="">Business Information</Text>
        <Text className="">
          The information will be used to ensure proper compliance to seller
          onboarding requirements to e-marketplace and invoicing purposes.
          (Note: Shopee will not re-issue any invoices or tax documents due to
          incomplete or incorrect infromation provided by sellers.)
        </Text>
        <Text className="">Submit Business Information? </Text>
        <View className="mb-4">
          {submitBusinessInformationOption.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setSelectedBusinessInformation(option.value)}
              className="flex-row items-center mr-6 mb-1"
            >
              <View className="w-8 h-8 rounded-full border-2 border-green-600 flex items-center justify-center">
                {selectedBusinessInformation === option.value && (
                  <FontAwesome name="check" size={25} color="#00B251" />
                )}
              </View>
              <Text className="ml-2 text-gray-800">{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text className="">
          You may not choose to submit your Business Information some other time
          if you're not yet ready. However, you will not be allowed to start
          selling on our platform until you do so.
        </Text>
        <Text className="">Seller type</Text>
        <View className="mb-4">
          {sellerTypeOption.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setSelectedSelerType(option.value)}
              className="flex-row items-center mr-6 mb-1"
            >
              <View className="w-8 h-8 rounded-full border-2 border-green-600 flex items-center justify-center">
                {selectedSelerType === option.value && (
                  <FontAwesome name="check" size={25} color="#00B251" />
                )}
              </View>
              <Text className="ml-2 text-gray-800">{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text className="">Registered Name</Text>
        <TextInput className="" placeholder="Input" />
        <Text className="">Last Name, First Name (eg. Dela Cruz, Juan)</Text>
        <TouchableOpacity
          className=""
          onPress={() => navigation.navigate("View Address", { profile })}
        >
          <Text className="">Registered Address</Text>
          <Text className="">Taxpayer Identification Number {"\n"} (TIN)</Text>
          <TextInput className="" placeholder="TIN" />
        </TouchableOpacity>
        <Text className="">
          Your 9-digit TIN and 3 to 5 digit branch code. Please use '000' as
          your branch code if you don't have one (e.g. 999-999-999-000)
        </Text>
        <Text className="">Value Added Tax Registration Status</Text>
        <View className="mb-4">
          {valueAddedTaxRegistrationStatusOption.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() =>
                setselectedValueAddedTaxRegistrationStatus(option.value)
              }
              className="flex-row items-center mr-6 mb-1"
            >
              <View className="w-8 h-8 rounded-full border-2 border-green-600 flex items-center justify-center">
                {selectedValueAddedTaxRegistrationStatus === option.value && (
                  <FontAwesome name="check" size={25} color="#00B251" />
                )}
              </View>
              <Text className="ml-2 text-gray-800">{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text className="">BIR Certificate of Registration</Text>
        <TouchableOpacity className="" onPress={""}>
          <Text className="">+ Upload</Text>
        </TouchableOpacity>
        <Text className="">Support JPG, JPEG, PNG, PDF. Maximum: 20mb</Text>
        <Text className="">Business Name/Trade Name</Text>
        <TextInput className="" placeholder="Input" />
        <Text className="">
          If Business Name/Trade is not applicable, please enter your Taxpayer
          Name as indicated on your BIR CoR instead (e.g Acme, Inc.)
        </Text>
        <Text className="">Submit Sworn Declaration</Text>
        <View className="mb-4">
          {submitSwornDeclarationOption.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setselectedsubmitSwornDeclaration(option.value)}
              className="flex-row items-center mr-6 mb-1"
            >
              <View className="w-8 h-8 rounded-full border-2 border-green-600 flex items-center justify-center">
                {selectedsubmitSwornDeclaration === option.value && (
                  <FontAwesome name="check" size={25} color="#00B251" />
                )}
              </View>
              <Text className="ml-2 text-gray-800">{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text className="">
          Submission of Sword Sworn Declaration is required to be exempted from
          withholding tax if your total annual gross remittance is less than or
          equal to P500,000.00.
        </Text>
        <View className="mb-4">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => setIsTermsAccepted(!isTermsAccepted)}
              className="mr-2"
            >
              <View className="w-8 h-8 rounded-full border-2 border-green-600 flex items-center justify-center">
                {isTermsAccepted && (
                  <FontAwesome name="check" size={25} color="#00B251" />
                )}
              </View>
            </TouchableOpacity>
            <View className="flex-row flex-wrap items-center">
              <Text className="text-gray-600">I agree to the </Text>
              <TouchableOpacity onPress={() => navigation.navigate("")}>
                <Text className="text-green-500">Terms and Conditions</Text>
              </TouchableOpacity>
              <Text className="text-gray-600"> and </Text>
              <TouchableOpacity onPress={() => navigation.navigate("")}>
                <Text className="text-green-500">Privacy Policy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default BusinessInformationScreen;
