import mongoose from "mongoose";

interface ITokens {
    user: mongoose.Types.ObjectId;
    refreshTokens: [string];
}

const tokensSchema = new mongoose.Schema<ITokens>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    refreshTokens: { type: [String], required: true }
}, { versionKey: false })
export const Tokens = mongoose.model<ITokens>('Tokens', tokensSchema);