const Store = require("../model/storeModel");
const Appointment = require("../model/appointmentModel")
const CancelledAppointment=require("../model/cancelledAppointmentModel")
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.STORE_JWT_SECRET_KEY;
const emailCheck = require("../middleware/nodemailer");
const { json } = require("body-parser");
const { response } = require("express");
const adminJwtSecretKey = process.env.ADMIN_JWT_SECRET_KEY;


exports.newAppointment = async (req, res) => {
    const {
        slotNumber,
        selectedYear,
        selectedMonth,
        selectedDay,
        selectedStore,
        storeName,
        slotName
  } = req.body;
  

    const creator = req.userId;
    
    console.log(slotNumber, selectedDay, selectedMonth, selectedYear, selectedStore, creator,storeName,slotName, "appointment")
    let appointmentDate = `${selectedDay}/${selectedMonth}/${selectedYear}`;
    
       const newAppointment = new Appointment({
          storeId: selectedStore,
          appoointmentSlot: slotNumber,
          creatorId: creator,
          appointmentDate,
          storeName,
          slotName
           
      });
      newAppointment.save((err, doc) => {
        if (err) {
          res.json({ status: "failed", message: err });
        } else {
         
            res.json({ status: "success", message: "Appointment successfully created" });
        }
      }); 
    };


exports.deleteAppointment = async (req, res) => {

  const appointmentId = req.body.appointmentId;

  await Appointment.findByIdAndDelete(appointmentId, (err, result) => {
    if (err) res.json({
      status: "failed",
      message:
        "Sorry, we are unable to process your request please try again",
    });
    else
      console.log("result ", result)
      result=result.toObject()
      result.cancelledByUser=true;
      result.cancelledByStore=false;
      let swap = new CancelledAppointment(result)
    swap.save((err, doc => {
      if (err) res.json({ status: "failed", message: "Unable to process your request please try again." })
        else res.json({status:"success", message:"You have successfully deleted your appointment"})
      }))

      })
    
}
  
exports.appoinmetnDetails = async (req, res) => {
  const id = req.params.id;
  console.log(id)
  Appointment.findById(id, (err, doc) => {
    if (err)  res.json({ status: "failed", message: "Unable to process your request please try again" })
    else {
      console.log(doc)
      res.json({ status: "success", message: doc })
    }
  })
}