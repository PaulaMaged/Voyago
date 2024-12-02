import PromoCode from "../models/PromoCode.js";

// Create a new promo code
const createPromoCode = async (req, res) => {
  try {
    const { code, discount, expirationDate } = req.body;

    // Validate input
    if (!code || !discount || !expirationDate) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Check if promo code already exists
    const existingPromoCode = await PromoCode.findOne({ code });
    if (existingPromoCode) {
      return res.status(400).json({ message: "Promo code already exists" });
    }

    // Create new promo code
    const newPromoCode = new PromoCode({
      code,
      discount,
      expirationDate: new Date(expirationDate),
    });

    // Save promo code
    await newPromoCode.save();

    res.status(201).json({
      message: "Promo code created successfully",
      promoCode: newPromoCode,
    });
  } catch (error) {
    console.error("Error creating promo code:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all promo codes
const getAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find().sort({ createdAt: -1 });
    res.status(200).json(promoCodes);
  } catch (error) {
    console.error("Error fetching promo codes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single promo code by ID
const getPromoCodeById = async (req, res) => {
  try {
    const promoCode = await PromoCode.findById(req.params.id);
    if (!promoCode) {
      return res.status(404).json({ message: "Promo code not found" });
    }
    res.status(200).json(promoCode);
  } catch (error) {
    console.error("Error fetching promo code:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a promo code
const updatePromoCode = async (req, res) => {
  try {
    const { code, discount, expirationDate, isActive } = req.body;
    const promoCode = await PromoCode.findById(req.params.id);

    if (!promoCode) {
      return res.status(404).json({ message: "Promo code not found" });
    }

    // Update fields
    if (code) promoCode.code = code;
    if (discount) promoCode.discount = discount;
    if (expirationDate) promoCode.expirationDate = new Date(expirationDate);
    if (isActive !== undefined) promoCode.isActive = isActive;

    await promoCode.save();

    res
      .status(200)
      .json({ message: "Promo code updated successfully", promoCode });
  } catch (error) {
    console.error("Error updating promo code:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a promo code
const deletePromoCode = async (req, res) => {
  try {
    const promoCode = await PromoCode.findById(req.params.id);

    if (!promoCode) {
      return res.status(404).json({ message: "Promo code not found" });
    }

    await promoCode.remove();

    res.status(200).json({ message: "Promo code deleted successfully" });
  } catch (error) {
    console.error("Error deleting promo code:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default {
  createPromoCode,
  getAllPromoCodes,
  getPromoCodeById,
  updatePromoCode,
  deletePromoCode,
};
