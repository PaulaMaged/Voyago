import mongoose from 'mongoose';
import {
  getBookingHistory,
  getUpcomingBookings,
  // Import other necessary controller functions if needed
} from '../TouristController'; // Adjust the path if necessary
import ActivityBooking from '../../models/ActivityBooking';
import ItineraryBooking from '../../models/ItineraryBooking';
import Activity from '../../models/Activity';
import Itinerary from '../../models/Itinerary';
import Tourist from '../../models/Tourist';
import User from '../../models/User'; // Assuming there's a User model

// Mock data
const mockUserId = new mongoose.Types.ObjectId();
const mockTouristId = new mongoose.Types.ObjectId();
const mockActivityId = new mongoose.Types.ObjectId();
const mockItineraryId = new mongoose.Types.ObjectId();

// Helper function to create a mock request and response
const createMockRequest = (params = {}, body = {}) => ({
  params,
  body,
});

const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Booking Functions', () => {
  // Seed the database with a mock user and tourist before each test
  beforeEach(async () => {
    // Create a mock user
    const user = new User({
      _id: mockUserId,
      name: 'Test User',
      email: 'testuser@example.com',
      // Add other necessary fields as per your User schema
    });
    await user.save();

    // Create a mock tourist associated with the mock user
    const tourist = new Tourist({
      _id: mockTouristId,
      user: mockUserId, // Associate the tourist with the mock user
      wallet: 1000,
      points: 5000,
      level: 1,
      badges: [],
      // Add other necessary fields as per your Tourist schema
    });
    await tourist.save();

    // Create mock activities and itineraries
    const activity = new Activity({
      _id: mockActivityId,
      title: 'Test Activity',
      description: 'A test activity',
      advertiser: new mongoose.Types.ObjectId(),
      start_time: new Date(Date.now() + 1000 * 60 * 60 * 24), // Tomorrow
      duration: 60,
      price: 100,
      category: new mongoose.Types.ObjectId(),
      location: new mongoose.Types.ObjectId(),
      // Add other necessary fields as per your Activity schema
    });
    await activity.save();

    const itinerary = new Itinerary({
      _id: mockItineraryId,
      tour_guide: new mongoose.Types.ObjectId(),
      name: 'Test Itinerary',
      description: 'A test itinerary',
      language: 'English',
      price: 200,
      activities: [mockActivityId],
      accessibility: true,
      active: true,
      pick_up: new mongoose.Types.ObjectId(),
      drop_off: new mongoose.Types.ObjectId(),
      start_date: new Date(Date.now() + 1000 * 60 * 60 * 24), // Tomorrow
      start_time: '09:00',
      // Add other necessary fields as per your Itinerary schema
    });
    await itinerary.save();
  });

  describe('getBookingHistory', () => {
    it('should return past bookings in descending order', async () => {
      // Create past bookings
      const pastDate1 = new Date(Date.now() - 1000 * 60 * 60 * 24 * 5); // 5 days ago
      const pastDate2 = new Date(Date.now() - 1000 * 60 * 60 * 24 * 3); // 3 days ago

      await ActivityBooking.create([
        {
          activity: mockActivityId,
          tourist: mockTouristId,
          attended: true,
          active: false,
          booking_date: pastDate1,
        },
        {
          activity: mockActivityId,
          tourist: mockTouristId,
          attended: true,
          active: false,
          booking_date: pastDate2,
        },
      ]);

      const req = createMockRequest({ touristId: mockTouristId.toHexString() });
      const res = createMockResponse();

      await getBookingHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ booking_date: pastDate2 }),
        expect.objectContaining({ booking_date: pastDate1 }),
      ]));

      // Optionally, check the order
      const bookings = res.json.mock.calls[0][0];
      expect(new Date(bookings[0].booking_date)).toBeGreaterThan(new Date(bookings[1].booking_date));
    });

    it('should return empty array when no past bookings exist', async () => {
      const req = createMockRequest({ touristId: mockTouristId.toHexString() });
      const res = createMockResponse();

      await getBookingHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('getUpcomingBookings', () => {
    it('should return future bookings in ascending order', async () => {
      // Create future bookings
      const futureDate1 = new Date(Date.now() + 1000 * 60 * 60 * 24 * 2); // 2 days from now
      const futureDate2 = new Date(Date.now() + 1000 * 60 * 60 * 24 * 4); // 4 days from now

      await ActivityBooking.create([
        {
          activity: mockActivityId,
          tourist: mockTouristId,
          attended: false,
          active: true,
          booking_date: futureDate1,
        },
        {
          activity: mockActivityId,
          tourist: mockTouristId,
          attended: false,
          active: true,
          booking_date: futureDate2,
        },
      ]);

      const req = createMockRequest({ touristId: mockTouristId.toHexString() });
      const res = createMockResponse();

      await getUpcomingBookings(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        activities: expect.arrayContaining([
          expect.objectContaining({ booking_date: futureDate1 }),
          expect.objectContaining({ booking_date: futureDate2 }),
        ]),
        itineraries: expect.arrayContaining([]),
      });

      // Optionally, check the order
      const responseData = res.json.mock.calls[0][0];
      const { activities } = responseData;
      expect(new Date(activities[0].booking_date)).toBeLessThan(new Date(activities[1].booking_date));
    });

    it('should return empty array when no upcoming bookings exist', async () => {
      const req = createMockRequest({ touristId: mockTouristId.toHexString() });
      const res = createMockResponse();

      await getUpcomingBookings(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        activities: [],
        itineraries: [],
      });
    });

    it('should not include bookings from current date', async () => {
      // Create a booking with the current date
      const currentDate = new Date();

      await ActivityBooking.create([
        {
          activity: mockActivityId,
          tourist: mockTouristId,
          attended: false,
          active: true,
          booking_date: currentDate,
        },
      ]);

      const req = createMockRequest({ touristId: mockTouristId.toHexString() });
      const res = createMockResponse();

      await getUpcomingBookings(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        activities: [],
        itineraries: [],
      });
    });
  });
});