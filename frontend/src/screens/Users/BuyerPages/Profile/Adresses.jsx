import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Modal from "../../../../components/Modal/Modal";

// LocationMarker Component
function LocationMarker({ setLatitude, setLongitude, latitude, longitude }) {
  const map = useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;
      setLatitude(lat);
      setLongitude(lng);
      map.setView([lat, lng], 13);
    },
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          const { latitude, longitude } = location.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          map.setView([latitude, longitude], 13);
        },
        () => {
          console.error("Geolocation permission denied or unavailable.");
        }
      );
    }
  }, [map, setLatitude, setLongitude]);

  return latitude && longitude ? (
    <Marker position={[latitude, longitude]} />
  ) : null;
}

function Addresses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [label, setLabel] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = {
      fullName,
      phoneNumber,
      fullAddress,
      postalCode,
      latitude,
      longitude,
    };
    console.log("Form Data:", formData);
    closeModal();
  };

  return (
    <>
      <div className="p-8 ml-72 mt-10">
        <h1 className="text-2xl font-bold text-gray-800">My Addresses</h1>
        <button
          className="px-4 py-2 bg-[#00b251] text-white rounded-lg shadow-md hover:bg-[#009e44] transition-colors duration-300"
          onClick={openModal}
        >
          + Add New Address
        </button>
        {/* Modal Contents */}
        <Modal isOpen={isModalOpen} onClose={closeModal} allowCloseOutside={false}>
          <form
            className="p-6 bg-white rounded-lg shadow-md w-full mx-auto 
            sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl"
            onSubmit={handleFormSubmit}
          >
            <h2 className="text-xl font-semibold mb-4 text-[#00b251]">New Address</h2>
            <input
              type="text"
              name="full_name"
              value={fullName}
              placeholder="Full Name"
              onChange={(e) => setFullName(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            <input
              type="text"
              name="phone_number"
              value={phoneNumber}
              placeholder="Phone Number"
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            <input
              type="text"
              name="full_address"
              value={fullAddress}
              placeholder="Full Address"
              onChange={(e) => setFullAddress(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            <input
              type="text"
              name="postal_code"
              value={postalCode}
              placeholder="Postal Code"
              onChange={(e) => setPostalCode(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            
            {/* Label As Section */}
            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Label As:</label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setLabel("Home")}
                  className={`px-4 py-2 border rounded-lg ${label === "Home" ? "bg-[#00b251] text-white" : "bg-white text-gray-700 border-gray-300"} transition-colors duration-300`}
                >
                  Home
                </button>
                <button
                  type="button"
                  onClick={() => setLabel("Work")}
                  className={`px-4 py-2 border rounded-lg ${label === "Work" ? "bg-[#00b251] text-white" : "bg-white text-gray-700 border-gray-300"} transition-colors duration-300`}
                >
                  Work
                </button>
              </div>
            </div>

            <MapContainer
              center={[16.411355740408894, -239.40484642982486]}
              zoom={13}
              style={{ height: "300px", width: "100%" }}
              className="mb-4"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker setLatitude={setLatitude} setLongitude={setLongitude} latitude={latitude} longitude={longitude} />
            </MapContainer>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#00b251] text-white rounded-lg shadow-md hover:bg-[#009e44] transition-colors duration-300"
              >
                Submit
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
}

export default Addresses;
