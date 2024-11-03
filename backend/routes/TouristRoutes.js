// tourist.routes.js
import express from "express";
import TouristController from "../controllers/TouristController.js";
const router = express.Router();

router.post("/tourists", TouristController.createTourist);
router.get("/tourists/:id", TouristController.getTouristById);

// Receive loyalty points upon payment for any event/ itinerary
router.post("/tourists/:id/pay", TouristController.touristPay);

// Receive a badge based on my level and Redeem my points to cash in my wallet
router.put("/tourists/:id/redeem", TouristController.redeemPoints);

// Rate a product that I purchased
router.post("/tourists/:id/rate", TouristController.rateProduct);

export default router;
