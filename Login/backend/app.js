const express = require("express");
const connectToDb = require("./db/db");
const dotenv = require("dotenv")
dotenv.config();
const cors = require("cors");
const app = express();
const authRoutes = require("./router/authRoutes");


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// connectToDb();

app.use("/",authRoutes);
app.use("/",(req,res) => {
    console.log("Home");
})

module.exports = app;