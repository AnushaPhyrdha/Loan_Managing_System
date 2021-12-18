const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const filterRoutes = require("./routes/filter_routes");
const cors = require("cors");

mongoose.connect("mongodb://localhost/GoalTeller");

app.use(cors());
require("./model/loan");

app.use(bodyParser());

app.use("/api", filterRoutes);

app.listen("5000", () => console.log("Server listening on port 5000"));
