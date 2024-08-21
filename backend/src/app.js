const express = require ("express");
const cors = require("cors");
const httpStatus = require("http-status");
const authRoute = require("./routes/auth.route");
const ApiError = require("./utils/apiError")
const app = express();


// parse json request body
app.use(express.json());

// parse json request body
app.use(express.urlencoded({extended: true}));

//enable cors
app.use(cors());
app.options("*", cors());

// Reroute all API request starting with "/v1" route

app.use("/v1/auth", authRoute);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

module.exports = app;


