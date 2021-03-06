const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET_KEY;
const emailCheck = require("../middleware/nodemailer");
const adminJwtSecretKey = process.env.ADMIN_JWT_SECRET_KEY;
const Store = require("../model/storeModel")

//Token Generator
const createToken = (id) => jwt.sign({ id }, jwtSecretKey, { expiresIn: 3600 });

const createAdminToken = (id) =>
  jwt.sign({ id }, adminJwtSecretKey, { expiresIn: 3600 });

//Sign in  Area
exports.signin = async (req, res) => {
  const { email, pass } = req.body.data;
  console.log("sign in ", email, pass)

  const user = await User.findOne({email})
  if(!user) return res.json("failed")

  console.log(user)
  await bcrypt.compare(pass, user.pass).then(async (isPassCorrect) => {
    if (isPassCorrect) {
      if (user.confirmed) {
        const { id, firstName, lastName, email, storeOwner } = user;
        let token = "";
        if (storeOwner) token = await createAdminToken(user.id);
        else token = await createToken(user.id);
        res.json({
          status: "success",
          message: "Welcome! you are successfully logged in. ",
          data: { id, firstName, lastName, email, storeOwner },
          token,
        });
      } else
        res.json({
          status: "failed",
          message:
            "Authentication failed, please confirm you email address first",
        });
    } else
      res.json({
        status: "failed",
        message: "Authorization failed , please check your credentials",
      });
  });
}


/*   await User.findOne({ email }, (err, result) => {
  console.log("err and result", err, result)
    if (err)
      return res.status(500).json({
        status: "failed",
        message:
          "Sorry, we are unable to process your request please try again",
      });

    if (!result)
      return res.json({
        status: "failed",
        message: "Authorization failed , please check your credentials",
      });

    bcrypt.compare(pass, result.pass).then(async (isPassCorrect) => {
      if (isPassCorrect) {
        if (result.confirmed) {
          const { id, firstName, lastName, email, storeOwner } = result;
          let token = "";
          if (storeOwner) token = await createAdminToken(result.id);
          else token = await createToken(result.id);
          res.json({
            status: "success",
            message: "Welcome! you are successfully logged in. ",
            data: { id, firstName, lastName, email, storeOwner },
            token,
          });
        } else
          res.json({
            status: "failed",
            message:
              "Authentication failed, please confirm you email address first",
          });
      } else
        res.json({
          status: "failed",
          message: "Authorization failed , please check your credentials",
        });
    });
  }); */


// Signup Area
exports.signup = async (req, res) => {
  
  const { firstName, lastName, email,confirmPassword, password} = req.body;
  if(confirmPassword!=password) return  res.json({ status: "failed", message: "Both passwords dont match" })
  
  
  let pass = password;

  let userCheck = await User.findOne({ email });

  if (userCheck) {
    return res.json({
      status: "failed",
      message: "Sorry! this email is already registered with us",
    });
  }

  let hashedPass = await bcrypt.hash(pass, 10);
  if (!hashedPass)
    return res
      .status(501)
      .json({
        status: "failed",
        message: "Technical Erro 501, Please contact support team!",
      });
  const newUser = new User({
    firstName,
    lastName,
    email,
    pass: hashedPass,
    confirmed: false,
    storeOwner: false,
  });
  newUser.save(async (err, doc) => {
    if (err) res.status(500).json({ status: "failed", message: err });
    else {
      const payload = {
        id: doc._id,
        email: doc.email,
      };
      const confirmationToken = await jwt.sign(payload, jwtSecretKey, {
        expiresIn: 3600,
      });

      doc.html = `<b>To Confirm your email address please <a href="${process.env.FE_URL}/#/account/confirmation/${doc.id}/${confirmationToken}">Click here!</a></b>`;
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
          message: "Request failed please try again",
        });
    }
  });
};
//Checking Authentication of user
exports.authenticated = async (req, res) => {
   User.findById(
    req.userId,
    { _id: 1, firstName: 1, lastName: 1, },
    (err, doc) => {
      if (err)
        return res.json({
          status: "failed",
          message: "Unable to retrieve your data please try again",
        });
      
      const { id, firstName, lastName, email, storeOwner } = doc;
      res.json({
        status: "success",
        message: "Welcome! you are successfully logged in.",
        data: { id, firstName, lastName, email, storeOwner },
      });
    }
  );
};
exports.changePassword = async (req, res) => {
  const { pass, confirmPass, oldPass } = req.body.data;

  if (pass !== confirmPass)
    return res.json({
      status: "failed",
      message: "Request Failed, Please check your inputs",
    });

  await User.findById(req.userId, (err, result) => {
    if (err)
      return res.status(500).json({
        status: "failed",
        message:
          "Sorry, we are unable to process your request please try again",
      });

    if (!result)
      return res.json({
        status: "failed",
        message: "Authorization failed , please check your credentials",
      });

    bcrypt.compare(oldPass, result.pass).then(async (isPassCorrect) => {
      if (!isPassCorrect)
        return res.json({
          status: "failed",
          message: "Authorization failed , please check your credentials",
        });
      if (isPassCorrect) {
        let hashedPass = await bcrypt.hash(pass, 10);
        const profileData = { pass: hashedPass };
        User.findByIdAndUpdate(
          req.userId,
          profileData,
           (err, doc) => {
            if (err) return res.json({ status: "failed", message: err });
            else {
              res.json({
                status: "success",
                message: "You have succesfully cahnged your password",
              });
            }
          }
        );
      }
    });
  });
};

exports.confirmEmail = async (req, res) => {
  const { token, id } = req.body.data
  console.log("reached confirm")
  let email;

  await jwt.verify(token, jwtSecretKey, async (fail, decodedPayload) => {
    if (fail)
      return res.json({
        status:"failed",
        message: "Authentication failed in verifying token!",
      });
    else {
      let id = decodedPayload.id;
       User.findByIdAndUpdate(id, { confirmed: true },  (err, doc) => {
        if (err)
          {
            console.log("error occured", err)
            res.json({ status:"failed", message: "Your request is failed please try again" });}
        else
        {
          if(!doc.storeOwner) return res.json({
              
            status:"success",message: "You have successfuly confirmed your email address.",
          });
          email = doc.email;
           Store.findOneAndUpdate({email}, { confirmed: true }, (err, doc) => {
            if (err) res.json({ status: "failed", message: err })
            else
              res.json({
              
              status:"success",message: "You have successfuly confirmed your email address.",
            });
          })
          }
      });
    }
  });
};
