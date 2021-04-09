const Store = require("../model/storeModel");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.STORE_JWT_SECRET_KEY;
const emailCheck = require("../middleware/nodemailer");
const { json } = require("body-parser");
const { response } = require("express");
const adminJwtSecretKey = process.env.ADMIN_JWT_SECRET_KEY;


exports.newAppointment = (req, res) => {
    console.log(req.body);
    res.json({status:"failed", message:"sorry cant reach there"})
}