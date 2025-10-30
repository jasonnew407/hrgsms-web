import express from 'express';
import { signup, signin, verifyEmail, resendEmailVerification, forgotPassword, resetPassword} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendEmailVerification);
router.post('/forgot-Password', forgotPassword);
router.post('/reset-password', resetPassword);


export default router;