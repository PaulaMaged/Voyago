import mongo_conn from './connection/mongo.js';
import express from 'express';
import 'dotenv/config';  // Use this for dotenv in ES Modules

import advertiserRoutes from './routes/AdvertiserRoutes.js';
import publicRoutes from './routes/PublicRoutes.js';
import tourGuideRoutes from './routes/TourGuideRoutes.js';
import tourismGovernorRoutes from './routes/TourismGovernorRoutes.js';
import touristRoute from './routes/TouristRoutes.js';
import sellerRoutes from './routes/SellerRoutes.js';
import Register from './controllers/UserController.js';
import cors from "cors"
const app = express();
const port = 8000;
app.use(cors());
app.use(express.json());

mongo_conn().catch(err => console.log("Error Connecting to data-base ", err));

// Routes
app.use('/api/advertiser', advertiserRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/tourguide', tourGuideRoutes);
app.use('/api/tourismgovernor', tourismGovernorRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/tourist', touristRoute);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/signUp', Register);

app.listen(process.env.PORT || port, () => {
  console.log(`Server running on port ${process.env.PORT || port}`);
});
