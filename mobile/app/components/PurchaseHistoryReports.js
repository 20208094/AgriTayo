import React, { useState } from 'react';
import { TouchableOpacity, SafeAreaView, Text, View, Modal } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const PurchaseHistoryReports = ({ purchaseHistory }) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const generatePdf = async () => {
    try {
      if (purchaseHistory.length === 0) {
        setAlertMessage('No purchase history available to generate the report.');
        setAlertVisible(true);
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

      setAlertMessage('Purchase history PDF file saved to your Documents folder.');
      setAlertVisible(true);

      await Sharing.shareAsync(newPath);
    } catch (error) {
      console.error(error);
      setAlertMessage('Could not generate or save the purchase history PDF file.');
      setAlertVisible(true);
    }
  };

  return (
    <>
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
    </>
  );
};

export default PurchaseHistoryReports;
