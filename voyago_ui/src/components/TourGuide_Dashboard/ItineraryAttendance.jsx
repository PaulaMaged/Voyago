import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ItineraryAttendance = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const tourGuideId = localStorage.getItem('roleId');

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/tour-guide/itinerary-bookings/${tourGuideId}`);
      setBookings(response.data);
      setFilteredBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = bookings.filter(booking => 
      booking.tourist.user.username.toLowerCase().includes(term) ||
      booking.itinerary.name.toLowerCase().includes(term)
    );
    setFilteredBookings(filtered);
  };

  const markAsAttended = async (bookingId) => {
    try {
      const tourGuideId = localStorage.getItem('roleId');
      await axios.patch(
        `http://localhost:8000/api/tour-guide/mark-attendance/${tourGuideId}/${bookingId}`
      );
      await fetchBookings();
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Error marking attendance: ' + error.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Itinerary Attendance</h1>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by tourist or itinerary name..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="grid gap-4">
        {filteredBookings.map(booking => (
          <div key={booking._id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{booking.itinerary.name}</h3>
                <p className="text-sm text-gray-600">Tourist: {booking.tourist.user.username}</p>
                <p className="text-sm text-gray-600">
                  Booking Date: {new Date(booking.booking_date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Itinerary Date: {new Date(booking.itinerary.start_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                {booking.attended ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Attended
                  </span>
                ) : (
                  <button
                    onClick={() => markAsAttended(booking._id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Mark as Attended
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryAttendance;