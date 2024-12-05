import React, { useState, useEffect, useCallback } from 'react';
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

  const fetchOrdersAndCalculateTotalPrices = useCallback(async () => {
    try {
      const response = await fetch('/api/orders', {
        headers: {
          'x-api-key': API_KEY,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const orders = await response.json();

      let totalAll = 0;
      const currentDate = new Date();
      
      // Filter orders based on selected time range
      const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.order_date);
        
        switch (selectedFilter) {
          case '7 Days':
            const sevenDaysAgo = new Date(currentDate);
            sevenDaysAgo.setDate(currentDate.getDate() - 7);
            return orderDate >= sevenDaysAgo;
            
          case '14 Days':
            const fourteenDaysAgo = new Date(currentDate);
            fourteenDaysAgo.setDate(currentDate.getDate() - 14);
            return orderDate >= fourteenDaysAgo;
            
          case '6 Months':
            const sixMonthsAgo = new Date(currentDate);
            sixMonthsAgo.setMonth(currentDate.getMonth() - 6);
            return orderDate >= sixMonthsAgo;
            
          case '12 Months':
            const twelveMonthsAgo = new Date(currentDate);
            twelveMonthsAgo.setMonth(currentDate.getMonth() - 12);
            return orderDate >= twelveMonthsAgo;
            
          case 'Yearly':
            return orderDate.getFullYear() === currentDate.getFullYear();
            
          default:
            return false;
        }
      });

      // Initialize data array based on filter
      let totalPrices;
      if (selectedFilter === '7 Days') {
        totalPrices = Array(7).fill(0);
      } else if (selectedFilter === '14 Days') {
        totalPrices = Array(14).fill(0);
      } else if (selectedFilter === '6 Months') {
        totalPrices = Array(6).fill(0);
      } else if (selectedFilter === '12 Months') {
        totalPrices = Array(12).fill(0);
      } else { // Yearly
        totalPrices = Array(12).fill(0); // Use months for yearly view
      }

      // Aggregate the filtered data
      filteredOrders.forEach(order => {
        if (order.status_id === 7 || order.status_id === 8) {
          const orderDate = new Date(order.order_date);
          const price = parseFloat(order.total_price);
          totalAll += price;

          if (selectedFilter === '7 Days') {
            const daysAgo = Math.floor((currentDate - orderDate) / (1000 * 60 * 60 * 24));
            if (daysAgo < 7) totalPrices[6 - daysAgo] += price;
          } else if (selectedFilter === '14 Days') {
            const daysAgo = Math.floor((currentDate - orderDate) / (1000 * 60 * 60 * 24));
            if (daysAgo < 14) totalPrices[13 - daysAgo] += price;
          } else if (selectedFilter === '6 Months') {
            const monthDiff = (currentDate.getMonth() - orderDate.getMonth() + 12) % 12;
            if (monthDiff < 6) totalPrices[5 - monthDiff] += price;
          } else if (selectedFilter === '12 Months') {
            const monthDiff = (currentDate.getMonth() - orderDate.getMonth() + 12) % 12;
            if (monthDiff < 12) totalPrices[11 - monthDiff] += price;
          } else { // Yearly
            const month = orderDate.getMonth();
            totalPrices[month] += price;
          }
        }
      });

      setTotalPriceStatus4(totalPrices);
      setTotalPriceAll(totalAll);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, [selectedFilter]);

  useEffect(() => {
    fetchOrdersAndCalculateTotalPrices();
  }, [fetchOrdersAndCalculateTotalPrices]);

  useEffect(() => {
    fetchOrdersAndCalculateTotalPrices(); // Fetch data initially
  
    // Polling for new data every 30 seconds
    const pollingInterval = setInterval(() => {
      fetchOrdersAndCalculateTotalPrices();
    }, 1000);
  
    // Clean up the interval on unmount
    return () => {
      clearInterval(pollingInterval);
    };
  }, [fetchOrdersAndCalculateTotalPrices]);

  const generateLabels = () => {
    const currentDate = new Date();
    const labels = [];
    if (selectedFilter === '7 Days') {
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      for (let i = 6; i >= 0; i--) {
        const dayIndex = (currentDate.getDay() - i + 7) % 7; // Get the correct day index
        labels.push(daysOfWeek[dayIndex]);
      }
      return labels;
    } else if (selectedFilter === '14 Days') {
      for (let i = 13; i >= 0; i--) {
        const date = new Date();
        date.setDate(currentDate.getDate() - i);
        labels.push(date.toDateString().slice(0, 3)); // e.g., "Mon"
      }
      return labels;
    } else if (selectedFilter === '6 Months') {
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentDate.getMonth() - i + 12) % 12; // Get month index (0-11)
        labels.push(new Date(2020, monthIndex, 1).toLocaleString('default', { month: 'long' }));
      }
      return labels;
    } else if (selectedFilter === '12 Months') {
      const currentMonth = currentDate.getMonth();
      for (let i = 1; i <= 12; i++) {
        const monthIndex = (currentMonth + i) % 12;
        labels.push(new Date(2020, monthIndex, 1).toLocaleString('default', { month: 'long' }));
      }
      return labels;
    } else if (selectedFilter === 'Yearly') {
      const currentYear = currentDate.getFullYear();
      return Array.from({ length: 5 }, (_, i) => (currentYear - i).toString()).reverse();
    }
  };

  const renderSalesAnalyticsChart = () => {
    const labels = generateLabels();
    const data = {
      labels: labels,
      datasets: [
        {
          label: "Total ₱ Amount Sold Through AgriTayo",
          data: totalPriceStatus4.slice(0, labels.length),
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
    <div className="min-h-screen bg-gradient-to-r from-[rgb(182,244,146)] to-[rgb(51,139,147)]">
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                    <h1 className="text-4xl font-bold text-white drop-shadow-md mb-2">
                        Sales Analytics Summary
                    </h1>
                    <p className="text-white/80 text-lg font-medium">
                        Track your sales performance and trends
                    </p>
                </div>
            </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Completed Orders Total */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6">
            <h2 className="text-lg font-semibold text-green-600 mb-4">
              Total Sales (Completed/Rated Orders)
            </h2>
            <p className="text-3xl font-bold text-gray-900">
              ₱{totalPriceStatus4.reduce((a, b) => a + b, 0).toFixed(2)}
            </p>
          </div>

          {/* All Orders Total */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6">
            <h2 className="text-lg font-semibold text-green-600 mb-4">
              Total Sales (All Orders)
            </h2>
            <p className="text-3xl font-bold text-gray-900">
              ₱{totalPriceAll.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Sales Trends</h2>
              <p className="text-gray-600">
                Current Range: <span className="font-semibold text-green-600">{selectedFilter}</span>
              </p>
            </div>
            <button
              onClick={() => setModalVisible(true)}
              className="mt-4 sm:mt-0 bg-green-600 text-white px-4 py-2 rounded-xl font-semibold
                hover:bg-green-700 active:bg-green-800 transform hover:scale-[1.02]
                transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Change Time Range
            </button>
          </div>

          <div className="bg-white rounded-xl p-4">
            {renderSalesAnalyticsChart()}
          </div>
        </div>

        {/* Filter Modal */}
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <div className="bg-white rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Select Time Range</h3>
            <div className="space-y-3">
              {["7 Days", "14 Days", "6 Months", "12 Months", "Yearly"].map((filter) => (
                <button
                  key={filter}
                  className={`w-full p-3 rounded-xl font-semibold transition-all duration-200
                    ${selectedFilter === filter 
                      ? "bg-green-600 text-white shadow-lg" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  onClick={() => {
                    setSelectedFilter(filter);
                    setModalVisible(false);
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>
            <button
              onClick={() => setModalVisible(false)}
              className="w-full mt-6 p-3 bg-gray-100 text-gray-700 rounded-xl font-semibold
                hover:bg-gray-200 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default SalesAnalyticsPage;