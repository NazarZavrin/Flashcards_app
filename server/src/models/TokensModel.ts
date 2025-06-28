import mongoose from "mongoose";

export interface ITokens {
    user_id: mongoose.Types.ObjectId;
    refresh_tokens: [string];
}

const tokensSchema = new mongoose.Schema<ITokens>({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    refresh_tokens: { type: [String], required: true }
}, { versionKey: false })
export const Tokens = mongoose.model<ITokens>('Tokens', tokensSchema);