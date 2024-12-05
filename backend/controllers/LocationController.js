import Location from '../models/Location.js';

const LocationController = {
  createOrGetLocation: async (req, res) => {
    try {
      const { latitude, longitude } = req.body;

      // Validate coordinates
      if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return res.status(400).json({ 
          message: 'Invalid coordinates. Latitude and longitude must be numbers.' 
        });
      }

      // Look for existing location within small radius (approximately 10 meters)
      const existingLocation = await Location.findOne({
        latitude: { $gte: latitude - 0.0001, $lte: latitude + 0.0001 },
        longitude: { $gte: longitude - 0.0001, $lte: longitude + 0.0001 }
      });

      if (existingLocation) {
        return res.status(200).json({ 
          locationId: existingLocation._id,
          message: 'Existing location found'
        });
      }

      // Create new location if none exists
      const newLocation = await Location.create({ latitude, longitude });
      
      res.status(201).json({ 
        locationId: newLocation._id,
        message: 'New location created'
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getLocation: async (req, res) => {
    try {
      const location = await Location.findById(req.params.locationId);
      if (!location) {
        return res.status(404).json({ message: 'Location not found' });
      }
      res.status(200).json(location);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export default LocationController; 