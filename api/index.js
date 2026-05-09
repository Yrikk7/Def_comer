require('dotenv').config()

const express = require("express")
const path = require("path")
const connectDB = require("../db")
const authRouter = require("../authRouter")

const app = express()

connectDB().catch(console.error)

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "../views"))

app.use(express.static(path.join(__dirname, "../public")))

app.use(express.json())

app.use("/auth", authRouter)

module.exports = app