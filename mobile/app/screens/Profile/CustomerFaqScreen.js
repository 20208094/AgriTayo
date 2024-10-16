import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, TextInput } from 'react-native';

// Categorized FAQ Data
const faqData = {
    "Account Management": [
        {
          question: "How do I create an account?",
          answer: "To create an account, go to the registration page, provide your details such as name, email, phone number, and set a password. Verify your email to complete the registration process."
        },
        {
          question: "I forgot my password. How can I reset it?",
          answer: "Click on the 'Forgot Password' link on the login page, enter your registered email, and follow the instructions to reset your password using a 6-digit code sent to your email."
        },
        {
          question: "Can I update my profile information?",
          answer: "Yes, you can update your profile information such as your name, address, and contact details by going to the 'Profile' section in the app."
        },
        {
          question: "How can I change my email address?",
          answer: "To change your email address, go to the 'Profile' section, edit your email, and verify the new email to update it."
        },
        {
          question: "How do I delete my account?",
          answer: "Currently, the app does not support self-deletion of accounts. Please contact customer support for assistance with account deletion."
        }
      ],
      "Order Management": [
        {
          question: "How do I place an order?",
          answer: "To place an order, browse the products, add items to your cart, and proceed to checkout. Select your payment method and confirm the order."
        },
        {
          question: "Can I cancel my order after placing it?",
          answer: "Yes, you can cancel an order if it hasn’t been processed for shipping. Go to 'Orders', select the order you want to cancel, and choose the 'Cancel' option."
        },
        {
          question: "How can I view my order history?",
          answer: "To view your past orders, navigate to the 'Profile' section and select 'View Purchase History'."
        },
        {
          question: "What are the payment options available?",
          answer: "You can pay using GCash or Cash on Delivery (COD) based on the seller's options during checkout."
        },
        {
          question: "How do I track my order?",
          answer: "Once your order is placed, you can track its status under the 'Orders' section. The order status will be updated as it's processed, shipped, or delivered."
        }
      ],
      "Product Search & Navigation": [
        {
          question: "How do I search for products?",
          answer: "You can search for products using the search bar at the top of the homepage. You can filter results by categories, price, ratings, and more."
        },
        {
          question: "Can I filter search results?",
          answer: "Yes, you can filter search results by price range, location, product category, and ratings to find products that match your criteria."
        },
        {
          question: "What is the Featured Products list?",
          answer: "The Featured Products list highlights popular or promoted products. You can find it on the homepage or explore more by clicking 'See All'."
        },
        {
          question: "Can I view details about a product?",
          answer: "Yes, clicking on any product will take you to the product details page where you can see more information like price, description, and seller details."
        },
        {
          question: "How do I negotiate prices with the seller?",
          answer: "You can contact the seller directly through the messaging system in the app and negotiate prices before placing your order."
        }
      ],
      "Cart & Checkout": [
        {
          question: "How do I add items to my cart?",
          answer: "To add an item to your cart, go to the product details page, select the quantity, and click 'Add to Cart'."
        },
        {
          question: "How can I view my cart?",
          answer: "You can view the contents of your cart by clicking the cart icon located on the homepage or in the navigation bar."
        },
        {
          question: "Can I change the quantity of items in my cart?",
          answer: "Yes, you can adjust the quantity of each item in your cart before proceeding to checkout."
        },
        {
          question: "How do I proceed to checkout?",
          answer: "Once you’ve added all the desired products to your cart, click the 'Checkout' button, confirm your address, and select a payment method to complete the order."
        },
        {
          question: "Is my payment information secure?",
          answer: "Yes, all payment transactions are securely processed using encrypted payment gateways to ensure your data is protected."
        }
      ],
      "Delivery & Shipping": [
        {
          question: "How long will my delivery take?",
          answer: "Delivery times vary depending on your location and the seller. Estimated delivery times are provided at checkout based on your selected shipping option."
        },
        {
          question: "Can I change my delivery address after placing an order?",
          answer: "You can change your delivery address before the order is processed. Once it’s being prepared for shipment, you won’t be able to change the address."
        },
        {
          question: "How do I track my shipment?",
          answer: "You can track your shipment from the 'Orders' section, where you will see the current status of your order and shipment tracking information."
        },
        {
          question: "What are the shipping fees?",
          answer: "Shipping fees are calculated based on the weight of the products and your location. You can view the total shipping cost at checkout before placing your order."
        },
        {
          question: "What should I do if my order is delayed?",
          answer: "If your order is delayed, you can contact the seller directly through the messaging feature or reach out to customer support for assistance."
        }
      ],
      "Returns & Refunds": [
        {
          question: "What is the return policy?",
          answer: "Returns are accepted if the product is damaged or not as described. Please contact the seller or customer support within the return window specified by the seller."
        },
        {
          question: "How do I initiate a return?",
          answer: "To initiate a return, go to your 'Orders' section, select the order, and choose 'Return'. Follow the instructions to provide details about the return."
        },
        {
          question: "How long does it take to process a refund?",
          answer: "Refunds are processed after the returned item is received and inspected. This can take up to 7-10 business days."
        },
        {
          question: "Can I get a refund if I cancel my order?",
          answer: "If you cancel your order before it has been processed, a full refund will be issued. If the order has already shipped, you may need to return the item to get a refund."
        },
        {
          question: "What if I received the wrong item?",
          answer: "If you received the wrong item, you can request a return or exchange by contacting the seller or using the 'Return' option in the app."
        }
      ],
      "Communication & Support": [
        {
          question: "How do I contact a seller?",
          answer: "You can contact a seller by using the in-app messaging feature. Go to the product page and click 'Message Seller' to start a conversation."
        },
        {
          question: "What if I need help with my order?",
          answer: "If you need assistance with your order, you can contact customer support directly through the 'Help & Support' section in the app."
        },
        {
          question: "How do I receive notifications?",
          answer: "You will receive notifications about your orders, messages, and promotions through in-app notifications, SMS, or email."
        },
        {
          question: "Can I leave feedback for a seller?",
          answer: "Yes, after completing an order, you can leave feedback and rate the seller on their product page to help other customers."
        },
        {
          question: "How do I manage my notifications?",
          answer: "You can manage your notifications in the 'Settings' section. There, you can choose which notifications you want to receive or mute."
        }
      ]
};

function CustomerFaq() {
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
                    Customer FAQs
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

export default CustomerFaq;
