import express from 'express';
import { signup, signin, verifyEmail, } from '../controllers/user.auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/verify-email', verifyEmail);

export default router;
