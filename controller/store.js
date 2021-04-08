const Store = require("../model/storeModel");
const path = require("path");
const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.STORE_JWT_SECRET_KEY;
const emailCheck = require("../middleware/nodemailer");
const adminJwtSecretKey = process.env.ADMIN_JWT_SECRET_KEY;

exports.register = async (req, res) => {
    
    const {
        storeName,
        storeAddress,
        openingHours,
        closingHours,
        personsPerSlot,
        slotDuration,
        password,
        confirmPassword,
        email,
    }= req.body.data;
  
    let storeCheck = await Store.findOne({ email });
  
    if (storeCheck) {
      return res.json({
        status: "already",
        message: "Sorry! this email is already registered with us",
      });
    }
  
    let hashedPass = await bcrypt.hash(password, 10);
    if (!hashedPass)
      return res
        .status(501)
        .json({
          status: "failed",
          message: "Technical Erro 501, Please contact support team!",
        });
    const newStore = new Store({
      storeName,
      storeAddress,
      email,
      password: hashedPass,
      confirmed: false,
        closingHours: +closingHours,
        openingHours: +openingHours,
        personsPerSlot: +personsPerSlot,
        slotDuration: +slotDuration,
    });
    newStore.save(async (err, doc) => {
      if (err) res.status(500).json({ status: "failed", message: err });
      else {
        const payload = {
          id: doc._id,
          email: doc.email,
        };
        const confirmationToken = await jwt.sign(payload, jwtSecretKey, {
          expiresIn: 3600,
        });
  
        doc.html = `<b>To Confirm  email address of your store please <a href="http://localhost:4200/store/registration/confirmation/${doc.id}/${confirmationToken}">Click here!</a></b>`;
        doc.subject = "Confirm your email";
        let emailStatus = await emailCheck.confirmation(doc);
        if (emailStatus)
          res.json({
            status: "success",
            message: "Welcome ! Your account is successfully created",
          });
        else
          res.json({
            status: "failed",
            message: "Email sending failed. Please recheck your email address.",
          });
      }
    });
  };