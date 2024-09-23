import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, TextInput } from 'react-native';

// Categorized FAQ Data
const faqData = {
    "Account Management": [
        { question: "How do I register as a seller?", answer: "To register as a seller, go to the registration page and select the 'Seller' option. Provide the required details such as your shop name, address, and contact information." },
        { question: "How do I update my profile?", answer: "Go to 'Profile', click 'Edit Profile', update your details, and save changes." },
        { question: "How do I reset my password?", answer: "Click on 'Forgot Password' on the login page and follow the steps to reset your password." },
        { question: "How do I delete my seller account?", answer: "Go to 'Account Settings' and select 'Delete Account' to permanently remove your seller profile." },
        { question: "How do I enable two-factor authentication?", answer: "Enable two-factor authentication in your account settings for added security." }
    ],
    "Product Management": [
        { question: "How can I add products to my shop?", answer: "Navigate to 'Add Product' section, fill in the product name, category, price, and stock." },
        { question: "Can I edit or remove a product?", answer: "Yes, go to 'Manage Products', select the product, and choose to edit or remove it." },
        { question: "How do I set product weight and measurement?", answer: "In 'Add Product', specify the weight in kg, grams, or pounds under 'Measurement'." },
        { question: "Can I list crops in different categories?", answer: "Yes, when adding a product, choose the appropriate category such as Vegetables, Fruits, etc." },
        { question: "How do I add multiple product images?", answer: "When adding or editing a product, you can upload multiple images in the product gallery." },
        { question: "Can I promote my products?", answer: "Yes, you can use the 'Featured Products' feature to promote your products on the homepage." },
        { question: "How do I update my product price?", answer: "Go to 'Manage Products', select the product, and update the price in the pricing section." }
    ],
    "Order Management": [
        { question: "How do I view my orders?", answer: "In the seller dashboard, click 'View Orders' to manage incoming orders." },
        { question: "How do I manage buyer reviews?", answer: "In 'Manage Reviews', you can view buyer feedback and respond to any issues." },
        { question: "How do I track my order status?", answer: "The 'Order Tracking' section allows you to see order status and update it as necessary." },
        { question: "How do I schedule deliveries?", answer: "In 'Order Management', you can schedule delivery times based on buyer preferences." },
        { question: "How do I handle returns?", answer: "Go to 'Returns' in the orders section to manage and process return requests." },
        { question: "Can I export my order history?", answer: "Yes, go to 'Reports' and export your order history as a PDF file." }
    ],
    "Payment & Shipping": [
        { question: "What are the payment methods available?", answer: "AgriTayo supports multiple payment methods including cash on delivery, online payments, and bank transfers." },
        { question: "How do I verify buyer's payments?", answer: "In 'Orders', you can verify the buyer's payment method and status." },
        { question: "How do I confirm receipt of payment?", answer: "In 'Orders', mark the payment status as 'Paid' once confirmed." },
        { question: "What happens if I cancel an order?", answer: "If an order is canceled, it will be removed from active orders, and the buyer will be notified." },
        { question: "Can I set different delivery options?", answer: "Yes, when adding or managing a product, you can specify delivery options such as delivery fees and shipping methods." }
    ],
    "Analytics & Reports": [
        { question: "How do I view my sales analytics?", answer: "Go to 'Market Analytics' to view detailed reports on sales and performance." },
        { question: "What analytics are available to sellers?", answer: "Sales, product performance, and buyer engagement analytics are available in 'Market Analytics'." },
        { question: "How do I get notifications for new orders?", answer: "Notifications for new orders appear in your 'Notifications' section." },
        { question: "Can I view product demand trends?", answer: "Yes, demand trends are available in the 'Market Analytics' section." },
        { question: "How do I export my sales report?", answer: "Go to 'Reports' and export your sales report as a PDF." }
    ],
    "Other Questions": [
        { question: "How do I contact customer support?", answer: "Use the 'Help & Support' section to contact AgriTayo customer service for assistance." },
        { question: "Can I offer seasonal promotions?", answer: "Yes, create and manage seasonal promotions in the 'Manage Promotions' section." },
        { question: "How do I create promotional codes?", answer: "Go to 'Manage Promotions' and create promotional codes for your buyers." },
        { question: "How do I update my business hours?", answer: "Go to 'Shop Settings' and update your business hours to reflect current availability." },
        { question: "Can I customize my shop's theme?", answer: "Currently, AgriTayo does not support theme customization for seller profiles." }
    ]
};

function SellerFaq() {
    const [openFAQ, setOpenFAQ] = useState({});
    const [searchText, setSearchText] = useState("");

    const toggleFAQ = (category, index) => {
        setOpenFAQ({
            ...openFAQ,
            [category]: openFAQ[category] === index ? null : index
        });
    };

    const filteredFAQs = () => {
        if (searchText === "") {
            return faqData;
        }
        const filtered = {};
        Object.keys(faqData).forEach(category => {
            const filteredQuestions = faqData[category].filter(faq =>
                faq.question.toLowerCase().includes(searchText.toLowerCase())
            );
            if (filteredQuestions.length > 0) {
                filtered[category] = filteredQuestions;
            }
        });
        return filtered;
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="px-4 py-6">
                <Text className="text-3xl font-bold text-center mb-6 text-[#00B251]">
                    Seller FAQs
                </Text>

                {/* Search Bar */}
                <View className="mb-6">
                    <TextInput
                        className="bg-gray-200 px-4 py-3 rounded-lg text-gray-700"
                        placeholder="Search FAQs..."
                        placeholderTextColor="#7C7C7C"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>

                {/* FAQ List */}
                {Object.keys(filteredFAQs()).length === 0 ? (
                    <Text className="text-gray-600 text-center">No FAQs found for "{searchText}".</Text>
                ) : (
                    Object.keys(filteredFAQs()).map((category, categoryIndex) => (
                        <View key={categoryIndex} className="mb-8">
                            <Text className="text-2xl font-semibold text-[#00B251] mb-4">
                                {category}
                            </Text>
                            {filteredFAQs()[category].map((faq, index) => (
                                <View key={index} className="mb-4">
                                    <TouchableOpacity
                                        onPress={() => toggleFAQ(category, index)}
                                        className="bg-[#00B251] p-4 rounded-lg"
                                    >
                                        <Text className="text-lg font-semibold text-white">
                                            {faq.question}
                                        </Text>
                                    </TouchableOpacity>
                                    {openFAQ[category] === index && (
                                        <View className="bg-gray-100 p-4 mt-2 rounded-lg">
                                            <Text className="text-gray-700">
                                                {faq.answer}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

export default SellerFaq;
