import mongoose from "mongoose";
require("dotenv").config({ debug: false });

const dbConnect = async (dbName: string) => {
    try {
        if (process.env.NODE_ENV !== 'test') {
            console.log(`Connecting to MongoDB ${dbName}`);
        }
        const baseURL = process.env.MONGO_URI?.replace(/\/$/, '');
        if (!baseURL) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }
        const dbURL = `${baseURL}/${dbName}`;
        await mongoose.connect(dbURL);
        if (process.env.NODE_ENV !== 'test') {
            console.log("Connected to MongoDB");
        }
    } catch (error:any) {
        if (process.env.NODE_ENV !== 'test') {
            console.log("Error connecting to MongoDB", error);
        }
        throw new Error(error.message);
    }
}

export default dbConnect;