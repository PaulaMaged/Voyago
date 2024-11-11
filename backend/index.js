import mongo_conn from "./connection/mongo.js";
import express from "express";
import "dotenv/config"; // Use this for dotenv in ES Modules
import AdvertiserRoutes from "./routes/AdvertiserRoutes.js";
import PublicRoutes from "./routes/PublicRoutes.js";
import TourGuideRoutes from "./routes/TourGuideRoutes.js";
import TourismGovernorRoutes from "./routes/TourismGovernorRoutes.js";
import TouristRoutes from "./routes/TouristRoutes.js";
import SellerRoutes from "./routes/SellerRoutes.js";
import AdminRoutes from "./routes/AdminRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";
import cookieParser from 'cookie-parser';
import axios from 'axios'
import cors from "cors";



const app = express();
const port = process.env.PORT || 8000;

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Database connection
mongo_conn().catch((err) => console.log("Error Connecting to database ", err));




//Amadeus Token

// Amadeus Token Management
const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY;
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET;
let amadeusToken = '';
let tokenExpiration = null;

// Function to obtain access token
const getAmadeusToken = async () => {
  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', AMADEUS_API_KEY);
    params.append('client_secret', AMADEUS_API_SECRET);

    const response = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token, expires_in } = response.data;
    amadeusToken = access_token;
    tokenExpiration = Date.now() + expires_in * 1000; // Convert expires_in to milliseconds
    console.log('Amadeus access token obtained');
  } catch (error) {
    console.error(
      'Error obtaining Amadeus token:',
      error.response ? error.response.data : error.message
    );
    throw new Error('Failed to obtain Amadeus access token');
  }
};

// Initialize token on server start
getAmadeusToken();

// Middleware to refresh token if expired
const ensureAmadeusToken = async (req, res, next) => {
  if (!amadeusToken || Date.now() >= tokenExpiration) {
    try {
      await getAmadeusToken();
    } catch (error) {
      return res.status(500).json({ error: 'Failed to refresh Amadeus access token' });
    }
  }
  next();
};

// Endpoint to search hotels by city code
app.get('/api/search-hotels', ensureAmadeusToken, async (req, res) => {
  const { cityCode } = req.query;
  if (!cityCode) {
    return res.status(400).json({ error: 'City code is required' });
  }

  try {
    const hotelsResponse = await axios.get(
      'https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city',
      {
        headers: {
          Authorization: `Bearer ${amadeusToken}`,
        },
        params: {
          cityCode,
        },
      }
    );

    res.json(hotelsResponse.data);
  } catch (error) {
    console.error('Error fetching hotels:', error.response ? error.response.data : error.message);
    res.status(500).json({
      message: 'Error fetching hotel data',
      error: error.response ? error.response.data : error.message,
    });
  }
});

// Hotel Booking Endpoint (Simulated)
app.post('/api/book-hotel', async (req, res) => {
  const { hotelId, userDetails } = req.body;

  try {
    // Simulate booking logic
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
});

app.get('/api/search-flights', ensureAmadeusToken, async (req, res) => {
  const { origin, departureDate, oneWay, duration, nonStop, maxPrice } = req.query;

  if (!origin) {
    return res.status(400).json({ error: 'Origin IATA code is required' });
  }

  try {
    const flightsResponse = await axios.get(
      'https://test.api.amadeus.com/v1/shopping/flight-destinations',
      {
        headers: {
          Authorization: `Bearer ${amadeusToken}`,
        },
        params: {
          origin,
          departureDate,
          oneWay,
          duration,
          nonStop,
          maxPrice,
        },
      }
    );

    res.json(flightsResponse.data);
  } catch (error) {
    console.error(
      'Error fetching flights:',
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      message: 'Error fetching flight data',
      error: error.response ? error.response.data : error.message,
    });
  }
});

// Routes
app.use("/api/advertiser", AdvertiserRoutes);
app.use("/api/tourist", TouristRoutes);
app.use("/api/public", PublicRoutes);
app.use("/api/tour-guide", TourGuideRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/tourism-governor", TourismGovernorRoutes);
app.use("/api/seller", SellerRoutes);
// Root route for testing
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
