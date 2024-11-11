import mongo_conn from "./connection/mongo.js";
import express from "express";
import "dotenv/config"; // Use this for dotenv in ES Modules
import getAmadeusToken from "./third_party/get_third_party_token.js";
import AdvertiserRoutes from "./routes/AdvertiserRoutes.js";
import PublicRoutes from "./routes/PublicRoutes.js";
import TourGuideRoutes from "./routes/TourGuideRoutes.js";
import TourismGovernorRoutes from "./routes/TourismGovernorRoutes.js";
import TouristRoutes from "./routes/TouristRoutes.js";
import SellerRoutes from "./routes/SellerRoutes.js";
import AdminRoutes from "./routes/AdminRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";
import thirdPartyRoutes from './routes/ThirdPartyRoutes.js'
import cookieParser from 'cookie-parser';
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
getAmadeusToken();

setInterval(getAmadeusToken, 60 * 60 * 1000);

// Routes
app.use("/api/advertiser", AdvertiserRoutes);
app.use("/api/tourist", TouristRoutes);
app.use("/api/public", PublicRoutes);
app.use("/api/tour-guide", TourGuideRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/tourism-governor", TourismGovernorRoutes);
app.use("/api/seller", SellerRoutes);
app.use("/api/thirdParty", thirdPartyRoutes);
// Root route for testing
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
