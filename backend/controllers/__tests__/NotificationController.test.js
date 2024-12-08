import mongoose from 'mongoose';
import Notification from '../../models/Notification';
import ActivityBooking from '../../models/ActivityBooking';
import { createUpcomingActivityNotifications } from '../NotificationController';

jest.mock('../../models/Notification');
jest.mock('../../models/ActivityBooking');

describe('createUpcomingActivityNotifications', () => {
  beforeEach(() => {
    jest.useFakeTimers('modern');
    const currentDate = new Date('2024-03-20T12:00:00Z');
    jest.setSystemTime(currentDate);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should create notifications for upcoming activities within 24 hours', async () => {
    const futureDate = new Date('2024-03-21T11:00:00Z');  // 23 hours ahead

    const mockBookings = [
      {
        tourist: {
          user: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
        },
        activity: {
          name: 'Test Activity 1',
          start_date: futureDate,
        },
        active: true,
        attended: false,
      }
    ];

    // Add detailed logs
    console.log('Mock Bookings:', mockBookings);

    ActivityBooking.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockBookings),
    });

    const mockSave = jest.fn().mockResolvedValue(true);
    Notification.prototype.save = mockSave;

    await createUpcomingActivityNotifications();

    expect(ActivityBooking.find).toHaveBeenCalledWith({
      active: true,
      attended: false,
    });

    expect(Notification).toHaveBeenCalledTimes(1);
    expect(Notification).toHaveBeenCalledWith({
      recipient: mockBookings[0].tourist.user,
      type: 'NORMAL',
      message: `Reminder: Your activity "${mockBookings[0].activity.name}" is happening soon.`,
    });

    expect(mockSave).toHaveBeenCalledTimes(1);
  });

  // ... other test cases
}); 