import express from 'express';
import {genrateOtp,resendOtp,TakeClass} from '../controllers/class.controller.js';

const router = express.Router();

router.post('/genrateOtp',genrateOtp);
router.post('/resendOtp',resendOtp);
router.post('/takeClass',TakeClass);

export default router;

