import React from 'react';
import Navbar from './common/Navbar';
import Footer from './common/Footer';
import { FaMapMarkedAlt, FaCalendarAlt, FaLandmark, FaHotel } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[70vh] bg-cover bg-center" 
           style={{ backgroundImage: "url('/src/assets/ancientEgypt.jpg')" }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto h-full flex items-center px-4">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">Discover Egypt's Wonders</h1>
            <p className="text-xl mb-8">Experience the magic of ancient civilization with our curated tours and activities</p>
            <Link 
              to="/viewActivityGuest" 
              className="px-8 py-3 bg-[var(--primary)] text-white rounded-full 
                       hover:bg-[var(--primaryLight)] transition-colors inline-block"
            >
              Explore Now
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-[var(--textPrimary)]">
          Explore Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Link to="/viewActivityGuest" className="group">
            <div className="p-6 bg-[var(--surface)] rounded-lg shadow-lg hover:shadow-xl transition-all">
              <FaMapMarkedAlt className="text-4xl text-[var(--primary)] mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">Activities</h3>
              <p className="text-[var(--textSecondary)]">Discover exciting activities and tours</p>
            </div>
          </Link>

          <Link to="/viewItineraryGuest" className="group">
            <div className="p-6 bg-[var(--surface)] rounded-lg shadow-lg hover:shadow-xl transition-all">
              <FaCalendarAlt className="text-4xl text-[var(--primary)] mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">Itineraries</h3>
              <p className="text-[var(--textSecondary)]">Plan your perfect Egyptian journey</p>
            </div>
          </Link>

          <Link to="/viewLandmarks" className="group">
            <div className="p-6 bg-[var(--surface)] rounded-lg shadow-lg hover:shadow-xl transition-all">
              <FaLandmark className="text-4xl text-[var(--primary)] mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">Landmarks</h3>
              <p className="text-[var(--textSecondary)]">Explore historic Egyptian landmarks</p>
            </div>
          </Link>

          <Link to="/hotelBooking" className="group">
            <div className="p-6 bg-[var(--surface)] rounded-lg shadow-lg hover:shadow-xl transition-all">
              <FaHotel className="text-4xl text-[var(--primary)] mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">Hotels</h3>
              <p className="text-[var(--textSecondary)]">Find the perfect place to stay</p>
            </div>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;