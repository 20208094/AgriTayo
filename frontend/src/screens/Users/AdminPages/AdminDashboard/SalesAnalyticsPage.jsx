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

      const totalStatus4 = Array(12).fill(0); // Initialize an array for each month
      let totalAll = 0;

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

      filteredOrders.forEach(order => {
        if (order.status_id === 4) {
          const orderDate = new Date(order.order_date);
          const month = orderDate.getMonth(); // Get month index (0-11)
          totalStatus4[month] += parseFloat(order.total_price);
          totalAll += parseFloat(order.total_price);
        }
      });

      setTotalPriceStatus4(totalStatus4);
      setTotalPriceAll(totalAll);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, [selectedFilter]);

  useEffect(() => {
    fetchOrdersAndCalculateTotalPrices();
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
          label: "Total Price for Status Delivered",
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
    <div className="p-4">
      <h5 className="text-xl font-bold text-center text-green-700 mb-4 pt-8">
          Sales Analytics Summary
        </h5>
      <div className="grid grid-cols-2 auto-rows-auto gap-4">
        {/* Total Price for Orders with Status Delivered Card */}
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-center items-center">
        <h5 className="text-xl font-bold text-center text-green-500 mb-4">Total Price for Orders with Status Delivered</h5>
        <p className="text-sm font-bold text-green-700 mb-2">
          ₱{totalPriceStatus4.reduce((a, b) => a + b, 0).toFixed(2)}
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-center items-center">
        <p className="text-xl font-bold text-center text-green-500 mb-4">Total Price for All Orders</p>
        <p className="text-sm font-bold text-green-700 mb-2">
          ₱{totalPriceAll.toFixed(2)}
        </p>
      </div>

        {/* Bar Graph with Filter Button */}
        <div className="col-span-2 relative bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm font-bold text-green-500 mb-2">
                Current Filter: <span className="text-green-700">{selectedFilter}</span>
              </p>
            </div>
            <button
              onClick={() => setModalVisible(true)}
              className="bg-green-500 text-white p-2 rounded-lg"
            >
              Select Filter
            </button>
          </div>
          <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
            <h3 className="text-lg font-bold mb-4 text-center">Select a filter</h3>
            {["7 Days", "14 Days", "6 Months", "12 Months", "Yearly"].map((filter) => (
              <button
                key={filter}
                className={`p-2 rounded-lg mb-2 w-full ${selectedFilter === filter ? "bg-green-500 text-white" : "bg-gray-200 text-green-700"}`}
                onClick={() => {
                  setSelectedFilter(filter);
                  setModalVisible(false);
                }}
              >
                {filter}
              </button>
            ))}
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
    </div>
  );
};

export default SalesAnalyticsPage;