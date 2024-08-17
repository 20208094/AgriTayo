import React from 'react';
import { Link } from 'react-router-dom'; // Replace navigation with Link for React Router
import logo from '/AgriTayo_Logo.svg'; // Adjust the path as needed

const marketCategories = [
  { id: 1, title: 'Vegetables', image: logo },
  { id: 2, title: 'Fruits', image: logo },
  { id: 3, title: 'Spices', image: logo },
  { id: 4, title: 'Seedlings', image: logo },
  { id: 5, title: 'Plants', image: logo },
  { id: 6, title: 'Flowers', image: logo },
];

const MarketCategoryCard = ({ marketCategory }) => {
  return (
    <div className="bg-white rounded-lg shadow m-2 w-[45%] mb-3">
      <Link to={`/market-list/${marketCategory.title}`}>
        <div className="rounded-t-lg overflow-hidden">
          <img src={marketCategory.image} alt={marketCategory.title} className="w-full h-28" />
          <div className="p-2.5">
            <h2 className="text-base font-bold mb-1.5">{marketCategory.title}</h2>
          </div>
        </div>
      </Link>
    </div>
  );
};

function MarketPage() {
  return (
    <div style={{ paddingBottom: '1rem' }}>
      <div className="flex flex-row flex-wrap justify-between">
        {marketCategories.map((marketCategory) => (
          <MarketCategoryCard key={marketCategory.id} marketCategory={marketCategory} />
        ))}
      </div>
    </div>
  );
}

export default MarketPage;