import React, { useRef, useState, useEffect } from 'react';
import MainLogo from '/AgriTayo_Logo.png';
import bg from '/farm-bg.png';

const featureData = [
  { title: 'Support Local Farmers', description: 'Every purchase helps hardworking farmers directly, empowering local communities.' },
  { title: 'Communicate and Interact', description: 'We promote communication and interaction between farmers and buyers.' },
  { title: 'Simple and Fresh', description: 'Order fresh agricultural produce through our simple and easy-to-use app.' },
];

const devTeam = [
  { title: 'Rie Zhenzy Zumel', description: 'Project Lead' },
  { title: 'Rafael Martin Aquino', description: 'Developer' },
  { title: 'Michael Joshua Aquino', description: 'Developer' },
  { title: 'Karl Nikolai Vladimir Agustin Parallag III', description: 'Developer' },
  { title: 'Alex Raphael Abalos', description: 'Developer' }
];

const aboutSection = [
  { title: 'What is AgriTayo?', description: 'AgriTayo is an e-commerce system for farmers and consumers. The purpose of the system is to allow farmers to post their products, while also allowing consumers to directly buy products from the farmers.' },
  { title: 'Why Choose AgriTayo?', description: 'At AgriTayo, we are committed to supporting local farmers and making buying easier. Every product you buy helps reduce food miles and supports fair trade farming practices.' }
];

function LandingPage() {
  const featuresRef = useRef(null);
  const devTeamRef = useRef(null);
  const aboutRef = useRef(null); 
  const sectionRefs = [featuresRef, devTeamRef]; 
  const [currentSection, setCurrentSection] = useState(0);
  const [atBottom, setAtBottom] = useState(false);

  const smoothScrollTo = (targetPosition) => {
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const duration = 800; 
    let startTime = null;

    const animation = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1); 
      const ease = easeInOutQuad(progress); 
      window.scrollTo(0, startPosition + distance * ease);
      
      if (progress < 1) requestAnimationFrame(animation);
    };

    requestAnimationFrame(animation);
};

  const easeInOutQuad = (t) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; 
  };

  const scrollToNextSection = () => {
    const targetSection = sectionRefs[currentSection].current;
    if (targetSection) {
      const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY;
      smoothScrollTo(targetPosition);

      setCurrentSection((prev) => (prev + 1) % sectionRefs.length); 
    }
  };

  const scrollToTop = () => {
    smoothScrollTo(0); 
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrolledToBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;
      setAtBottom(scrolledToBottom);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, 
  []);

  return (
    <div className="bg-gradient-to-b from-[#E6F5E1] to-[#ffffff] flex flex-col">
      <div className="h-screen flex flex-col items-center justify-center relative" style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <img src={MainLogo} alt="AgriTayo Logo" className="h-auto w-full max-w-[300px] md:max-w-[450px] drop-shadow-lg mx-auto mb-6" />
        <h1 className="text-6xl md:text-8xl font-bold mb-4 shadow-lg text-center mx-auto" style={{ color: '#00B251', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }}>
          Welcome to AgriTayo
        </h1>

        <p className="text-lg md:text-xl text-gray-200 max-w-[600px] text-center mb-6 shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }}>
          Connecting local farmers with buyers across La Trinidad. Fresh produce, farm-to-table, with just a few clicks.
        </p>
      </div>

      <section ref={featuresRef} className="py-28 bg-[#fef9c3] text-center">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {featureData.map(({ title, description }, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105">
              <h3 className="text-xl md:text-3xl font-bold text-[#008F41]">{title}</h3>
              <p className="text-gray-800">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section ref={aboutRef} className="py-16" style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        {aboutSection.map(({ title, description }, index) => (
          <div key={index} className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#00B251] flex-1" style={{ textShadow: '2px 2px 4px black' }}>
              {title}
            </h2>
            <p className="text-lg text-white max-w-[800px] mx-auto flex-1" style={{ textShadow: '1px 1px 2px black' }}>
              {description}
            </p>
          </div>
        ))}

        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8">
          <h1 className="text-2xl text-[#00B251] font-bold" style={{ textShadow: '2px 2px 4px black' }}>
            Join us in creating a healthier, more sustainable produce trading system.
          </h1>
        </div>
        <div className="h-8"></div>
      </section>

      <section ref={devTeamRef} className="py-16 bg-[#F5F9F5] text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#00B251] mb-4">About the Team</h2>
        <p className="text-lg text-gray-700 max-w-[900px] mx-auto mb-6">
          <span className="font-semibold text-[#00B251]">AgriTayo</span> was developed by 4th year <span className="font-semibold text-[#b91c1c]">University of Baguio</span> students as their Capstone Project and Research.
        </p>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-1 gap-8 mb-12">
          {devTeam.map(({ title, description }, index) => (
            <div key={index} className="p-6 transition-transform duration-300 transform hover:scale-105 flex flex-col justify-center items-center">
              <h3 className="text-xl md:text-xl font-bold text-[#008F41] text-center">{title}</h3>
              <p className="text-gray-800 text-center">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-0 w-full bg-[#E6F5E1] py-6 text-center">
        <p className="text-sm text-gray-500">
          Developed by students of the <span className="font-semibold text-[#b91c1c]">University of Baguio</span> &copy; {new Date().getFullYear()} AgriTayo. All rights reserved.
        </p>
      </footer>

      {!atBottom && (
        <button onClick={scrollToNextSection} className="fixed bottom-16 right-16 bg-[#00B251] text-white p-4 rounded-full hover:bg-[#008F41] transition duration-300 transform hover:scale-105 shadow-lg flex items-center">
          <span className="mr-2">More</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-bounce" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 14.586l4.293-4.293 1.414 1.414L10 17.414l-5.707-5.707 1.414-1.414L10 14.586z" clipRule="evenodd" />
          </svg>
        </button>
      )}

      {atBottom && (
        <button onClick={scrollToTop} className="fixed bottom-16 right-16 bg-[#008F41] text-white p-4 rounded-full hover:bg-[#00B251] transition duration-300 transform hover:scale-105 shadow-lg flex items-center">
          <span className="mr-2">Back to Top</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-bounce" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5.414l-4.293 4.293-1.414-1.414L10 1.414l5.707 5.707-1.414 1.414L10 5.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}

    </div>
  );
}

export default LandingPage;
