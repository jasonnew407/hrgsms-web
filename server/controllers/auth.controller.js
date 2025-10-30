import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Guest from "../models/Guest.js";
import errorHandler from "../middleware/errorHandler.js";
import { sendVerificationEmail,sendPasswordResetEmail } from "../config/emailService.js";

const JWT_SECRET = process.env.JWT_SECRET || 'MyS3cr3tK3yForJWTs123!';

export const signup = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, address, idNumber,idType,dateOfBirth,nationality } = req.body;

    // Check if user already exists
    const existingUser = await Guest.findOne({ where: { email } });

    if (existingUser)
        return errorHandler(new Error('Email already taken'), req, res, next);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newGuest = await Guest.create({ first_name: firstName, last_name: lastName, email, phone, password: hashedPassword, address, id_number: idNumber, id_type: idType, date_of_birth: dateOfBirth, nationality, registered_at: new Date() });

    // Generate verification key and save user
    const verificationKey = generateVerificationKey();
    newGuest.verification_key = verificationKey;
    await newGuest.save();

    // Send verification email
    await sendVerificationEmail(email, firstName, lastName, verificationKey);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      userId: newGuest.id
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user
        const guest = await Guest.findOne({ where: { email } });

        if (!guest)
            return errorHandler(new Error('Invalid credentials'), req, res, next);

        // Check password
        const isMatch = await bcrypt.compare(password, guest.password);

        if (!isMatch)
            return errorHandler(new Error('Invalid credentials'), req, res, next);

        // Create JWT
        const token = jwt.sign({ id: guest.id, username: guest.username }, JWT_SECRET, { expiresIn: '1h' });

        // Store token in HTTP-only cookie
         res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

        res.json({ message: "Login successful", user: { id: guest.id, name: guest.name, email: guest.email } });
    } catch (error) {
        next(error);
    }
};

//generate a random verification key of length of 6 numbers
const generateVerificationKey = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

//verify email
export const verifyEmail = async (req, res, next) => {
    try {
        const { email, code } = req.body;

        // Find user by email
        const guest = await Guest.findOne({ where: { email: email} });

        if (!guest)
            return errorHandler(new Error('User not found'), req, res, next);

        if(guest.verification_key === null) 
            return errorHandler(new Error('Verification key is expired'), req, res, next);

        // Check verification key
        if (guest.verification_key !== code)
            return errorHandler(new Error('Invalid verification code'), req, res, next);

        if(guest.verification_key === code){
            //set verification key to null
            guest.verification_key = null;
        }

        // Update user to set email as verified
        guest.is_email_verified = true;

        await guest.save();

        res.status(200).json({
            success: true,
            message: 'Email verified successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const resendEmailVerification = async (req, res, next) => {
    try {
        const { email } = req.body;

        // Find user by email
        const guest = await Guest.findOne({ where: { email } });

        if (!guest)
            return errorHandler(new Error('User not found'), req, res, next);

        // Check if already verified
        if (guest.is_email_verified)
            return errorHandler(new Error('Email already verified'), req, res, next);
        
        // Generate new verification key and save to user
        const verificationKey = generateVerificationKey();
        guest.verification_key = verificationKey;
        await guest.save();

        // Resend verification email
        await sendVerificationEmail(email, guest.first_name, guest.last_name, verificationKey);
        res.status(200).json({
            success: true,
            message: 'Verification email resent successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    // Implementation for forgot password
    const guest = await Guest.findOne({ where: { email } });

    if (!guest) {
        return errorHandler(new Error('User not found'), req, res, next);
    }
    //Generate a verification key and save to user
    const verificationKey = generateVerificationKey();
    guest.verification_key = verificationKey;
    await guest.save();

    // Send password reset email
    await sendPasswordResetEmail(email, guest.first_name, guest.last_name, verificationKey);

    res.status(200).json({
        success: true,
        message: 'Password reset email sent successfully'
    });
}

export const resetPassword = async (req, res, next) => {
    const { email,  newPassword } = req.body;

    try {

        // Find user by email and verification key
        const guest = await Guest.findOne({ where: { email} });


        if (!guest) {
            return errorHandler(new Error('user not found'), req, res, next);
        }

        if(guest.is_email_verified === false) {
            return errorHandler(new Error('Email not verified'), req, res, next);
        }

        // Update user password
        guest.password = await bcrypt.hash(newPassword, 10);
        guest.verification_key = null;

        await guest.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        next(error);
    }
}

