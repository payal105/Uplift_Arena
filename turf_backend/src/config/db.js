const mongoose = require("mongoose")

// Cache the connection across serverless invocations (Vercel/Lambda)
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    }

    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("MongoDB Connected")
        return mongoose
      })
      .catch((error) => {
        cached.promise = null
        console.error("MongoDB connection failed:", error.message)
        throw error
      })
  }

  try {
    cached.conn = await cached.promise
  } catch (error) {
    cached.promise = null
    throw error
  }

  return cached.conn
}

module.exports = connectDB
