import express from 'express';
import {registerStudent,loginStudent,verifyStudent,getStudent,addClasses,getClasses,getPaymentHistory} from '../controllers/student.controller.js';
const router = express.Router();

router.post('/register',registerStudent);
router.post('/login',loginStudent);
router.get('/verify/:email',verifyStudent);
router.get('/:id',getStudent);
router.post('/addclass/:id',addClasses);
router.get('/classes/:id',getClasses);
router.get('/paymenthistory/:id',getPaymentHistory);


export default router;