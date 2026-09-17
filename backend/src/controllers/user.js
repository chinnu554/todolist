import User from "../models/user.js";
import { userSchema } from "../validators/user.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


const jwtSecret = process.env.JWT_SECRET;

const createToken = (user) => jwt.sign(
    { userId: user._id.toString(), username: user.username },
    jwtSecret,
    { expiresIn: "7d" }
);

export const register = async (req, res, next) => {
    try {
        const userValidation = userSchema.safeParse(req.body);
        if (!userValidation.success) {
            const error = new Error(userValidation.error.issues[0].message);
            error.statusCode = 400;
            throw error;
        }
        const { username, password } = userValidation.data;
        const checkUser = await User.findOne({ username });
        if (checkUser) {
            const error = new Error("User already exists");
            error.statusCode = 400;
            throw error;
        }
        const hashedPassword = await hashPassword(password);
        await User.create({ username, password: hashedPassword });
        res.status(201).json({ message: "User created successfully", success: true });
    }
    catch (err) {
        next(err);
    }
}

export const login = async (req, res, next) => {
    try {
        const userValidation = userSchema.safeParse(req.body);
        if (!userValidation.success) {
            const error = new Error(userValidation.error.issues[0].message);
            error.statusCode = 400;
            throw error;
        }
        const { username, password } = userValidation.data;
        const checkUser = await User.findOne({ username });
        if (!checkUser) {
            const error = new Error("Invalid username or password");
            error.statusCode = 401;
            throw error;
        }
        const isPasswordValid = await comparePassword(password, checkUser.password);
        if (!isPasswordValid) {
            const error = new Error("Invalid username or password");
            error.statusCode = 401;
            throw error;
        }
        const token = createToken(checkUser);
        res.status(200).json({ message: "User logged in successfully", success: true, token, user: { id: checkUser._id, username: checkUser.username } });
    }
    catch (err) {
        next(err);
    }
}

export const me = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId)
            .select("-password -passwordHash -refreshToken");
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ success: true, data: { user } });
    }
    catch (err) {
        next(err);
    }
};