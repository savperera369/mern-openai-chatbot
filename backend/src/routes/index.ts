import { Router } from "express";
import userRoutes from "./user-routes.js";
import chatRoutes from "./chat-routes.js";

const appRouter = Router();

// if request is made to user route
appRouter.use("/user", userRoutes); // domain/api/v1/users
appRouter.use("/chats", chatRoutes); // domain/api/v1/chats

export default appRouter;