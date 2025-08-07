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
                throw new BadRequestError('userData in accessToken is not a valid UserDto', { logging: true });
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
        // may throw BadRequestError
        try {
            const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            if (!isUserDto(userData)) { // check logging: true
                throw new BadRequestError('userData in refreshToken is not a valid UserDto', { logging: true });
            }
            return userData;
        } catch (error) {
            if (error instanceof BadRequestError) {
                throw error;
            } else if (error instanceof jwt.TokenExpiredError === false) {
                console.log('validateRefreshToken error ', error);
            }
            return null;
        }
    }
    async saveRefreshTokenToDb(userId: any, refreshToken: string, session?: ClientSession) {
        /* updateOne does not run validation, so we have to run 
        it ourselves, for example with .validate() */
        await new Tokens<ITokens>({ user_id: userId, refresh_tokens: [refreshToken] }).validate();
        const userDoc = await Tokens.findOneAndUpdate({ user_id: userId },
            { $push: { refresh_tokens: refreshToken }, $setOnInsert: { user_id: userId } },
            { upsert: true, returnDocument: 'after', session: session }).lean();
        // asyncronous call below
        this.removeInvalidRefreshTokensFromDb(userId, userDoc?.refresh_tokens);
    }
    async removeInvalidRefreshTokensFromDb(userId: any, refreshTokens: string[]) {
        // without ClientSession - independent db requests
        if (typeof refreshTokens === 'undefined' || !Array.isArray(refreshTokens)) {
            const userDoc = await Tokens.findOne({ user_id: userId });
            if (userDoc instanceof Object && 'refresh_tokens' in userDoc) {
                refreshTokens = userDoc.refresh_tokens;
            }
        }
        const refreshTokensNumber = refreshTokens.length;
        refreshTokens = refreshTokens.filter((refreshToken, index) => {
            try {
                return this.validateRefreshToken(refreshToken) === null ? false : true;
            } catch (error) {
                console.log(new Date().toISOString(), error instanceof Error ? error.message : error, `userId: ${userId}, refreshTokenIndex: ${index}`);
                return true; // keep invalid refreshToken in db to figure out why it is invalid
            }
        });
        if (refreshTokens.length === 0) {
            console.log(new Date().toISOString(), `All refresh tokens were found invalid, userId: ${userId}`);
            return;
        } else if (refreshTokens.length === refreshTokensNumber) {
            return;
        }
        await Tokens.updateOne({ user_id: userId }, { $set: { refresh_tokens: refreshTokens } });
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