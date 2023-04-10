const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const userRoute = require("./routes/User");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/Product");
const cartRoute = require("./routes/Cart");
const orderRoute = require("./routes/Order");
const stripeRoute = require("./routes/Stripe")
const cors = require("cors");



mongoose.connect(
    process.env.MONGO_URL
)
.then(() => console.log("DB Connection Succesful"))
.catch((err) => {
    console.log(err);
});

// To take Json object into body of the json file and test from Postman.
app.use(express.json());

// this is used to solved the cors port issue.
app.use(cors());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/Carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);


app.listen(process.env.PORT || 5000, () => {
    console.log("Backend server is up and running!");
});