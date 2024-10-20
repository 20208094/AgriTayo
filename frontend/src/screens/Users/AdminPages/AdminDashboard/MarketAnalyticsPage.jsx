import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Modal from '../../../../components/Modal/Modal';
import PropTypes from 'prop-types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Sample category data (Vegetables, Fruits, etc.)
const categoryData = {
  Vegetables: [
    { id: 1, name: "Potato" },
    { id: 2, name: "Carrot" },
    { id: 3, name: "Tomato" },
    { id: 4, name: "Lettuce" },
    { id: 5, name: "Spinach" },
    { id: 6, name: "Broccoli" },
    { id: 7, name: "Onion" },
    { id: 8, name: "Cucumber" },
    { id: 9, name: "Bell Pepper" },
    { id: 10, name: "Zucchini" },
  ],
  Fruits: [
    { id: 1, name: "Apple" },
    { id: 2, name: "Banana" },
    { id: 3, name: "Orange" },
    { id: 4, name: "Strawberry" },
    { id: 5, name: "Grape" },
    { id: 6, name: "Mango" },
    { id: 7, name: "BlueBerry" },
    { id: 8, name: "Pineapple" },
    { id: 9, name: "Watermelon" },
    { id: 10, name: "Peach" },
  ],
  Spices: [
    { id: 1, name: "Turmeric" },
    { id: 2, name: "Cumin" },
    { id: 3, name: "Pepper" },
    { id: 4, name: "Cinnamon" },
    { id: 5, name: "Coriander" },
    { id: 6, name: "Ginger" },
    { id: 7, name: "Clove" },
    { id: 8, name: "Cardamom" },
    { id: 9, name: "Fennel" },
    { id: 10, name: "Mustard Seed" },
  ],
  Seedlings: [
    { id: 1, name: "Tomato Seedlings" },
    { id: 2, name: "Basil Seedlings" },
    { id: 3, name: "Sunflower Seedlings" },
    { id: 4, name: "Lettuce Seedlings" },
    { id: 5, name: "Cucumber Seedlings" },
    { id: 6, name: "Paper Seedlings" },
    { id: 7, name: "Marigold Seedlings" },
    { id: 8, name: "Mint Seedlings" },
    { id: 9, name: "Cilantaro Seedlings" },
    { id: 10, name: "Parsely Seedlings" },
  ],
  Plants: [
    { id: 1, name: "Spider Plant" },
    { id: 2, name: "Aloe Vera" },
    { id: 3, name: "Rose" },
    { id: 4, name: "Lavender" },
    { id: 5, name: "Snake Plant" },
    { id: 6, name: "Peace Lily" },
    { id: 7, name: "Pothos" },
    { id: 8, name: "Jade Plant" },
    { id: 9, name: "Hibiscus" },
    { id: 10, name: "Bamboo Plant" },
  ],
  Flowers: [
    { id: 1, name: "Rose" },
    { id: 2, name: "Tulip" },
    { id: 3, name: "Marigold" },
    { id: 4, name: "Sunflower" },
    { id: 5, name: "Daisy" },
    { id: 6, name: "Lily" },
    { id: 7, name: "Orchid" },
    { id: 8, name: "Daffodil" },
    { id: 9, name: "Chrysanthemum" },
    { id: 10, name: "Peony" },
  ],
};

const getDataForItem = (itemId, filter) => {
  const data = {
    "7 Days": {
      dates: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      average: [120, 130, 125, 140, 150, 160, 170],
      highest: [140, 150, 145, 160, 170, 180, 190],
      lowest: [100, 110, 105, 120, 130, 140, 150],
      sold: [120, 130, 125, 140, 150, 160, 170],
    },
    "14 Days": {
      dates: ["Week 1", "Week 2"],
      average: [120, 130],
      highest: [140, 150],
      lowest: [100, 110],
      sold: [1200, 1300],
    },
    "6 Months": {
      dates: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      average: [120, 130, 125, 140, 150, 160],
      highest: [140, 150, 145, 160, 170, 180],
      lowest: [100, 110, 105, 120, 130, 140],
      sold: [1200, 1300, 1250, 1400, 1500, 1600],
    },
    "12 Months": {
      dates: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      average: [120, 130, 125, 140, 150, 160, 155, 165, 170, 180, 190, 200],
      highest: [140, 150, 145, 160, 170, 180, 175, 185, 190, 200, 210, 220],
      lowest: [100, 110, 105, 120, 130, 140, 135, 145, 150, 160, 170, 180],
      sold: [1200, 1300, 1250, 1400, 1500, 1600, 1550, 1650, 1700, 1800, 1900, 2000],
    },
    Yearly: {
      dates: ["2020", "2021", "2022", "2023"],
      average: [120, 130, 125, 140],
      highest: [140, 150, 145, 160],
      lowest: [100, 110, 105, 120],
      sold: [5000, 5200, 5100, 5300],
    },
  };
  return data[filter] || data["12 Months"];
};

const MiniGraph = ({ data }) => {
  const graphData = {
    labels: data.dates,
    datasets: [
      {
        label: "Sold",
        data: data.sold,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        display: false // Hide X-axis labels
      },
      y: {
        display: false // Hide Y-axis labels
      }
    },
    plugins: {
      legend: {
        display: false // Hide legend
      },
      tooltip: {
        enabled: false // Disable tooltips
      }
    },
    elements: {
      point: {
        radius: 0 // Hide points on the line
      }
    },
    maintainAspectRatio: true
  };

  return <Line data={graphData} options={options} width={100} height={50} />;
};

MiniGraph.propTypes = {
  data: PropTypes.shape({
    dates: PropTypes.arrayOf(PropTypes.string).isRequired,
    sold: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
};


const MarketAnalyticsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('12 Months');
  const [modalVisible, setModalVisible] = useState(false);

  const renderAnalyticsChart = (itemId) => {
    const itemData = getDataForItem(itemId, selectedFilter);
    const data = {
      labels: itemData.dates,
      datasets: [
        {
          label: "Average",
          data: itemData.average,
          borderColor: "rgba(0, 128, 0, 0.5)",
          fill: false,
        },
        {
          label: "Highest",
          data: itemData.highest,
          borderColor: "rgba(255, 69, 58, 0.5)",
          fill: false,
        },
        {
          label: "Lowest",
          data: itemData.lowest,
          borderColor: "rgba(25, 118, 210, 0.5)",
          fill: false,
        },
      ],
    };

    const options = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    return <Line data={data} options={options} />;
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">

      {!selectedCategory ? (

        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-600 mb-6">Select a Category</h2>

          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.keys(categoryData).map((category, index) => (
              <div
                key={index}
                className="p-4 bg-white shadow-md rounded-lg cursor-pointer hover:bg-green-100"
                onClick={() => setSelectedCategory(category)}
              >
                <span className="text-lg font-semibold text-green-600">{category}</span>
              </div>
            ))}
          </ul>
        </div>
      ) : !selectedItem ? (

        <div className="text-center ">
          <div className='grid flex'>
            <h2 className="text-3xl font-bold text-green-600 mb-6   w-5/5">{selectedCategory} Items</h2>
            <button
              className="absolute insert-y-0 right-0 mr-2 text-green-500 text-2xl w-1/8"
              onClick={() => setSelectedCategory(null)}
            >
              X
            </button>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryData[selectedCategory].map((item) => (
              <button
                key={item.id}
                className="p-4 bg-white shadow-md rounded-lg flex flex-col items-center justify-between"
                onClick={() => setSelectedItem(item)}
              >
                <span className="text-lg font-semibold text-green-600 mb-4">{item.name}</span>
                <MiniGraph data={getDataForItem(item.id, '7 Days')} />
              </button>
            ))}
          </ul>
        </div>
      ) : (
        <>
          <div className='grid flex text-center'>
            <h2 className="text-3xl font-bold text-green-600 mb-6   w-5/5">{selectedCategory} Analytics</h2>
            <button
              className="absolute insert-y-0 right-0 mr-2 text-green-500 text-2xl w-1/8"
              onClick={() => {
                setSelectedItem(null);
              }}
            >
              X
            </button>
          </div>
          <div className="grid grid-cols-3 auto-rows-auto gap-4">
            {/* Current Available Listings */}
            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
              <h5 className="text-xl font-bold text-green-500 mb-4">Current Available Listings</h5>
              <p className="text-2xl font-bold text-green-700">30 Listings</p>
            </div>

            {/* Current Highest Price/Kilo */}
            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
              <h5 className="text-xl font-bold text-green-500 mb-4">Current Highest Price/Kilo</h5>
              <p className="text-2xl font-bold text-green-700">₱70/kilo</p>
            </div>

            {/* Current Lowest Price/Kilo */}
            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
              <h5 className="text-xl font-bold text-green-500 mb-4">Current Lowest Price/Kilo</h5>
              <p className="text-2xl font-bold text-green-700">₱50/kilo</p>
            </div>

            {/* Average */}
            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
              <h5 className="text-xl font-bold text-green-500 mb-4">Average</h5>
              <p className="text-2xl font-bold text-green-700">
                ₱{getDataForItem(selectedItem.id, selectedFilter).average.slice(-1)[0]}
              </p>
            </div>

            {/* Highest */}
            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
              <h5 className="text-xl font-bold text-green-500 mb-4">Highest</h5>
              <p className="text-2xl font-bold text-green-700">
                ₱{getDataForItem(selectedItem.id, selectedFilter).highest.slice(-1)[0]}
              </p>
            </div>

            {/* Lowest */}
            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
              <h5 className="text-xl font-bold text-green-500 mb-4">Lowest</h5>
              <p className="text-2xl font-bold text-green-700">
                ₱{getDataForItem(selectedItem.id, selectedFilter).lowest.slice(-1)[0]}
              </p>
            </div>

            {/* Line Graph with Filter Button */}
            <div className="col-span-3 row-span-2 bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h5 className="text-xl font-bold text-center text-green-700 mb-4">Current Filter</h5>
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
                {['7 Days', '14 Days', '6 Months', '12 Months', 'Yearly'].map((filter) => (
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
              {renderAnalyticsChart(selectedItem.id)}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MarketAnalyticsPage;
