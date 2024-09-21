import React from 'react';
import { TouchableOpacity, SafeAreaView, Text, Alert, View } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const Reports = ({ data, dataType }) => {
  const generatePdf = async () => {
    try {
      // Check if there is data
      if (data.length === 0) {
        Alert.alert('Error', `No ${dataType} to generate report.`);
        return;
      }

      // Get the keys from the first object for the table header
      const headers = Object.keys(data[0]);

      // Table header
      const tableHeader = `
        <table border="1" cellpadding="5" cellspacing="0">
          <tr>
            ${headers.map(header => `<th>${header.charAt(0).toUpperCase() + header.slice(1)}</th>`).join('')}
          </tr>
      `;

      // Dynamically generate table rows from the data
      const tableRows = data
        .map(
          (item) => `
          <tr>
            ${headers.map(header => `<td>${item[header]}</td>`).join('')}
          </tr>
        `
        )
        .join('');

      const tableFooter = `</table>`;

      const reportTitle = `${dataType.charAt(0).toUpperCase() + dataType.slice(1)} Report`;
      const reportDate = `Date: ${new Date().toLocaleDateString()}`;

      // HTML structure for the PDF
      const html = `
        <html>
          <body style="font-family: Arial, sans-serif;">
            <h1 style="text-align: center;">${reportTitle}</h1>
            <p style="text-align: center;">${reportDate}</p>
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

      // Display success message
      Alert.alert('Success', `${dataType.charAt(0).toUpperCase() + dataType.slice(1)} PDF file saved to your Documents folder.`);

      // Share the PDF file
      await Sharing.shareAsync(newPath);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', `Could not generate or save the ${dataType} PDF file.`);
    }
  };

  return (
    <SafeAreaView className="flex flex-row justify-end px-4 mt-4">
      <TouchableOpacity
        className="bg-green-600 py-3 px-6 rounded-lg shadow-lg w-2/4 max-w-xs"
        onPress={generatePdf}
        activeOpacity={0.8}
      >
        <Text className="text-white font-semibold text-center">
          Generate PDF
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Reports;
