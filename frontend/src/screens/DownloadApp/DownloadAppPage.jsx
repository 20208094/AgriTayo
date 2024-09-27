import React, { useState, useEffect } from 'react';
import { FaAppStore, FaGooglePlay } from "react-icons/fa";
import { SlArrowRightCircle, SlArrowLeftCircle, SlLockOpen } from "react-icons/sl";
import MainLogo from "/AgriTayo_Logo_wName.png";

const carouselImages = [
  '/DownloadApp/4.png',
  '/DownloadApp/5.png',
  '/DownloadApp/9.png',
  '/DownloadApp/13.png',
  '/DownloadApp/14.png',
  '/DownloadApp/1.png',
  '/DownloadApp/2.png',
  '/DownloadApp/3.png',
];

const carouselImages2 = [
  '/DownloadApp/6.png',
  '/DownloadApp/7.png',
  '/DownloadApp/8.png',
  '/DownloadApp/10.png',
  '/DownloadApp/11.png',
  '/DownloadApp/1.png',
  '/DownloadApp/2.png',
  '/DownloadApp/3.png',
];

const howItWorksData = [
  {
    imgSrc: "/DownloadApp/Register.png",
    title: "Register",
    description: "Register and create your account with ease to get started.",
  },
  {
    imgSrc: "/DownloadApp/Login.png",
    title: "Login",
    description: "Sign in or log in to your existing account to get started.",
  },
];

function DownloadPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentIndex2, setCurrentIndex2] = useState(0); // Declare currentIndex2

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1));
    }, 8000);
    
    const interval2 = setInterval(() => {
      setCurrentIndex2((prevIndex) => (prevIndex === carouselImages2.length - 1 ? 0 : prevIndex + 1)); // Update interval for carouselImages2
    }, 8000);

    return () => {
      clearInterval(interval);
      clearInterval(interval2);  
    };
  }, []);

  const handlePrevClick = () => setCurrentIndex((prevIndex) => (prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1));
  const handleNextClick = () => setCurrentIndex((prevIndex) => (prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1));

  const handlePrevClick2 = () => setCurrentIndex2((prevIndex) => (prevIndex === 0 ? carouselImages2.length - 1 : prevIndex - 1));
  const handleNextClick2 = () => setCurrentIndex2((prevIndex) => (prevIndex === carouselImages2.length - 1 ? 0 : prevIndex + 1));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6F5E1] to-[#ffffff] text-gray-800" >
      
      <section className="flex flex-col items-center justify-center text-center py-16 bg-[#f0faff] ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <div className="flex justify-center mt-8">
            <img src={MainLogo} alt="AgriTayo" className="h-auto w-full max-w-[300px] md:max-w-[450px] drop-shadow-lg mx-auto" />
          </div>
          <div className="flex items-center justify-center mt-12 md:mt-0">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-[#00B251] mb-4">
                A Perfect Platform to Get Fresh Farm Products
              </h1>
              <p className="text-base md:text-xl mb-8 text-gray-700 mx-4 md:mx-8 lg:mx-16">
                AgriTayo is a premier e-commerce platform dedicated to connecting farmers directly with consumers.
                We bring fresh farm products straight from the source to your doorstep, ensuring quality, sustainability,
                and fair trade practices.
              </p>
              <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 mb-12">
                <a
                  href="https://apps.apple.com" // Replace with actual link
                  className="flex items-center bg-[#00B251] text-white rounded-lg px-4 py-2 md:px-6 md:py-3 text-xs md:text-base font-semibold hover:bg-[#00a144] transition-all"
                  aria-label="Download on the App Store"
                >
                  <FaAppStore className="h-6 w-auto mr-2 md:mr-3" />
                  <span className="flex-1">Download on the App Store</span>
                </a>

                <a
                  href="https://play.google.com" // Replace with actual link
                  className="flex items-center bg-[#00B251] text-white rounded-lg px-4 py-2 md:px-6 md:py-3 text-xs md:text-base font-semibold hover:bg-[#00a144] transition-all"
                  aria-label="Get it on Google Play"
                >
                  <FaGooglePlay className="h-6 w-auto mr-2 md:mr-3" />
                  <span className="flex-1">Get it on Google Play</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hyperlinks to navigate parts of the screen */}
      <section className="py-16 bg-[#00B251] text-white text-center">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <button 
            onClick={() => {
              const element = document.getElementById('begin');
              if (element) {
                window.scrollTo({ top: element.offsetTop, behavior: 'smooth' });
              }
            }} 
            className="bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-900 transition-all"
          >
            
            Authentication
          </button>
          
          <button 
            onClick={() => {
              const element = document.getElementById('basics');
              if (element) {
                window.scrollTo({ top: element.offsetTop, behavior: 'smooth' });
              }
            }} 
            className="bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-900 transition-all"
          >
            Basic Features
          </button>

          <button 
            onClick={() => {
              const element = document.getElementById('essentials');
              if (element) {
                window.scrollTo({ top: element.offsetTop, behavior: 'smooth' });
              }
            }} 
            className="bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-900 transition-all"
          >
            Essential Features
          </button>
        </div>
      </section>

      <section className="py-16" id="begin">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-[#00B251] mb-12">Authentication</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {howItWorksData.map(({ imgSrc, title, description }, index) => (
            <div key={index}>
              <img src={imgSrc} alt={title} className="w-full h-auto mb-4 rounded-md shadow-md" />
              <h3 className="text-xl font-bold text-[#00B251]">{title}</h3>
              <p className="text-gray-700">{description}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Divider/Footer */}
      <section className="py-16 bg-[#00B251] text-white text-center" id='basics'>
        <div className="max-w-4xl mx-auto"></div>
      </section>

      <section className="relative w-full max-w-4xl mx-auto my-16">
        <div className="text-4xl md:text-5xl font-bold text-center text-[#00B251] mb-12">
          Basic Features
        </div>

        {/* Carousel Container */}
        <div className="relative w-full h-[400px] overflow-hidden rounded-lg shadow-lg group">
          {/* Carousel Image */}
          <img
            src={carouselImages[currentIndex]}
            alt={`Carousel ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Hover Zones with Hover-Activated Gradient */}
          <div
            className="absolute top-0 left-0 h-full w-[15%] opacity-0 group-hover:opacity-100 bg-gradient-to-r from-black/30 to-transparent transition-opacity duration-300 cursor-pointer"
            onClick={handlePrevClick}
            aria-label="Previous Slide"
          >
            {/* Previous Arrow */}
            <SlArrowLeftCircle className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8" />
          </div>

          <div
            className="absolute top-0 right-0 h-full w-[15%] opacity-0 group-hover:opacity-100 bg-gradient-to-l from-black/30 to-transparent transition-opacity duration-300 cursor-pointer"
            onClick={handleNextClick}
            aria-label="Next Slide"
          >
            {/* Next Arrow */}
            <SlArrowRightCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8" />
          </div>
        </div>

        {/* Pagination Circles */}
        <div className="flex justify-center mt-4">
          {carouselImages.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full mx-1 cursor-pointer transition-all duration-300 ${index === currentIndex ? 'bg-[#00B251]' : 'bg-gray-300'}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </section>
      
      {/* divider/footer */}
      <section className="py-16 bg-[#00B251] text-white text-center" id='essentials'>
        <div className="max-w-4xl mx-auto">
        </div>
      </section>

      <section className="relative w-full max-w-4xl mx-auto my-16">
        <div className="text-4xl md:text-5xl font-bold text-center text-[#00B251] mb-12">
          Essential Features
        </div>

        {/* Carousel Container 2 */}
        <div className="relative w-full h-[400px] overflow-hidden rounded-lg shadow-lg group">
          {/* Carousel Image 2 */}
          <img
            src={carouselImages2[currentIndex2]}
            alt={`Carousel ${currentIndex2 + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Hover Zones with Hover-Activated Gradient for Carousel 2 */}
          <div
            className="absolute top-0 left-0 h-full w-[15%] opacity-0 group-hover:opacity-100 bg-gradient-to-r from-black/30 to-transparent transition-opacity duration-300 cursor-pointer"
            onClick={handlePrevClick2}
            aria-label="Previous Slide"
          >
            {/* Previous Arrow */}
            <SlArrowLeftCircle className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8" />
          </div>

          <div
            className="absolute top-0 right-0 h-full w-[15%] opacity-0 group-hover:opacity-100 bg-gradient-to-l from-black/30 to-transparent transition-opacity duration-300 cursor-pointer"
            onClick={handleNextClick2}
            aria-label="Next Slide"
          >
            {/* Next Arrow */}
            <SlArrowRightCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8" />
          </div>
        </div>

        {/* Pagination Circles for Carousel 2 */}
        <div className="flex justify-center mt-4">
          {carouselImages2.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full mx-1 cursor-pointer transition-all duration-300 ${index === currentIndex2 ? 'bg-[#00B251]' : 'bg-gray-300'}`}
              onClick={() => setCurrentIndex2(index)}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* footer */}
      <section className="py-16 bg-[#00B251] text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Download Our App Now!</h2>
          <p className="text-lg mb-8">Get access to exclusive deals, track your orders, and more with our mobile app.</p>

          {/* Download Buttons */}
          <div className="flex justify-center gap-4">
            <a
              href="#"
              className="flex items-center bg-white text-black rounded-full py-2 px-4 shadow-lg hover:bg-gray-200 transition-all"
            >
              <FaAppStore className="h-6 w-auto mr-2 md:mr-3" />
              <span className="flex-1">Download on the App Store</span>
            </a>

            <a
              href="#"
              className="flex items-center bg-white text-black rounded-full py-2 px-4 shadow-lg hover:bg-gray-200 transition-all"
            >
              <FaGooglePlay className="h-6 w-auto mr-2 md:mr-3" />
              <span className="flex-1">Get it on Google Play</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}

export default DownloadPage;
