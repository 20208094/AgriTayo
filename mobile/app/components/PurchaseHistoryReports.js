import React from 'react';
import { TouchableOpacity, SafeAreaView, Text, Alert } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const PurchaseHistoryReports = ({ purchaseHistory }) => {
  const generatePdf = async () => {
    try {
      if (purchaseHistory.length === 0) {
        Alert.alert('Error', 'No purchase history available to generate the report.');
        return;
      }

      const headers = ['item_name', 'total_price', 'order_date', 'receive_date', 'shipping_method', 'payment_method'];

      const headerLabels = {
        item_name: "Item Name",
        total_price: "Total Price",
        order_date: "Order Date",
        receive_date: "Order Receive Date",
        shipping_method: "Shipping Method",
        payment_method: "Payment Method",
      };

      const tableHeader = `
        <table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #00B251; color: white;">
            ${headers.map(header => `<th style="padding: 8px;">${headerLabels[header]}</th>`).join('')}
          </tr>
      `;

      const tableRows = purchaseHistory
        .map(
          (entry) => `
          <tr>
            ${headers.map(header => `<td style="padding: 8px; text-align: center;">${entry[header]}</td>`).join('')}
          </tr>
        `
        )
        .join('');

      const tableFooter = `</table>`;

      const reportTitle = `Purchase History Report`;
      const reportDate = `Generated on: ${new Date().toLocaleDateString()}`;

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

      const { uri } = await Print.printToFileAsync({ html });

      const newPath = `${FileSystem.documentDirectory}Purchase_History_Report.pdf`;

      await FileSystem.moveAsync({
        from: uri,
        to: newPath,
      });

      Alert.alert('Success', 'Purchase history PDF file saved to your Documents folder.');

      await Sharing.shareAsync(newPath);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not generate or save the purchase history PDF file.');
    }
  };

  return (
    <SafeAreaView className="flex flex-row justify-end mt-4 mr-2">
      <TouchableOpacity
        className="bg-[#00B251] py-3 px-4 rounded-lg shadow-lg"
        onPress={generatePdf}
        activeOpacity={0.8}
      >
        <Text className="text-white font-semibold text-center">
          Generate Purchase History
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PurchaseHistoryReports;
