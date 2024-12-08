import React, { useState, useEffect, useCallback } from 'react';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY;

const MarketAnalyticsPage = () => {
  const [marketData, setMarketData] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const cropsResponse = await fetch(`/api/crops`, {
        headers: {
          "x-api-key": API_KEY,
        },
      });

      const categoryResponse = await fetch(`/api/crop_categories`, {
        headers: {
          "x-api-key": API_KEY,
        },
      });

      const subcategoryResponse = await fetch(`/api/crop_sub_categories`, {
        headers: {
          "x-api-key": API_KEY,
        },
      });

      const varietyResponse = await fetch(`/api/crop_varieties`, {
        headers: {
          "x-api-key": API_KEY,
        },
      });

      const crops = await cropsResponse.json();
      const categoriesraw = await categoryResponse.json();
      const subcategories = await subcategoryResponse.json();
      const varieties = await varietyResponse.json();

      const categories = categoriesraw.sort((a, b) => a.crop_category_id - b.crop_category_id);

      // Combine the varieties with the crops
      const combinedVarieties = varieties.map(variety => {
        const cropsData = crops.filter(crop => crop.crop_variety_id === variety.crop_variety_id);
        return {
          ...variety,
          crops: cropsData ? cropsData : null,
        };
      });

      // Combine the subcategories with the varieties
      const combinedSubcategories = subcategories.map(subcat => {
        const varietiesData = combinedVarieties.filter(variety => variety.crop_sub_category_id === subcat.crop_sub_category_id);
        return {
          ...subcat,
          varieties: varietiesData ? varietiesData : null,
        };
      });

      // Combine the categories with the subcategories
      const combinedCategories = categories.map(cat => {
        const subcategoriesData = combinedSubcategories.filter(subCat => subCat.crop_category_id === cat.crop_category_id);
        return {
          ...cat,
          subcategories: subcategoriesData ? subcategoriesData : null,
        };
      });

      setMarketData(combinedCategories)
      console.log('combinedCategories :', combinedCategories);
    } catch (error) {
      setError(error);
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredMarketData = marketData.map(category => {
    const filteredSubcategories = category.subcategories?.filter(subcat => {
      const filteredVarieties = subcat.varieties?.filter(variety =>
        variety.crop_variety_name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      return subcat.crop_sub_category_name.toLowerCase().includes(searchQuery.toLowerCase())
        || (filteredVarieties && filteredVarieties.length > 0);
    });

    return {
      ...category,
      subcategories: filteredSubcategories,
      matched: category.crop_category_name.toLowerCase().includes(searchQuery.toLowerCase())
        || (filteredSubcategories && filteredSubcategories.length > 0)
    };
  }).filter(category => category.matched);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-r from-[rgb(182,244,146)] to-[rgb(51,139,147)] flex items-center justify-center">
        <div className="bg-white/30 backdrop-blur-md p-8 rounded-2xl shadow-2xl flex items-center space-x-4">
          <div className="animate-spin h-8 w-8 text-white">
            <svg className="w-full h-full" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-white">Loading market data...</span>
        </div>
      </div>
    );
  }

  const toggleExpandCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const toggleExpandSubcategory = (subcategoryId) => {
    setExpandedSubcategory(expandedSubcategory === subcategoryId ? null : subcategoryId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[rgb(182,244,146)] to-[rgb(51,139,147)]">
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 drop-shadow-md mb-2">
                Market Analytics
              </h1>
              <p className="text-gray-700 text-lg font-medium">
                Explore market categories and their performance
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                <span className="text-gray-800 font-medium">
                  {marketData.length} Categories
                </span>
              </div>
            </div>
          </div>

          {/* Add Search Bar */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search categories, subcategories, or varieties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/90 backdrop-blur-sm 
                  border border-white/30 focus:outline-none focus:ring-2 
                  focus:ring-green-500 text-gray-800 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Grid - Update marketData to filteredMarketData */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMarketData.map((category) => (
            <div key={category.crop_category_id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden h-fit">
              {/* Category Header */}
              <button
                className={`w-full p-4 flex items-center justify-between transition-colors duration-200 ${expandedCategory === category.crop_category_id ? 'bg-green-50' : 'hover:bg-gray-50/50'
                  }`}
                onClick={() => toggleExpandCategory(category.crop_category_id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-xl overflow-hidden shadow-md">
                    <img
                      src={category.crop_category_image_url}
                      alt={category.crop_category_name}
                      className="h-full w-full object-cover transform transition-transform duration-300 hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-xl font-bold text-gray-900">
                    {category.crop_category_name}
                  </span>
                </div>
                <div className={`transition-transform duration-300 ${expandedCategory === category.crop_category_id ? 'rotate-180' : ''
                  }`}>
                  <FaChevronDown className="h-5 w-5 text-green-600" />
                </div>
              </button>

              {/* Subcategories */}
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${expandedCategory === category.crop_category_id ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                <div className="p-4 space-y-3">
                  {category.subcategories?.map((subcat) => (
                    <div key={subcat.crop_sub_category_id} className="bg-gray-50 rounded-xl overflow-hidden shadow-sm">
                      {/* Subcategory Header */}
                      <button
                        className={`w-full p-3 flex items-center justify-between transition-colors duration-200 ${expandedSubcategory === subcat.crop_sub_category_id ? 'bg-green-50' : 'hover:bg-gray-100/50'
                          }`}
                        onClick={() => toggleExpandSubcategory(subcat.crop_sub_category_id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-lg overflow-hidden shadow-sm">
                            <img
                              src={subcat.crop_sub_category_image_url}
                              alt={subcat.crop_sub_category_name}
                              className="h-full w-full object-cover transform transition-transform duration-300 hover:scale-110"
                              loading="lazy"
                            />
                          </div>
                          <span className="text-lg font-semibold text-green-600">
                            {subcat.crop_sub_category_name}
                          </span>
                        </div>
                        <div className={`transition-transform duration-300 ${expandedSubcategory === subcat.crop_sub_category_id ? 'rotate-180' : ''
                          }`}>
                          <FaChevronDown className="h-4 w-4 text-green-600" />
                        </div>
                      </button>

                      {/* Varieties */}
                      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${expandedSubcategory === subcat.crop_sub_category_id ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                        <div className="p-3 space-y-2">
                          {subcat.varieties?.map((variety) => (
                            <button
                              key={variety.crop_variety_id}
                              className="w-full bg-white rounded-lg p-3 flex items-center space-x-3 
                                hover:bg-green-50 transition-all duration-200 transform hover:scale-[1.02] shadow-sm"
                              onClick={() => navigate(`/admin/VarietyAnalytics/${variety.crop_variety_id}`)}
                            >
                              <div className="h-8 w-8 rounded-lg overflow-hidden shadow-sm">
                                <img
                                  src={variety.crop_variety_image_url}
                                  alt={variety.crop_variety_name}
                                  className="h-full w-full object-cover transform transition-transform duration-300 hover:scale-110"
                                  loading="lazy"
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {variety.crop_variety_name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketAnalyticsPage;
