require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const authRouter = require("./routes/auth.router");
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

// routes
app.use("/auth", authRouter);

module.exports = app;
