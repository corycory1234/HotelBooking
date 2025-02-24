import { Router } from 'express';
import authRoutes from './auth';
import hotelRoutes from './hotels';
import bookingRoutes from './bookings';
import reviewRoutes from './reviews';
import roomRoutes from './rooms';
import favoriteRoutes from './favorites';
import 'dotenv/config';

const router = Router();

router.use('/auth', authRoutes);
router.use('/hotels', hotelRoutes);
router.use('/bookings', bookingRoutes);
router.use('/reviews', reviewRoutes);
router.use('/rooms', roomRoutes);
router.use('/favorites', favoriteRoutes);

export default router;