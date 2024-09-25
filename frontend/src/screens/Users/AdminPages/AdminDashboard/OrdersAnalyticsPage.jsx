import React, { useState, useEffect, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import Modal from '../../../../components/Modal/Modal';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const API_KEY = import.meta.env.VITE_API_KEY;

const OrdersAnalyticsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('12 Months');
  const [modalVisible, setModalVisible] = useState(false);
  const [orderCounts, setOrderCounts] = useState({});

  // Create a mapping between status_id and status names
  const statusMap = {
    1: 'Placed',
    2: 'Processed',
    3: 'Shipped',
    4: 'Delivered',
    5: 'Cancelled',
  };

  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch('/api/orders', {
        headers: {
          'x-api-key': API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const counts = {
        Placed: [],
        Processed: [],
        Shipped: [],
        Delivered: [],
        Cancelled: [],
      };

      // Populate counts based on status_id
      data.forEach(order => {
        const statusName = statusMap[order.status_id];
        if (statusName in counts) {
          counts[statusName].push(order);
        }
      });

      setOrderCounts(counts);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const generateLabels = () => {
    const currentDate = new Date();
    const labels = [];
    if (selectedFilter === '7 Days') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(currentDate.getDate() - i);
        labels.push(date.toDateString().slice(0, 3)); // e.g., "Mon"
      }
    } else if (selectedFilter === '14 Days') {
      for (let i = 13; i >= 0; i--) {
        const date = new Date();
        date.setDate(currentDate.getDate() - i);
        labels.push(date.toDateString().slice(0, 3)); // e.g., "Mon"
      }
    } else if (selectedFilter === '6 Months') {
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentDate.getMonth() - i + 12) % 12; // Get month index (0-11)
        labels.push(new Date(2020, monthIndex, 1).toLocaleString('default', { month: 'long' }));
      }
    } else if (selectedFilter === '12 Months') {
      for (let i = 11; i >= 0; i--) {
        const monthIndex = (currentDate.getMonth() - i + 12) % 12;
        labels.push(new Date(2020, monthIndex, 1).toLocaleString('default', { month: 'long' }));
      }
    } else if (selectedFilter === 'Yearly') {
      const currentYear = currentDate.getFullYear();
      return Array.from({ length: 5 }, (_, i) => (currentYear - i).toString()).reverse();
    }
    return labels;
  };

  const renderOrderStatusLineChart = (status) => {
    const filteredOrders = orderCounts[status]?.filter(order => {
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
    }) || [];

    const labels = generateLabels();
    const data = {
      labels: labels,
      datasets: [
        {
          label: status,
          data: labels.map(label => {
            const dateIndex = filteredOrders.findIndex(order => {
              const orderDate = new Date(order.order_date);
              if (selectedFilter === '7 Days' || selectedFilter === '14 Days') {
                return orderDate.toDateString().slice(0, 3) === label;
              } else if (selectedFilter === '6 Months' || selectedFilter === '12 Months') {
                return new Date(2020, orderDate.getMonth(), 1).toLocaleString('default', { month: 'long' }) === label;
              } else if (selectedFilter === 'Yearly') {
                return orderDate.getFullYear().toString() === label;
              }
              return false;
            });
            return dateIndex !== -1 ? 1 : 0; // Count orders for the respective time period
          }),
          backgroundColor: 'rgba(54, 162, 235, 0.7)', // Change color as needed
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          fill: false,
        },
      ],
    };

    const options = {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Date',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Count',
          },
          beginAtZero: true,
        },
      },
    };

    return <Line data={data} options={options} />;
  };

  const renderOrdersPieChart = () => {
    if (Object.keys(orderCounts).length === 0) {
      return <p>No data available for the chart.</p>;
    }

    const data = {
      labels: Object.keys(orderCounts),
      datasets: [
        {
          label: 'Order Status Distribution',
          data: Object.values(orderCounts).map(counts => counts.length),
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 99, 132, 0.7)',
          ],
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              const count = tooltipItem.raw;
              return `${tooltipItem.label}: ${count} orders`;
            },
          },
        },
      },
    };

    return <Pie data={data} options={options} />;
  };

  return (
    <div className="p-4">
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h5 className="text-xl font-bold text-center text-green-700 mb-4">
          ORDERS ANALYTICS SUMMARY
        </h5>

        <h5 className="text-xl font-bold text-green-700 mb-4">
            Current Filter
          </h5>
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

        {/* Display total counts of each order status */}
        <div className="text-center mb-4">
          {Object.entries(orderCounts).map(([status, orders]) => (
            <p key={status} className="text-sm font-bold text-green-500">
              Total {status}: {orders.length}
            </p>
          ))}
        </div>

        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <h3 className="text-lg font-bold mb-4 text-center">Select a filter</h3>
          {["7 Days", "14 Days", "6 Months", "12 Months", "Yearly"].map(
            (filter) => (
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
            )
          )}
          <button
            onClick={() => setModalVisible(false)}
            className="bg-gray-300 text-green-700 p-2 rounded-lg w-full"
          >
            Close
          </button>
        </Modal>
      </div>


      {/* Render Line Chart for each status */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        {['Placed', 'Processed', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
          <div key={status} className="mb-4">
            {renderOrderStatusLineChart(status)}
          </div>
        ))}
      </div>

      {/* Render Pie Chart */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h6 className="text-lg font-bold text-green-700 mb-2">Order Status Distribution</h6>
        {renderOrdersPieChart()}
      </div>
    </div>
  );
};

export default OrdersAnalyticsPage;
