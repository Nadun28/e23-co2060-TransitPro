require("dotenv").config();

console.log("ENV:", process.env.MONGO_URL);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.set("strictQuery", true);

console.log("Connecting to MongoDB...");

mongoose
  .connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: 5000, // ⏱ fail fast (5s)
  })
  .then(() => {
    console.log("MongoDB Connected ✅");

    app.use("/api/auth", require("./routes/auth"));
    app.use("/api/bookings", require("./routes/bookings"));
    app.use("/api/dashboard", require("./routes/dashboard"));
    app.use("/api/routes", require("./routes/routes"));
    app.use("/api/vehicles", require("./routes/vehicles"));

    app.listen(5001, () => {
      console.log("Server started on 5001 🚀");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed ❌:");
    console.error(err); // print full error
  });
