const express = require("express");
const userRoutes = require("./route/userRoute");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

console.log(process.env.PORT);

app.get("/", (req, res) => {
  //   res.send({
  //     message: "Hello World!",
  //   });
  res.send("Hello World!");
});

const connection = mongoose.connect(process.env.MONGODB_URL);
connection
  .then(() => {
    console.log("Connected successfully to mongodb");
  })
  .catch((error) => {
    console.log("An error occurred while trying to connect. Error: ", error);
  });

app.use("/user", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
