import React, { useRef } from 'react';
import MainLogo from '/AgriTayo_Logo.png';
import bg from '/farm-bg2.png';

const featureData = [
  {title: 'Support Local Farmers', description: 'Every purchase helps hardworking farmers directly, empowering local communities.'},
  {title: 'Communicate and Interact', description: 'We promote communication and interaction between farmers and buyers.'},
  {title: 'Simple and Fresh', description: 'Order fresh agricultural produce through our simple and easy-to-use app.'},
];

const devTeam = [
  {title: 'Rie Zhenzy Zumel', description: 'Project Lead'},
  {title: 'Rafael Martin Aquino', description: 'Developer'},
  {title: 'Michael Joshua Aquino', description: 'Developer'},
  {title: 'Karl Nikolai Vladimir Agustin Parallag III', description: 'Developer'},
  {title: 'Alex Raphael Abalos', description: 'Developer'}  
];


function LandingPage() {
  const featuresRef = useRef(null); 

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-gradient-to-b from-[#E6F5E1] to-[#ffffff] flex flex-col">
      <div className="h-screen flex flex-col items-center justify-center relative" style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <img src={MainLogo} alt="AgriTayo Logo" className="h-auto w-full max-w-[300px] md:max-w-[450px] drop-shadow-lg mx-auto mb-6" />
        <h1 className="text-6xl md:text-8xl font-bold mb-4 shadow-lg" style={{ color: '#00B251', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }}>
          Welcome to AgriTayo
        </h1>

        <p className="text-lg md:text-xl text-gray-200 max-w-[600px] text-center mb-6 shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }}>
          Connecting local farmers with buyers across La Trinidad. Fresh produce, farm-to-table, with just a few clicks.
        </p>

        <button onClick={scrollToFeatures} className="absolute bottom-16 bg-[#00B251] text-white p-4 rounded-full hover:bg-[#008F41] transition duration-300 transform hover:scale-105 shadow-lg flex items-center">
          <span className="mr-2">Learn More</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-bounce" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 14.586l4.293-4.293 1.414 1.414L10 17.414l-5.707-5.707 1.414-1.414L10 14.586z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <section ref={featuresRef} className="py-16 bg-[#fef9c3] text-center">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {featureData.map(({ title, description }, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105">
              <h3 className="text-xl md:text-3xl font-bold text-[#008F41]">{title}</h3>
              <p className="text-gray-800">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section ref={featuresRef} className="py-16" style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8"> 
          <h2 className="text-2xl md:text-3xl font-bold text-[#00B251] " style={{ textShadow: '2px 2px 4px black' }}>Why Choose AgriTayo?</h2>
          <p className="text-lg text-white max-w-[800px] mx-auto" style={{ textShadow: '1px 1px 2px black' }}>
            At <span className="font-semibold text-[#00B251]">AgriTayo</span>, we are committed to supporting local farmers and making buying easier. Every product you buy helps reduce food miles and supports fair trade farming practices.
          </p>
          <p className="text-lg text-[#00B251] font-bold" style={{ textShadow: '1px 1px 2px black' }}>Join us in creating a healthier, more sustainable produce trading system.</p>
        </div>
      </section>




      <section className="py-16 bg-[#F5F9F5] text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#00B251] mb-4">About the Team</h2>
        <p className="text-lg text-gray-700 max-w-[900px] mx-auto mb-6">
          <span className="font-semibold text-[#00B251]">AgriTayo</span> was developed by 4th year University of Baguio students as their Capstone Project and Research.
        </p>


        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {devTeam.map(({ title, description }, index) => (
            <div key={index} className="flex flex-col justify-center p-6 bg-white rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105"> 
              <h3 className="text-xl md:text-xl font-bold text-[#008F41] text-center">{title}</h3> 
              <p className="text-gray-800 text-center">{description}</p> 
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-0 w-full bg-[#E6F5E1] py-6 text-center">
        <p className="text-sm text-gray-500">
          Developed by students of the <span className="font-semibold">University of Baguio</span> &copy; {new Date().getFullYear()} AgriTayo. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;
