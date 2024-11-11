import express from "express";
const router = express.Router();
import thirdParty from '../third_party/hotelController'


router.post('/hotel/search', thirdParty.searchHotel);
router.post('/hotel/book', thirdParty.bookHotel);