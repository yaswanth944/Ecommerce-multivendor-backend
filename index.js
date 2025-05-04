const express = require("express");
const app = express();
const dotEnv = require("dotenv");
dotEnv.config(); // Load environment variables
const mongoose = require("mongoose");
const vendorRoutes = require("./routes/vendorRoutes");

const firmRoute=require('./routes/firmRoutes')
const productRoute=require('./routes/productRoutes')
const path=require('path')
const bodyParser = require("body-parser");
// Start Server
const port = 4000;
app.listen(port, () => {
  console.log(`Server started and running at port ${port}`);
});

// Connect to MongoDB
mongoose
  .connect(process.env.mongourl)
  .then(() => console.log("Database connection successful"))
  .catch((error) => console.error("Database connection failed:", error));
app.use(bodyParser.json());
app.use("/vendor", vendorRoutes);
app.use('/firm',firmRoute)
app.use('/product',productRoute)
app.use('/uploads',express.static('uploads'))
app.get("/home", (req, res) => {
  res.send("Welcome to the home page");
});