import React, { useState, useEffect } from 'react';

function DownloadAppPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800 px-4">
      <div className="text-center max-w-2xl mx-auto py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#00B251]">Download Our Mobile App</h1>
        <p className="text-lg md:text-xl mb-8 text-gray-600">
          Experience the best features and performance with our mobile app. Available on both iOS and Android platforms.
        </p>

        <div className="flex justify-center space-x-4 mb-12">
          <a
            href="#"
            className="bg-[#00B251] text-white rounded-lg px-6 py-3 text-sm md:text-base font-semibold hover:bg-[#00a144] transition-all"
          >
            <img src="/apple-store.png" alt="Apple Store" className="h-6 inline mr-2" />
            Download on the App Store
          </a>
          <a
            href="#"
            className="bg-[#00B251] text-white rounded-lg px-6 py-3 text-sm md:text-base font-semibold hover:bg-[#00a144] transition-all"
          >
            <img src="/google-play.png" alt="Google Play Store" className="h-6 inline mr-2" />
            Get it on Google Play
          </a>
        </div>

        <img
          src="/app-illustration.png"
          alt="Mobile App Illustration"
          className="max-w-full h-auto mx-auto drop-shadow-lg rounded-lg"
        />
      </div>
    </div>
  );
}

export default DownloadAppPage;
