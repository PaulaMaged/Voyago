import axios from 'axios';

const searchHotel = async (req, res) => {
    const { cityCode, checkInDate, checkOutDate, adults } = req.body;
  
    try {
      const response = await axios.get('https://test.api.amadeus.com/v2/shopping/hotel-offers', {
        headers: {
          Authorization: `Bearer ${amadeusToken}`,
        },
        params: {
          cityCode,
          checkInDate,
          checkOutDate,
          adults,
          roomQuantity: 1,
        },
      });
  
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching hotels:', error.response ? error.response.data : error.message);
      res.status(500).json({ message: 'Error fetching hotel data' });
    }
  }

const bookHotel = async (req, res) => {
    const { hotelId, userDetails } = req.body;
  
    try {
      // Simulate booking logic
      // In real scenarios, you would interact with Booking.com's affiliate booking links or partner APIs.
  
      // Example Response
      res.json({
        bookingId: 'ABC123456',
        hotelId,
        userDetails,
        status: 'Confirmed',
        message: 'Your booking has been successfully confirmed!',
      });
    } catch (error) {
      console.error('Error booking hotel:', error.response ? error.response.data : error.message);
      res.status(500).json({ message: 'Error booking hotel' });
    }
  }

  export default {searchHotel, bookHotel};