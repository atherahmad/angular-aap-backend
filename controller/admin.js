const Querry = require("../model/querriesModel")
const User=require("../model/userModel")
const emailCheck = require("../middleware/nodemailer")


exports.querriesList = async (req, res) => {

        Querry.find({},{_id:1, name:1, subject:1, completed:1, timeStamp:1},(err, doc) => {
            if (err) res.json({ status: "failed", message: err })
            else {
                res.send({
                    success: doc
                })
            }
        })
}

exports.querryDetails =async(req,res)=>{
    Querry.findById(req.params.id,(err, doc) => {
        if (err) res.json({ status: "failed", message: err })
        else {
            res.send({
                success: doc
            })
        }
    })

}

exports.querryHandler=async(req,res)=>{
    
    const {id,  response, email, name,subject} =req.body
    let querry = await emailCheck.confirmation({
        email:email,
        subject:`RE: ${req.body.subject}`,
        text:"",
        html:`
            Dear ${name}
            <h2>Thanks for Contacting us!</h2>
            <p>${response}</p>
            <br/>
            ==========================================================================
            <br/>
            Your querry
            <h4>Subject: ${subject}</h4>
            <h4>Message:</h4>
            <p>${req.body.messageText}</p>`
    })
    if(querry) Querry.findByIdAndUpdate(id,{completed:true, response:response} ,(err,doc)=>{
        if(err) res.json({failed:"Your request is failed please try again"})
            else res.json({success: doc})

    }) 
        else res.json({status:"failed", message:"Sorry we are unable to proccess your request please try again later"})
}

exports.usersList = async (req, res) => {
    User.find({},{_id:1, firstName:1, lastName:1, admin:1, email:1},(err, doc) => {
        if (err) res.json({ status: "failed", message: err })
        else {
            res.send({
                success: doc
            })
        }
    })

}


exports.userDetails = async (req, res)=>{
    User.findById(req.params.userId, {firstName:1, lastName:1,email:1,paypalId:1,phoneNumber:1, address:1,profileImage:1, admin:1}, (err,doc)=>{
        if (err) res.json({
            status: "failed",
            message: err
        })
        else {
            const { firstName, lastName, email, paypalId, phoneNumber, profileImage, admin } = doc
            let street, city, zipCode;
            if (doc.address) {
                street = doc.address.street;
                city = doc.address.city;
                zipCode = doc.address.zipCode
            }
            else {
                street = ""
                city = ""
                zipCode = ""
            }
            const profile = { firstName, lastName, email, paypalId, phoneNumber, street, city, zipCode, profileImage, admin }
            res.json({
                status: "success",
                data: profile
            })

        }
    })
}

exports.updateUser=async (req,res)=>{

    User.findByIdAndUpdate(req.body.userId, {admin:req.body.admin}, (err,doc)=>{
        if(err) res.json({failed:"request failed try again"})
            else res.json({success:"You have updated user Access"})
    })
}
