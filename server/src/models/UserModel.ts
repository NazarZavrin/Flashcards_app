import mongoose from "mongoose";

const emailRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9.-]+$/;

export interface IUser {
    name: string,
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true,
        minlength: [3, 'Name must not be shorter than 3 characters'],
        maxlength: [50, 'Name must not be longer than 50 characters']
    },
    email: {
        type: String,
        match: [emailRegex, 'Incorrect format of the email'],
        required: true,
        minlength: [5, 'Email must not be shorter than 5 characters'],
        maxlength: [50, 'Email must not be longer than 50 characters']
    },
    password: {
        type: String,
        required: true,
        minlength: [60, 'Hashed password must not be shorter than 60 characters'],
        maxlength: [60, 'Hashed password must not be longer than 60 characters'],
        select: false
    }
}, { versionKey: false, timestamps: true })
export const User = mongoose.model<IUser>('User', userSchema);

// required: true, ref, select: false | id: false, versionKey: false, timestamps: true (for User)