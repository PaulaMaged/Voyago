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
import cors from "cors";

const app = express();
const port = process.env.PORT || 8000;

// Middleware setup
app.use(cors());
app.use(express.json());

// Database connection
mongo_conn().catch((err) => console.log("Error Connecting to database ", err));

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
