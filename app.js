require("dotenv").config();

// express
const express = require("express");
const app = express();

// mongodb
require("./data/dbConnection");

// middleware
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//my routes
const authroutes = require("./routes/auth");
const transactionRoute = require("./routes/transaction");

//my routes
app.use("/api/auth", authroutes);
app.use("/api/transaction", transactionRoute);
//port
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.status(200).json({success:true})
})

//starting server
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
