import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { IUser, User } from '../models/UserModel';
import { tokenService } from '../utils/TokenService';
import BadRequestError from '../errors/BadRequestError';
import { statusCodes } from '../utils/statusCodes';

class UserDto implements Omit<IUser, 'password'> {
    id: any;
    name: string;
    email: string;
    constructor(object: { _id: any, name: string, email: string }) {
        this.id = object._id;
        this.name = object.name;
        this.email = object.email;
    }
}

class UsersController {
    async createAccount(req: Request, res: Response, next: NextFunction) {
        try {
            // validate body | req.body or req.body.user (auth middleware)
            const { name, email, password }:
                { name: string, email: string, password: string } = req.body;
            const session = await mongoose.startSession();
            const transactionResults = await session.withTransaction(async () => {
                let user = await User.findOne({ email }).session(session);
                if (user) {
                    throw new BadRequestError("User with such email already exists.");
                }
                const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
                user = await new User<IUser>({ name, email, password: hashedPassword }).save({ session });
                const userDto = new UserDto(user);
                const tokens = tokenService.generateTokens(userDto);
                await tokenService.saveRefreshTokenToDb(userDto.id, tokens.refreshToken, session);
                tokenService.saveRefreshTokenToCookies(res, tokens.refreshToken);
                return { userDto, tokens };
            })
            const { userDto, tokens } = transactionResults;
            return res.status(statusCodes.Created).json({ userData: userDto, accessToken: tokens.accessToken });
        } catch (error) {
            next(error);
        }
    }
    async login(req: Request, res: Response) {

    }
}

export default new UsersController();