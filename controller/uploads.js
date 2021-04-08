const cloudinary = require("../utils/cloudinary");
const User = require("../model/userModel");

const fs = require("fs");
const { url } = require("inspector");

exports.profile = async (req, res) => {
  let profileData = {};
  const {
    firstName,
    lastName,
    paypalId,
    phoneNumber,
    street,
    city,
    zipCode,
  } = req.body.data ? req.body.data : req.body;

  if (req.file) {
    const uploader = async (path) => await cloudinary.uploads(path, "file");
    const file = req.file;
    const { path } = file;
    const newPath = await uploader(path);

    profileData = {
      firstName,
      lastName,
      paypalId,
      phoneNumber,
      address: {
        street,
        city,
        zipCode,
      },
      profileImage: newPath.url,
    };

    fs.unlinkSync(path);
    if (!newPath)
      return res.json({ status: "failed", message: "Failed to upload image" });
  } else
    profileData = {
      firstName,
      lastName,
      paypalId,
      phoneNumber,
      address: {
        street,
        city,
        zipCode,
      },
    };

  await User.findByIdAndUpdate(req.userId, profileData, (err, doc) => {
    if (err) res.json({ status: "failed", message: err });
    else
      res.json({
        status: "success",
        message: "Records updated successfully",
        data: doc,
      });
  });
};