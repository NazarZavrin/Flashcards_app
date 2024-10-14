import jwt from 'jsonwebtoken';
import express from 'express';
import BadRequestError from '../errors/BadRequestError';
import { Tokens } from '../models/TokensModel';
import { ClientSession } from 'mongoose';

class TokenService {
    // readonly accessTokenMaxAge: number = 15;// 15 seconds - for testing
    readonly accessTokenMaxAge: number = 30 * 60;// 30 minutes
    // readonly refreshTokenMaxAge: number = 30;// 30 seconds - for testing
    readonly refreshTokenMaxAge: number = 30 * 24 * 60 * 60;// 30 days
    generateTokens(payload: object) {
        const accessToken = jwt.sign({ ...payload }, process.env.JWT_ACCESS_SECRET, { expiresIn: this.accessTokenMaxAge });
        const refreshToken = jwt.sign({ ...payload }, process.env.JWT_REFRESH_SECRET, { expiresIn: this.refreshTokenMaxAge });
        return { accessToken, refreshToken };
    }
    validateAccessToken(accessToken: string) {
        try {
            // jwt.verify(...) as UserDto & jwt.JwtPayload? https://stackoverflow.com/questions/68024844/how-can-get-the-property-from-result-of-jwt-verify-method-that-was-already-cre
            const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
            if (typeof userData === 'string') {
                throw new BadRequestError("jwt.verify() returned string while validated access token.");
            }
            return userData;
        } catch (error) {
            console.log("validateAccessToken error", error);
            if (error instanceof BadRequestError) {
                throw error;
            }
            return null;
        }
    }
    validateRefreshToken(refreshToken: string) {
        try {
            const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (error) {
            return null;
        }
    }
    async saveRefreshTokenToDb(userId: any, refreshToken: string, session?: ClientSession) {
        await Tokens.deleteMany({});
        
        await Tokens.updateOne({ user: userId },
            { $push: { refreshTokens: refreshToken }, $setOnInsert: { user: userId } },
            { upsert: true, session: session });
    }
    saveRefreshTokenToCookies(res: express.Response, refreshToken: string) {
        res.cookie('refreshToken', refreshToken, { maxAge: this.refreshTokenMaxAge * 1000, httpOnly: true });
    }
}

export const tokenService = new TokenService();