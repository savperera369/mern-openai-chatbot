import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import { hash, compare } from 'bcrypt';
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    // get all users from db
    try {
        const users = await User.find();

        return res.status(200).json({ message: "OK", users });
    } catch (error) {
        console.log("error getting all users");
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
}

export const userSignup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;
        // make sure this user doesnt already exist in database
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(401).send('User already exists');
    
        const hashedPassword = await hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        // save user to db
        await user.save();

        // send user token in form of cookies
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);

        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            signed: true,
            domain: "localhost",
            path: "/"
        });

        const token = createToken(user._id.toString(), user.email, "7d");

        res.cookie(COOKIE_NAME, token, {
            expires,
            domain: "localhost",
            path: "/",
            httpOnly: true,
            signed: true
        });

        return res.status(201).json({ message: "OK", name: user.name, email: user.email });
    } catch (error) {
        console.log("error signing up user");
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
}

export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // user login
        const { email, password } = req.body;
        // find user with this email in the db
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send("User not registered");
        }

        const isPasswordCorrect = await compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(403).send("Password is incorrect");
        }

        const expires = new Date();
        expires.setDate(expires.getDate() + 7);

        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/"
        });

        const token = createToken(user._id.toString(), user.email, "7d");
        // send the token in the form of cookies
        // cookie-parser sends cookies from backend to frontend
        // create cookie in the browswer which stores the token

        res.cookie(COOKIE_NAME, token, { 
            path: "/", 
            domain: "localhost", 
            expires,
            httpOnly: true,
            signed: true
        });

        return res.status(200).json({ message: "OK", name: user.name, email: user.email });
    } catch (error) {
        console.log("error logging in user");
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
}

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("Token not received or user not found");
        }

        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Token and user id do not match");
        }

        return res.status(200).json({ message: "OK", name: user.name, email: user.email });
    } catch (error) {
        console.log(error);
    }
}

export const userLogout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not found or token malformed");
        }

        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didnt match");
        }

        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/"
        });

        return res.status(200).json({ message: "Logged out user" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error logging out user" });
    }
}