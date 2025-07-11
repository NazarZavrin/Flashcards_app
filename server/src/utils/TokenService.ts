import jwt from 'jsonwebtoken';
import express from 'express';
import BadRequestError from '../errors/BadRequestError';
import { ITokens, Tokens } from '../models/TokensModel';
import { ClientSession } from 'mongoose';
import { isUserDto } from '../controllers/usersController';

class TokenService {
    readonly accessTokenMaxAge: number = 5;// 5 seconds - for testing
    // readonly accessTokenMaxAge: number = 1;// 1 second - for testing
    // readonly accessTokenMaxAge: number = 30 * 60;// 30 minutes
    readonly refreshTokenMaxAge: number = 10;// 10 seconds - for testing
    // readonly refreshTokenMaxAge: number = 2;// 2 seconds - for testing
    // readonly refreshTokenMaxAge: number = 30 * 24 * 60 * 60;// 30 days
    generateTokens(payload: object) {
        const accessToken = jwt.sign({ ...payload }, process.env.JWT_ACCESS_SECRET, { expiresIn: this.accessTokenMaxAge });
        const refreshToken = jwt.sign({ ...payload }, process.env.JWT_REFRESH_SECRET, { expiresIn: this.refreshTokenMaxAge });
        return { accessToken, refreshToken };
    }
    validateAccessToken(accessToken: string) {
        try {
            // jwt.verify(...) as UserDto & jwt.JwtPayload? https://stackoverflow.com/questions/68024844/how-can-get-the-property-from-result-of-jwt-verify-method-that-was-already-cre
            const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
            if (!isUserDto(userData)) {
                throw new BadRequestError('userData in accessToken is not a valid UserDto');// make it be logged
            }
            return userData;
        } catch (error) {
            if (error instanceof BadRequestError) {
                throw error;
            } else {
                console.log('validateAccessToken error ', error);
            }
            return null;
        }
    }
    validateRefreshToken(refreshToken: string) {
        try {
            const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            if (!isUserDto(userData)) {
                throw new BadRequestError('userData in accessToken is not a valid UserDto');// make it be logged
            }
            return userData;
        } catch (error) {
            if (error instanceof BadRequestError) {
                throw error;
            } else {
                console.log('validateRefreshToken error ', error);
            }
            return null;
        }
    }
    async saveRefreshTokenToDb(userId: any, refreshToken: string, session?: ClientSession) {
        await Tokens.deleteMany({}, { session });
        /* updateOne does not run validation, so we have to run 
        it ourselves, for example with .validate() */
        await new Tokens<ITokens>({ user_id: userId, refresh_tokens: [refreshToken] }).validate();
        await Tokens.updateOne({ user_id: userId },
            { $push: { refresh_tokens: refreshToken }, $setOnInsert: { user_id: userId } },
            { upsert: true, session: session });
    }
    async findRefreshTokenInDb(refreshToken: string, session?: ClientSession) {
        const tokenData = await Tokens.findOne({ refresh_tokens: refreshToken }).session(session || null);
        return tokenData;
    }
    saveRefreshTokenToCookies(res: express.Response, refreshToken: string) {
        res.cookie('refreshToken', refreshToken, { maxAge: this.refreshTokenMaxAge * 1000, httpOnly: true });
    }
}

export const tokenService = new TokenService();