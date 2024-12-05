import React, { useState } from 'react';
import { TouchableOpacity, SafeAreaView, Text, View, Modal } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from "@expo/vector-icons";

const Reports = ({ data, dataType }) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const generatePdf = async () => {
    try {
      // Check if there is data
      if (data.length === 0) {
        setAlertMessage(`No ${dataType} to generate report.`);
        setAlertVisible(true);
        return;
      }

      // Get the keys from the first object for the table header
      const headers = ['crop_name', 'crop_description', 'crop_price', 'crop_quantity', 'availability'];

      const headerLabels = {
        crop_name: "Crop Name",
        crop_description: "Description",
        crop_price: "Price",
        crop_quantity: "Quantity",
        availability: "Availability",
      };

      // Table header
      const tableHeader = `
    <table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse;">
      <tr style="background-color: #00B251; color: white;">
        ${headers.map(header => `<th style="padding: 8px;">${headerLabels[header]}</th>`).join('')}
      </tr>
  `;

      // Dynamically generate table rows from the data
      const tableRows = data
        .map(
          (item) => `
          <tr>
            ${headers.map(header => `<td style="padding: 8px; text-align: center;">${item[header]}</td>`).join('')}
          </tr>
        `
        )
        .join('');

      const tableFooter = `</table>`;

      const reportTitle = `${dataType.charAt(0).toUpperCase() + dataType.slice(1)} Report`;
      const reportDate = `Date: ${new Date().toLocaleDateString()}`;

      // HTML structure for the PDF with the logo at the top
      const html = `
        <html>
          <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; box-sizing: border-box;">
            <h1 style="text-align: center; color: #00B251;">${reportTitle}</h1>
            <p style="text-align: center; font-size: 14px;">${reportDate}</p>
            <div style="margin-top: 20px;">
              ${tableHeader}
              ${tableRows}
              ${tableFooter}
            </div>
          </body>
        </html>
      `;

      // Generate PDF file
      const { uri } = await Print.printToFileAsync({ html });

      // Define a new path where you want to save the file (in app's document directory)
      const newPath = `${FileSystem.documentDirectory}${dataType}_Report_2024.pdf`;

      // Move the file to the new path in app's directory
      await FileSystem.moveAsync({
        from: uri,
        to: newPath,
      });

      // Change success message
      setAlertMessage(`${dataType.charAt(0).toUpperCase() + dataType.slice(1)} PDF file saved to your Documents folder.`);
      setAlertVisible(true);

      // Share the PDF file
      await Sharing.shareAsync(newPath);
    } catch (error) {
      console.error(error);
      setAlertMessage(`Could not generate or save the ${dataType} PDF file.`);
      setAlertVisible(true);
    }
  };

  return (
    <SafeAreaView className="flex flex-row justify-end mt-4">
      <TouchableOpacity
        className="bg-[#00B251] py-3 px-4 rounded-lg shadow-lg"
        onPress={generatePdf}
        activeOpacity={0.8}
      >
        <Text className="text-white font-semibold text-center">
          Generate PDF
        </Text>
      </TouchableOpacity>

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
};

export default Reports;
