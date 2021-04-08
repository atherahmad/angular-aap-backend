const User = require("../model/userModel");
const multer = require("multer");
const path = require("path");
const cp = require("child_process");

exports.getProfile = (req, res) => {
  User.findById(req.userId, (err, doc) => {
    if (err)
      return res.status(501).json({
        status: "failed",
        message: err,
      });
    else {
      const {
        firstName,
        lastName,
        email,
        paypalId,
        phoneNumber,
        profileImage,
      } = doc;
      let street, city, zipCode;
      if (doc.address) {
        street = doc.address.street;
        city = doc.address.city;
        zipCode = doc.address.zipCode;
      } else {
        street = "";
        city = "";
        zipCode = "";
      }
      const profile = {
        firstName,
        lastName,
        email,
        paypalId,
        phoneNumber,
        street,
        city,
        zipCode,
        profileImage,
      };
      res.json({
        status: "success",
        data: profile,
      });
    }
  });
};
