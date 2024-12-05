import express from 'express';
import LocationController from '../controllers/LocationController.js';

const router = express.Router();

router.post('/reference', LocationController.createOrGetLocation);
router.get('/:locationId', LocationController.getLocation);

export default router; 