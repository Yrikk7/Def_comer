const mongoose = require("mongoose")

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null }
}

async function connectDB() {

    if (cached.conn) {
        return cached.conn
    }

    cached.conn = await mongoose.connect(process.env.MONGO_URL)

    return cached.conn
}

module.exports = connectDB