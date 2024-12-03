import cron from 'node-cron';
import { createNotifications } from './controllers/NotificationController.js';

// Run every hour
cron.schedule('0 * * * *', async () => {
  console.log('Running notification checks...');
  await createNotifications();
}); 