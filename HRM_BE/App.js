const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const cors = require('cors');
const routes = require("./Routes/index");


app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());


app.use(cors({
    origin: '*',
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'], 
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
}));

app.use("/api",routes);

// app.use(Middleware);

module.exports = app;