import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import { configureOpenAI } from "../config/openai-config.js";
import { OpenAIApi, ChatCompletionRequestMessage } from "openai";

export const generateChatCompletion = async (req: Request, res: Response, next: NextFunction) => {
    // get message from the user
    const { message } = req.body;
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) return res.status(401).json({ message: "User not registered or token is malformed" });
        
        // grab previous chats of user, send all chats along with new one to openai, get latest response
        const chats = user.chats.map(({ role, content }) => ({ role, content })) as ChatCompletionRequestMessage[];
        chats.push({ role: 'user', content: message });
        user.chats.push({ role: 'user', content: message });

        const config = configureOpenAI();
        // grab open ai api
        const openai = new OpenAIApi(config);
        const chatResponse = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: chats
        });

        user.chats.push(chatResponse.data.choices[0].message);
        await user.save();
        
        return res.status(200).json({ chats: user.chats });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const getAllChats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered or token malfunctioned.");
        }

        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }

        return res.status(200).json({ message: "Ok", chats: user.chats });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error getting all chats" });
    }
}

export const deleteAllChats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered or token malformed");
        }

        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match!");
        }

        // @ts-ignore
        user.chats = [];
        await user.save();

        return res.status(200).json({ message: "Deleted all chats", chats: user.chats });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error deleting all chats" });
    }
}