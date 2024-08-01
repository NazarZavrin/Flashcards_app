import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { IUser, User } from '../models/UserModel';
import BadRequestError from '../errors/BadRequestError';
import { tokenService } from '../utils/TokenService';

class usersController {
    async createAccount(req: Request, res: Response) {
        // validate body | req.body or req.body.user (auth middleware)
        const { name, email, password }:
            { name: string, email: string, password: string } = req.body;
        // service
        let user = await User.findOne({ email });
        if (user) {
            throw new BadRequestError("User with such email already exists.");
        }
        const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
        user = await User.create<IUser>({ name, email, password: hashedPassword });
        const tokens = tokenService.generateTokens(user);
        // await tokenService.saveToken(userDto.id, tokens.refreshToken);
        // service return {...tokens, user: userDto}
        
        const userData = { name: "Bob" }
        res.cookie('refreshToken', userData, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        return res.json(userData);
        // refreshToken - tokenService.refreshToken, 2 userData.refreshToken, maxAge in tokenService
    }
    async login(req: Request, res: Response) {

    }
}