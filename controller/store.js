const Store = require("../model/storeModel");
const path = require("path");
const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.STORE_JWT_SECRET_KEY;
const emailCheck = require("../middleware/nodemailer");
const { json } = require("body-parser");
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
  } = req.body.data;
  
  if (password != confirmPassword) return res.json({ status: "failed", message: "Password and confirm password must same" });
  
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
  let slotsArray = slotsGenerator(openingHours, closingHours, slotDuration, +personsPerSlot);

  
    const newStore = new Store({
      storeName,
      storeAddress,
      email,
      password: hashedPass,
      confirmed: false,
      closingHours: ('0'+closingHours+'00').slice(-4),
      openingHours: ('0'+openingHours+'00').slice(-4),
      personsPerSlot: +personsPerSlot,
      slotDuration: +slotDuration,
      slotsArray
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
  
slotsGenerator = (startTime, closeTime, slotDuration, capacity) => {
  
   startTime = parseInt(startTime+'00');
   closeTime = parseInt(closeTime+'00');
   slotDuration = parseInt(slotDuration);
   arrayOfSlots = [];
  capacity = parseInt(capacity)

  let numberOfSlots = (((closeTime % 100) + Math.floor(((closeTime - (closeTime % 100)) / 100) * 60)) - ((startTime % 100) + Math.floor(((startTime - (startTime % 100)) / 100) * 60))) / slotDuration;

  let tempTime = parseInt(startTime)
  let endTime;
  
  for (let i = 1; i <= numberOfSlots; i++) {

      if (((tempTime + slotDuration) % 100) >= 60) {
          endTime = (((tempTime + slotDuration) % 100) - 60) + (100 - ((tempTime + slotDuration) % 100)) + (tempTime + slotDuration)
      }
      else
          endTime = tempTime + slotDuration;
      arrayOfSlots.push({ slotNumber:i,appointmentStartTime: ('0'+tempTime).slice(-4), appointmentEndTime: ('0'+endTime).slice(-4), availableBookings:capacity });
      tempTime = endTime;
  }

  return arrayOfSlots
}