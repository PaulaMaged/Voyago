import express from "express";
const router = express.Router();
import TouristController from "../controllers/TouristController.js";

//create Tourist 
router.post("/tourists", TouristController.createTourist);

// read tourist by id
router.get("/tourists/:id", TouristController.getTouristById);


export default router;