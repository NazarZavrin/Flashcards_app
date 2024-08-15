import mongoose from "mongoose";

export async function connectToMongoDB() {
    const DB_USER = process.env.DB_USER;
    const DB_PASSWORD = process.env.DB_PASSWORD;
    const DB_NAME = process.env.DB_NAME;
    
    const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@flashcards-app.kx6uyut.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Flashcards-app`;
    
    try {
        await mongoose.connect(uri);
        return "Successfully connected to MongoDB.";
    } catch (error) {
        console.error(error);
        await mongoose.disconnect();
        return "Failed to connect to MongoDB.";
    }
}