import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import errorHandler from "../middleware/errorHandler.js";
import { sendVerificationEmail,sendPasswordResetEmail } from "../config/emailService.js";
import UserRole from "../models/UserRole.js";
import Hotel from "../models/Hotel.js";

const JWT_SECRET = process.env.JWT_SECRET || 'MyS3cr3tK3yForJWTs123!';

export const signup = async (req, res, next) => {
  try {
    const { hotelid, roleid, username,firstName, lastName, email, phone, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser)
        return errorHandler(new Error('Email already taken'), req, res, next);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({ hotel_id: hotelid, role_id: roleid, username, first_name: firstName, last_name: lastName, email, phone, password_hash: hashedPassword, is_email_verified: false });

    // Generate verification key and save user
    const verificationKey = generateVerificationKey();
    newUser.verification_key = verificationKey;
    await newUser.save();

    // Send verification email
    await sendVerificationEmail(email, firstName, lastName, verificationKey);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      userId: newUser.id
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ 
            where: { email },
            attributes: { include: ['password_hash'] },
            include: [
                {
                    model: UserRole, // Include Role model
                    as: 'role',
                    attributes: ['role_id', 'role_name']
                },
                {
                    model: Hotel, // Include Branch model
                    as: 'hotel',
                    attributes: ['hotel_id', 'hotel_name']
                }
            ]
        });

        if (!user)
            return errorHandler(new Error('Invalid credentials'), req, res, next);

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch)
            return errorHandler(new Error('Invalid credentials'), req, res, next);

        // Create JWT
        const token = jwt.sign({ id: user.user_id, username: user.email, role: user.role?.role_name }, JWT_SECRET, { expiresIn: '1h' });

        // Store token in HTTP-only cookie
         res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

        res.json({ message: "Login successful", user: { id: user.user_id, name: user.name, email: user.email, role: user.role?.role_name, roleId: user.role?.role_id } });
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

        // Find user by verification key
        const user = await User.findOne({ where: { email: email, verification_key: code } });

        if (!user)
            return errorHandler(new Error('Invalid verification token'), req, res, next);

        // Update user to set email as verified
        user.is_email_verified = true;

        await user.save();

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
        const user = await User.findOne({ where: { email } });

        if (!user)
            return errorHandler(new Error('User not found'), req, res, next);

        // Check if already verified
        if (user.is_email_verified)
            return errorHandler(new Error('Email already verified'), req, res, next);
        
        //fetch the existing verification key
        const verificationKey = user.verification_key;

        // Resend verification email
        await sendVerificationEmail(email, user.firstName, user.lastName, verificationKey);
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
    const user = await User.findOne({ where: { email } });

    if (!user) {
        return errorHandler(new Error('User not found'), req, res, next);
    }
    //Generate a verification key and save to user
    const verificationKey = generateVerificationKey();
    user.verification_key = verificationKey;
    await user.save();

    // Send password reset email
    await sendPasswordResetEmail(email, user.firstName, user.lastName, verificationKey);

    res.status(200).json({
        success: true,
        message: 'Password reset email sent successfully'
    });
}

export const resetPassword = async (req, res, next) => {
    const { email, code, newPassword } = req.body;

    try {
        // Find user by email and verification key
        const user = await User.findOne({ where: { email, verification_key: code } });

        if (!user) {
            return errorHandler(new Error('Invalid verification token'), req, res, next);
        }

        // Update user password
        user.password = await bcrypt.hash(newPassword, 10);
        user.verification_key = null;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        next(error);
    }
}


