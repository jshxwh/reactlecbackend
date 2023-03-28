const express = require("express");
const cors = require("cors");
const app = express();
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const auth = require("./routes/auth");
const products = require("./routes/product");
const errorMiddleware = require("./middlewares/error");
const order = require("./routes/order");

app.use(express.json({ limit: "100mb" }));
app.use(
  cors({
    origin: "https://reactlecfrontend.onrender.com",
    credentials: true,
    exposedHeaders: ["Set-Cookie"],
  })
);
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());
// app.use(fileUpload());

app.use("/api/v1", products);
app.use("/api/v1", auth);
app.use("/api/v1", order);
app.use(errorMiddleware);

module.exports = app;
