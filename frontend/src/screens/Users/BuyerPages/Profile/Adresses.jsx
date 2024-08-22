import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ProfileSidebar from "./ProfileComponents/ProfileSidebar";
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
    <Marker position={[latitude, longitude]}>
    </Marker>
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
      <ProfileSidebar />
      <div className="p-8 ml-72 mt-10">
        <h1>My Addresses</h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={openModal}
        >
          + Add New Address
        </button>
        {/* Modal Contents */}
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <form className="" onSubmit={handleFormSubmit}>
            <h2 className="text-xl font-semibold mb-4">New Address</h2>
            <input
              type="text"
              name="full_name"
              value={fullName}
              placeholder="Full Name"
              onChange={(e) => setFullName(e.target.value)}
              className=""
            />
            <input
              type="text"
              name="phone_number"
              value={phoneNumber}
              placeholder="Phone Number"
              onChange={(e) => setPhoneNumber(e.target.value)}
              className=""
            />
            <input
              type="text"
              name="full_address"
              value={fullAddress}
              placeholder="Full Address"
              onChange={(e) => setFullAddress(e.target.value)}
              className=""
            />
            <input
              type="text"
              name="postal_code"
              value={postalCode}
              placeholder="Postal Code"
              onChange={(e) => setPostalCode(e.target.value)}
              className=""
            />
            <MapContainer
              center={[51.505, -0.09]}
              zoom={13}
              style={{ height: "200px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker setLatitude={setLatitude} setLongitude={setLongitude} latitude={latitude} longitude={longitude} />
            </MapContainer>
            <button type="button" onClick={closeModal} className="">
              Cancel
            </button>
            <button type="submit" className="">
              Submit
            </button>
          </form>
        </Modal>
      </div>
    </>
  );
}

export default Addresses;
