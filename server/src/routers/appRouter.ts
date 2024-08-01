import express from "express";
import usersRouter from "./usersRouter";
const appRouter = express.Router();

appRouter.use("/users", usersRouter);

export default appRouter;