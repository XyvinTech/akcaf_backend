require("dotenv").config();
const express = require("express");
const cors = require("cors");
const volleyball = require("volleyball");
const clc = require("cli-color");
const admin = require("firebase-admin");
const { serviceAccount } = require("./src/config/firebase");
const responseHandler = require("./src/helpers/responseHandler");
const adminRoute = require("./src/routes/admin");
const collegeRoute = require("./src/routes/college");
const {
  swaggerUi,
  swaggerSpec,
  swaggerOptions,
} = require("./src/swagger/swagger");
const roleRoute = require("./src/routes/role");
const newsRoute = require("./src/routes/news");
const userRoute = require("./src/routes/user");
const eventRoute = require("./src/routes/event");
const promotionRoute = require("./src/routes/promotion");
const feedsRoute = require("./src/routes/feeds");
const { app, server } = require("./src/socket");
const courseRoute = require("./src/routes/course");
const notificationRoute = require("./src/routes/notification");
const chatRoute = require("./src/routes/chat");
const paymentRoute = require("./src/routes/payment");
const reportRoute = require("./src/routes/report");
const rateLimit = require("express-rate-limit");

app.use(express.static("views"));

app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/views/success.html");
});

app.get("/cancel", (req, res) => {
  res.sendFile(__dirname + "/views/cancel.html");
});

app.use(volleyball);

//* Define the PORT & API version based on environment variable
const { PORT, API_VERSION, NODE_ENV } = process.env;

//* Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.BUCKET_URL,
});

//* Enable Cross-Origin Resource Sharing (CORS) middleware
app.use(cors());
//* Parse JSON request bodies
app.use(express.json());

//* Configure Rate Limiting
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //* 15 minutes
  max: 100, //* Limit each IP to 100 requests per windowMs
  message: {
    status: 429,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true, // *Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, //* Disable the `X-RateLimit-*` headers
});

//* Set the base path for API routes
const BASE_PATH = `/api/${API_VERSION}`;

//* Import database connection module
require("./src/helpers/connection");

//* Apply the rate limiter to all API routes
app.use(`${BASE_PATH}`, apiRateLimiter);

//? Define a route for the API root
app.get(BASE_PATH, (req, res) => {
  return responseHandler(
    res,
    200,
    "🛡️ Welcome! All endpoints are fortified. Do you possess the master 🗝️?"
  );
});

//* Start the cron job
require("./src/jobs");

//* Swagger setup
app.use(
  `${BASE_PATH}/api-docs`,
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerOptions)
);

//* Configure routes for user API
app.use(`${BASE_PATH}/admin`, adminRoute);
app.use(`${BASE_PATH}/college`, collegeRoute);
app.use(`${BASE_PATH}/role`, roleRoute);
app.use(`${BASE_PATH}/user`, userRoute);
app.use(`${BASE_PATH}/event`, eventRoute);
app.use(`${BASE_PATH}/news`, newsRoute);
app.use(`${BASE_PATH}/promotion`, promotionRoute);
app.use(`${BASE_PATH}/feeds`, feedsRoute);
app.use(`${BASE_PATH}/course`, courseRoute);
app.use(`${BASE_PATH}/notification`, notificationRoute);
app.use(`${BASE_PATH}/chat`, chatRoute);
app.use(`${BASE_PATH}/payment`, paymentRoute);
app.use(`${BASE_PATH}/report`, reportRoute);

//* Handle undefined routes
app.all("*", (req, res) => {
  return responseHandler(res, 404, "No API Found..!");
});

//! Start the server and listen on the specified port from environment variable
server.listen(PORT, () => {
  const portMessage = clc.redBright(`✓ App is running on port: ${PORT}`);
  const envMessage = clc.yellowBright(
    `✓ Environment: ${NODE_ENV || "development"}`
  );
  console.log(`${portMessage}\n${envMessage}`);
});
