import React, { useState, useEffect } from 'react';
import { FaAppStore, FaGooglePlay } from "react-icons/fa";
import MainLogo from "../../../public/AgriTayo_Logo_wName.png";

const carouselImages = [
  '/placeholder1.png',
  '/placeholder2.png',
  '/placeholder3.png',
  '/placeholder4.png',
];

const featureData = [
  {
    imgSrc: "/placeholder1.png",
    title: "Order From Your Favorite Shop",
    description: "Browse and order products from local farmers and shops.",
  },
  {
    imgSrc: "/placeholder2.png",
    title: "Easy To Search Product",
    description: "Find the products you need easily with our powerful search.",
  },
  {
    imgSrc: "/placeholder3.png",
    title: "Secure and Fast Payment",
    description: "Make secure payments quickly with multiple payment options.",
  },
];

const howItWorksData = [
  {
    imgSrc: "/placeholder4.png",
    title: "Create an Account",
    description: "Sign up or log in to your existing account to get started.",
  },
  {
    imgSrc: "/placeholder5.png",
    title: "Explore & Order",
    description: "Browse through various farm products and place your order.",
  },
];

const additionalInfo = [
  { title: "Location", description: "123 Farm Road, Farmville" },
  { title: "Working Hours", description: "Mon - Fri: 9am - 5pm" },
  { title: "Contact Us", description: "(123) 456-7890" },
];

const testimonials = [
  {
    quote: "AgriTayo has completely changed how we source our farm products. The quality is unmatched!",
    author: "- Customer 1",
  },
  {
    quote: "Reliable and convenient, AgriTayo is now our go-to platform for fresh produce.",
    author: "- Restaurant Owner 1",
  },
  {
    quote: "We've saved time and money by using AgriTayo for our farm product needs.",
    author: "- Customer 2",
  },
];

function AboutPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handlePrevClick = () => setCurrentIndex((prevIndex) => (prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1));
  const handleNextClick = () => setCurrentIndex((prevIndex) => (prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6F5E1] to-[#ffffff] text-gray-800">
      
      <section className="flex flex-col items-center justify-center text-center py-16 bg-[#f0faff]">
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


      <section className="py-16 bg-[#00B251] text-white text-center">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {featureData.map(({ imgSrc, title, description }, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-md">
              <img src={imgSrc} alt={title} className="w-full h-auto mb-4 rounded-md" />
              <h3 className="text-xl font-bold text-[#00B251]">{title}</h3>
              <p className="text-gray-700">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-[#00B251] mb-12">How The App Works</h2>
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

      <section className="relative w-full max-w-4xl mx-auto my-16">
        <div className="relative w-full h-[400px] overflow-hidden rounded-lg shadow-lg">
          <img
            src={carouselImages[currentIndex]}
            alt={`Carousel ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <button
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-[#00B251] text-white rounded-full p-2 hover:bg-[#00a144] transition-all shadow-md"
            onClick={handlePrevClick}
            aria-label="Previous Slide"
          >
            &lt;
          </button>
          <button
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-[#00B251] text-white rounded-full p-2 hover:bg-[#00a144] transition-all shadow-md"
            onClick={handleNextClick}
            aria-label="Next Slide"
          >
            &gt;
          </button>
        </div>
      </section>

      <section className="py-16 bg-[#00B251] text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalInfo.map(({ title, description }, index) => (
              <div key={index}>
                <h3 className="text-xl font-bold">{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#f7f7f7] text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-[#00B251] mb-8">Trusted by Customers & Restaurant Owners</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(({ quote, author }, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow-md">
              <p className="text-gray-700">"{quote}"</p>
              <h4 className="text-[#00B251] font-bold mt-4">{author}</h4>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
