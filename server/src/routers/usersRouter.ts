import express from "express";
import usersController from "../controllers/usersController";

export const usersRouter = express.Router();

usersRouter.post("/create-account", usersController.createAccount);
usersRouter.propfind("/login", usersController.login);

export default usersRouter;