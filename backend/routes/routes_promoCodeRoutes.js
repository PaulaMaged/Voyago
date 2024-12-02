import express from "express";
const router = express.Router();

import promoCodeController from "../controllers/controllers_promoCodeController.js";
import { sendNotificationEmail } from "../controllers/mailer.js";

// Create a new promo code
router.post("/", promoCodeController.createPromoCode);

router.post("/send-promo-code", async (req, res) => {
  const { promoCodeId, userIds } = req.body;
  const message =
    "Hello you have received a promo code from Voyago \n" +
    "Use this code to get discount off on your next trip \n" +
    "Promo code: " +
    promoCodeId;

  await sendNotificationEmail("Number1bos@hotmail.com", message);

  try {
    res.status(200).json({ message: "Promo code sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending promo code" });
  }
});

// Get all promo codes
router.get("/", promoCodeController.getAllPromoCodes);

// Get a single promo code by ID
router.get("/:id", promoCodeController.getPromoCodeById);

// Update a promo code
router.put("/:id", promoCodeController.updatePromoCode);

// Delete a promo code
router.delete("/:id", promoCodeController.deletePromoCode);

export default router;
