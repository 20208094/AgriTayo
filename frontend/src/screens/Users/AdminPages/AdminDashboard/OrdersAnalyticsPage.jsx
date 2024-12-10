import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  const statusMap = useMemo(() => ({
    1: 'ToConfirm',
    2: 'Preparing',
    3: 'Shipping',
    4: 'Pickup',
    5: 'ForReturn',
    6: 'Returned',
    7: 'ToRate',
    8: 'Completed',
    9: 'Rejected',
  }), []);

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
        ToConfirm: [],
        Preparing: [],
        Shipping: [],
        Pickup: [],
        ForReturn: [],
        Returned: [],
        ToRate: [],
        Completed: [],
        Rejected: [],
      };

      // Populate counts based on status_id
      data.forEach(order => {
        const statusName = statusMap[order.status_id];
        if (statusName in counts) {
          counts[statusName].push(order);
        }
      });

      setOrderCounts(counts);
      console.log('counts :', counts);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, [statusMap]); // <-- Add statusMap as a dependency


  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    fetchOrders(); // Fetch data initially

    // Polling for new data every 30 seconds
    const pollingInterval = setInterval(() => {
      fetchOrders();
    }, 1000);

    // Clean up the interval on unmount
    return () => {
      clearInterval(pollingInterval);
    };
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
          backgroundColor: getStatusColor(status),
          borderColor: getStatusColor(status),
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

  // Helper function to get color based on status
  const getStatusColor = (status) => {
    const colors = {
      ToConfirm: 'rgba(255, 159, 64, 0.7)',   // Orange
      Preparing: 'rgba(0, 123, 255, 0.7)',    // Royal Blue
      Shipping: 'rgba(153, 102, 255, 0.7)',   // Purple
      Pickup: 'rgba(75, 192, 192, 0.7)',      // Teal
      ForReturn: 'rgba(255, 128, 128, 0.7)',  // Semi-Light Red
      Returned: 'rgba(178, 34, 34, 0.7)',     // Darker Red
      ToRate: 'rgba(144, 238, 144, 0.7)',     // Light Green
      Completed: 'rgba(0, 100, 0, 0.7)',      // Dark Green
      Rejected: 'rgba(139, 0, 0, 0.7)',       // Dark Red
    };
    return colors[status] || 'rgba(0, 0, 0, 0.7)';
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
            'rgba(255, 159, 64, 0.7)',  // Orange
            'rgba(0, 123, 255, 0.7)',   // Royal Blue
            'rgba(153, 102, 255, 0.7)', // Purple
            'rgba(75, 192, 192, 0.7)',  // Teal
            'rgba(255, 128, 128, 0.7)', // Semi-Light Red
            'rgba(178, 34, 34, 0.7)',   // Darker Red
            'rgba(144, 238, 144, 0.7)', // Light Green
            'rgba(0, 100, 0, 0.7)',     // Dark Green
            'rgba(139, 0, 0, 0.7)'      // Dark Red
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
    <div className="min-h-screen bg-gradient-to-r from-[rgb(182,244,146)] to-[rgb(51,139,147)]">
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 drop-shadow-md mb-2">
                Orders Analytics</h1>
              <p className="text-gray-700 text-lg font-medium">
                Track order status and trends
              </p>
            </div>
          </div>
        </div>

        {/* Status Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-4 mb-8">
          {[
            { title: 'To Confirm Orders', count: orderCounts.ToConfirm?.length || 0 },
            { title: 'Preparing Orders', count: orderCounts.Preparing?.length || 0 },
            { title: 'Shipping Orders', count: orderCounts.Shipping?.length || 0 },
            { title: 'Pickup Orders', count: orderCounts.Pickup?.length || 0 },
            { title: 'For Return Orders', count: orderCounts.ForReturn?.length || 0 },
            { title: 'Returned Orders', count: orderCounts.Returned?.length || 0 },
            { title: 'To Rate Orders', count: orderCounts.ToRate?.length || 0 },
            { title: 'Completed Orders', count: orderCounts.Completed?.length || 0 },
            { title: 'Rejected Orders', count: orderCounts.Rejected?.length || 0 },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 transform 
                hover:scale-[1.02] transition-all duration-300"
            >
              <h2 className="text-lg font-semibold text-green-600 mb-3 text-center">{item.title}</h2>
              <p className="text-3xl font-bold text-gray-900 text-center">{item.count}</p>
            </div>
          ))}
        </div>

        {/* Filter Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Order Trends</h2>
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
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Line Charts Container */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                'ToConfirm', 'Preparing', 'Shipping',
                'Pickup', 'ForReturn', 'Returned',
                'ToRate', 'Completed', 'Rejected'
              ].map((status) => (
                <div
                  key={status}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
                    {status} Orders
                  </h2>
                  {renderOrderStatusLineChart(status)}
                </div>
              ))}
            </div>
          </div>

          {/* Pie Chart Container */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
                Order Distribution
              </h2>
              <div className="aspect-square">
                {renderOrdersPieChart()}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Modal */}
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <div className="bg-white rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Select Time Range</h3>
            <div className="space-y-3">
              {['7 Days', '14 Days', '6 Months', '12 Months', 'Yearly'].map((filter) => (
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

export default OrdersAnalyticsPage;
