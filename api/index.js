require('dotenv').config()
const express = require("express")
const path = require("path")
const connectDB = require("../db")
const authRouter = require("../authRouter")

const app = express()

// подключение БД
connectDB().catch(console.error)

// EJS
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "../views"))

// STATIC
app.use(express.static(path.join(__dirname, "../public")))

// JSON
app.use(express.json())

// ROUTES
app.use("/auth", authRouter)

module.exports = app