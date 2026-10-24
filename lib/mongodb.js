


import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const globalWithMongoose = globalThis;

const cached =
    globalWithMongoose.mongooseCache ??
    (globalWithMongoose.mongooseCache = {
        conn: null,
        promise: null,
    });

export async function connectDB() {
    if (!MONGODB_URI) {
        throw new Error(
            "MONGODB_URI is not configured. Database features are unavailable."
        );
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI);
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        cached.promise = null;
        throw error;
    }
}
