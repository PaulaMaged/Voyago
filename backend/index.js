import mongo_conn from "./connection/mongo.js";
import express from "express";
import "dotenv/config"; // Use this for dotenv in ES Modules

import advertiserRoutes from "./routes/AdvertiserRoutes.js";
import publicRoutes from "./routes/PublicRoutes.js";
import tourGuideRoutes from "./routes/TourGuideRoutes.js";
import tourismGovernorRoutes from "./routes/TourismGovernorRoutes.js";
import touristRoute from "./routes/TouristRoutes.js";
import sellerRoutes from "./routes/SellerRoutes.js";
import adminRoutes from "./routes/AdminRoutes.js";
import cors from "cors";

const app = express();
const port = process.env.PORT || 8000;

// Middleware setup
app.use(cors());
app.use(express.json());

// Database connection
mongo_conn().catch((err) => console.log("Error Connecting to database ", err));

// Routes
app.use("/api/advertiser", advertiserRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/tourguide", tourGuideRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tourismgovernor", tourismGovernorRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/tourist", touristRoute);

// Root route for testing
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
