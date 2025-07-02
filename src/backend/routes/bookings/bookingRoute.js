import express from 'express';
import {
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingsByUserId,
  deleteBookingById,
} from '../../controllers/bookingController.js';

const router = express.Router();

router.post('/', createBooking);
router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.get('/user/:userId', getBookingsByUserId); // <-- ✅ Add this line
router.delete('/:id', deleteBookingById);

export default router;
