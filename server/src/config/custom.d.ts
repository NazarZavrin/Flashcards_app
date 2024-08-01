// import { IUser } from "../models/UserModel";

declare global {
    namespace Express {
        interface Request {
            user?: jwt.JwtPayload;// IUser
        }
    }
}
export {}
// This file has import statement (line 1)
// so it is considered a module 
// (we don't have to add an empty export statement).