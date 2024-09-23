import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Modal from '../../../../components/Modal/Modal'; // Adjust path based on your folder structure

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const API_KEY = import.meta.env.VITE_API_KEY;

const SalesAnalyticsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('12 Months');
  const [modalVisible, setModalVisible] = useState(false);
  const [totalPriceStatus4, setTotalPriceStatus4] = useState(Array(12).fill(0)); // Array for each month
  const [totalPriceAll, setTotalPriceAll] = useState(0);

  // Dummy data for sales analytics
  const getSalesData = (filter) => {
    // ... (keep this as it is)
  };

  // Function to fetch orders based on selected filter
  const fetchOrdersAndCalculateTotalPrices = async () => {
    try {
      console.log("Fetching orders...");
      const response = await fetch('/api/orders', {
        headers: {
          'x-api-key': API_KEY,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const orders = await response.json();
      console.log("Orders fetched:", orders);

      // Reset totals for each fetch
      const totalStatus4 = Array(12).fill(0); // Initialize an array for each month
      let totalAll = 0;

      // Filter orders based on the selected filter
      const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.order_date);
        const currentDate = new Date();

        if (selectedFilter === '7 Days') {
          return (currentDate - orderDate) / (1000 * 3600 * 24) <= 7;
        } else if (selectedFilter === '14 Days') {
          return (currentDate - orderDate) / (1000 * 3600 * 24) <= 14;
        } else if (selectedFilter === '6 Months') {
          return (currentDate - orderDate) / (1000 * 3600 * 24) <= 180;
        } else if (selectedFilter === '12 Months') {
          return (currentDate - orderDate) / (1000 * 3600 * 24) <= 365;
        } else if (selectedFilter === 'Yearly') {
          return orderDate.getFullYear() === currentDate.getFullYear();
        }
        return false;
      });

      // Calculate total price for filtered orders with status_id = 4, grouped by month
      filteredOrders.forEach(order => {
        if (order.status_id === 4) {
          const orderDate = new Date(order.order_date);
          const month = orderDate.getMonth(); // Get month index (0-11)
          totalStatus4[month] += parseFloat(order.total_price);
          totalAll += parseFloat(order.total_price);
        }
      });

      console.log("Total price for status_id = 4 by month:", totalStatus4);
      setTotalPriceStatus4(totalStatus4);
      console.log("Total price for all orders:", totalAll);
      setTotalPriceAll(totalAll);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrdersAndCalculateTotalPrices();
  }, [selectedFilter]); // Fetch orders when selectedFilter changes

  const renderSalesAnalyticsChart = () => {
    // Months for x-axis
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    // Bar chart data
    const data = {
      labels: months, // Set months as labels for x-axis
      datasets: [
        {
          label: "Total Price for Status ID 4",
          data: totalPriceStatus4, // Monthly total prices
          backgroundColor: "rgba(0, 128, 0, 0.5)",
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return `${tooltipItem.dataset.label}: ₱${tooltipItem.raw}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    return <Bar data={data} options={options} />;
  };

  return (
    <div className="p-4">
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h5 className="text-xl font-bold text-center text-green-700 mb-4">
          SALES ANALYTICS SUMMARY
        </h5>

        {/* Display the fetched total price for status_id = 4 */}
        <p className="text-sm font-bold text-green-500 mb-2">
          Total Price for Orders with Status ID 4:{" "}
          <span className="text-green-700">₱{totalPriceStatus4.reduce((a, b) => a + b, 0).toFixed(2)}</span>
        </p>

        {/* Display the fetched total price for all orders */}
        <p className="text-sm font-bold text-green-500 mb-2">
          Total Price for All Orders:{" "}
          <span className="text-green-700">₱{totalPriceAll.toFixed(2)}</span>
        </p>

        <p className="text-sm font-bold text-green-500 mb-2">
          Current Filter:{" "}
          <span className="text-green-700">{selectedFilter}</span>
        </p>

        <button
          onClick={() => setModalVisible(true)}
          className="bg-green-500 text-white p-2 rounded-lg flex items-center justify-center mb-4"
        >
          <span>Select Filter</span>
        </button>

        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <h3 className="text-lg font-bold mb-4 text-center">Select a filter</h3>
          {["7 Days", "14 Days", "6 Months", "12 Months", "Yearly"].map(
            (filter) => (
              <button
                key={filter}
                className={`p-2 rounded-lg mb-2 w-full ${
                  selectedFilter === filter
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-green-700"
                }`}
                onClick={() => {
                  setSelectedFilter(filter);
                  setModalVisible(false);
                }}
              >
                {filter}
              </button>
            )
          )}
          <button
            onClick={() => setModalVisible(false)}
            className="bg-gray-300 text-green-700 p-2 rounded-lg w-full"
          >
            Close
          </button>
        </Modal>

        {renderSalesAnalyticsChart()}
      </div>
    </div>
  );
};

export default SalesAnalyticsPage;
