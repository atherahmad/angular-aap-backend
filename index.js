const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const connectDB = require("./config/db");
const path = require("path");
require("dotenv").config();
const cors = require("cors");
const { urlencoded } = require("body-parser");

connectDB();

app.use(urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname + "/public")));

app.use(cors());

app.use("/api/auth", require("./router/auth"));
app.use("/api/recovery", require("./router/recovery"));
app.use("/api/dashboard", require("./router/dashboard"));
app.use("/api/account", require("./router/account"));
app.use("/api/contact", require("./router/contact"));
app.use("/api/admin", require("./router/admin"));
app.use("/api/store", require("./router/store"));
app.use("/api/appointment", require("./router/appointment"));
app.get("/", (req, res) => {
  res.json({status:"success", message:"Backend working perfectly"})
})


app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
