import React, { useState, useEffect, useCallback } from 'react';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate, Link, useParams } from 'react-router-dom';
import Modal from '../../../../components/Modal/Modal';

const API_KEY = import.meta.env.VITE_API_KEY;

const SelectedVarietyAnalyticsPage = () => {
  const { varietyId } = useParams();
  const [varietyData, setVarietyData] = useState([]);
  const [varietyMarketData, setVarietyMarketData] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState(null);
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('12 Months');
  const [modalVisible, setModalVisible] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [cropsResponse, categoryResponse, subcategoryResponse, varietyResponse, ordersResponse, orderProductsResponse] = await Promise.all([
        fetch(`/api/crops`, { headers: { "x-api-key": API_KEY } }),
        fetch(`/api/crop_categories`, { headers: { "x-api-key": API_KEY } }),
        fetch(`/api/crop_sub_categories`, { headers: { "x-api-key": API_KEY } }),
        fetch(`/api/crop_varieties`, { headers: { "x-api-key": API_KEY } }),
        fetch(`/api/orders`, { headers: { "x-api-key": API_KEY } }),
        fetch(`/api/order_products`, { headers: { "x-api-key": API_KEY } }),
      ]);
      const crops = await cropsResponse.json();
      const categories = await categoryResponse.json();
      const subcategories = await subcategoryResponse.json();
      const varieties = await varietyResponse.json();
      const orders = await ordersResponse.json();
      const orderProducts = await orderProductsResponse.json();
      // filter crops to only include crops thats in the variety chosen
      const cropsFiltered = crops.filter(crop => Number(crop.crop_variety_id) === Number(varietyId));
      // filter orders to rate and completed only
      const ordersFiltered = orders.filter(order => Number(order.status_id) === 7 || Number(order.status_id) === 8);
      // combine crop data inside orderProducts
      const combinedOrderProds = orderProducts.map(orderProd => {
        const cropData = crops.find(crop => crop.crop_id === orderProd.order_prod_crop_id);
        return {
          ...orderProd,
          crop: cropData ? cropData : null,
        };
      });
      // combine orderProducts inside the orders table
      const combinedOrders = ordersFiltered.map(order => {
        const orderProductsData = combinedOrderProds.filter(ordProd => ordProd.order_id === order.order_id);
        return {
          ...order,
          order_products: orderProductsData ? orderProductsData : null,
        };
      });
      // extract crop id with total weight sold and total price sold
      const productDetailsArray = combinedOrders.flatMap(order =>
        order.order_products ?
          order.order_products.map(product => ({
            order_prod_id: product.order_prod_id,
            crop_id: product.order_prod_crop_id,
            total_weight: product.order_prod_total_weight,
            total_price: product.order_prod_total_price,
            order_date: order.order_date,
            variety_id: product.crop.crop_variety_id,
          }))
          : []
      );
      // filter the productdetailsarray so that only those who are in the same variety will stay
      const filteredProductDetailsArray = productDetailsArray.filter(product =>
        cropsFiltered.some(crop => crop.crop_id === product.crop_id)
      );
      // Combine data with the same variety_id and order_date
      const combinedProductDetailsArray = filteredProductDetailsArray.reduce((acc, product) => {
        // Create a unique key based on variety_id and order_date
        const key = `${product.variety_id}_${new Date(product.order_date).toISOString()}`;

        const pricePerWeight = product.total_price / product.total_weight;

        if (!acc[key]) {
          // If the key doesn't exist, create a new entry
          acc[key] = {
            variety_id: product.variety_id,
            order_date: product.order_date,
            total_price: product.total_price,
            total_weight: product.total_weight,
            highest: pricePerWeight, // Initialize highest price per weight
            lowest: pricePerWeight,  // Initialize lowest price per weight
            sum_price_per_weight: pricePerWeight, // Used to calculate average
            count: 1, // Used to keep track of the number of entries for average
          };
        } else {
          // If the key exists, accumulate the total_price and total_weight
          acc[key].total_price += product.total_price;
          acc[key].total_weight += product.total_weight;

          // Update highest and lowest price per weight
          acc[key].highest = Math.max(acc[key].highest, pricePerWeight);
          acc[key].lowest = Math.min(acc[key].lowest, pricePerWeight);

          // Accumulate sum for average calculation and increment count
          acc[key].sum_price_per_weight += pricePerWeight;
          acc[key].count += 1;
        }

        return acc;
      }, {});

      // After reduce, calculate the average for each entry
      const combinedProductDetails = Object.values(combinedProductDetailsArray).map(item => ({
        ...item,
        average: item.sum_price_per_weight / item.count, // Calculate average price per weight
      }));

      const varietiesComplete = varieties.filter(variety => Number(variety.crop_sub_category_id) === Number(subcategoryId));
      // combine orderProducts inside the orders table
      const varietiesFiltered = varietiesComplete.map(variety => {
        // Filter crops for the current variety
        const availableCrops = cropsFiltered.filter(crop => crop.crop_variety_id === variety.crop_variety_id);
        // If there are no available crops, set defaults to null
        if (availableCrops.length === 0) {
          return {
            ...variety,
            availableListing: 0, // Set count to 0 if no available crops
            highestListing: 0,
            lowestListing: 0,
          };
        }
        // Find the highest and lowest price crops
        const highestCrop = availableCrops.reduce((max, crop) => (crop.crop_price > max.crop_price ? crop : max), availableCrops[0]);
        const lowestCrop = availableCrops.reduce((min, crop) => (crop.crop_price < min.crop_price ? crop : min), availableCrops[0]);
        return {
          ...variety,
          availableListing: availableCrops.length,
          highestListing: highestCrop,
          lowestListing: lowestCrop,
        };
      });

      setVarietyData(combinedProductDetails)
      setVarietyMarketData(varietiesFiltered)
      console.log('varietiesFiltered :', varietiesFiltered);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [varietyId]);

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
    <div className="bg-gray-100 p-4 pt-8">
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
            ₱20
          </p>
        </div>

        {/* Highest */}
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
          <h5 className="text-xl font-bold text-green-500 mb-4">Highest</h5>
          <p className="text-2xl font-bold text-green-700">
            ₱20
          </p>
        </div>

        {/* Lowest */}
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
          <h5 className="text-xl font-bold text-green-500 mb-4">Lowest</h5>
          <p className="text-2xl font-bold text-green-700">
            ₱20
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
          {/* {renderAnalyticsChart(varietyData)} */}
        </div>
      </div>
    </div>
  );
};

export default SelectedVarietyAnalyticsPage;
