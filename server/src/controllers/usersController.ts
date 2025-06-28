import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { IUser, User } from '../models/UserModel';
import { tokenService } from '../utils/TokenService';
import BadRequestError from '../errors/BadRequestError';
import { statusCodes } from '../utils/statusCodes';
import Validator from '../utils/Validator';

class UserDto implements Omit<IUser, 'password'> {
    // id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    constructor(object: { _id?: mongoose.Types.ObjectId, name?: string, email?: string }) {
        if (!object.name || !object.email) {
            throw new BadRequestError("UserDto constructor requires name and email properties");
        }
        // this.id = object._id;
        this.name = object.name;
        this.email = object.email;
    }
}

class UsersController {
    async createAccount(req: Request, res: Response, next: NextFunction) {
        const session = await mongoose.startSession();
        try {
            const { name, email, password }:
                { name: string, email: string, password: string } = req.body;
            const errorMessage = password ? Validator.validatePassword(password) : 'req.password contains falsy value';
            if (errorMessage.length > 0) {
                throw new BadRequestError(errorMessage);
            }
            const transactionResults = await session.withTransaction(async () => {
                // await User.deleteMany({}, { session });

                let user = await User.findOne({ email }).session(session);
                if (user) {
                    throw new BadRequestError("User with such email already exists");
                }
                const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
                user = await new User<IUser>({ name, email, password: hashedPassword }).save({ session });
                const userDto = new UserDto(user);
                const tokens = tokenService.generateTokens(userDto);
                await tokenService.saveRefreshTokenToDb(user.id, tokens.refreshToken, session);
                tokenService.saveRefreshTokenToCookies(res, tokens.refreshToken);
                return { userData: userDto, accessToken: tokens.accessToken };
            })
            await session.endSession();
            return res.status(statusCodes.Created).json(transactionResults);
        } catch (error) {
            await session.endSession();
            next(error);
        }
    }
    async login(req: Request, res: Response, next: NextFunction) {
        const session = await mongoose.startSession();
        try {
            const { email, password }:
                { email: string, password: string } = req.body;
            const transactionResults = await session.withTransaction(async () => {
                const user = await User.findOne({ email }).select({ name: 1, email: 1, password: 1 }).session(session);
                if (!user) {
                    throw new BadRequestError("User with such email does not exist");
                }
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    throw new BadRequestError("Wrong password");
                }
                const userDto = new UserDto(user);
                const tokens = tokenService.generateTokens(userDto);
                await tokenService.saveRefreshTokenToDb(user.id, tokens.refreshToken, session);
                tokenService.saveRefreshTokenToCookies(res, tokens.refreshToken);
                return { userData: userDto, accessToken: tokens.accessToken };
            })
            await session.endSession();
            return res.status(statusCodes.OK).json(transactionResults);
        } catch (error) {
            await session.endSession();
            next(error);
        }
    }
}

export default new UsersController();