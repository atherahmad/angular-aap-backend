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
const AvailableAppointments=require("../model/availableAppointments")


exports.newAppointment = async (req, res) => {
    const {
        slotNumber,
        selectedYear,
        selectedMonth,
        selectedDay,
        selectedStore,
        storeName,
        slotName,
        personsPerSlot
  } = req.body;
  

    const creator = req.userId;
    
  let appointmentDate = `${selectedDay}/${selectedMonth}/${selectedYear}`;
  
  const newAppointment = new Appointment({
    storeId: selectedStore,
    appoointmentSlot: slotNumber,
    creatorId: creator,
    appointmentDate,
    storeName,
    slotName
    
  });
  AvailableAppointments.find({ storeId:selectedStore, appointmentDate }, (err, doc) => {
    if (err) res.json({
      status: "failed",
      message:err
    })
    else {
      if(doc.length==0){
     const AppointmentLimit = new AvailableAppointments({
        storeId:selectedStore,
       appointmentDate,
       availableAppointments:[{slotNumber,remaining:personsPerSlot-1}]
     })
        AppointmentLimit.save((err, doc) => {
          if (err) res.json({
            status: "failed",
            message:err
          })
          else {
            newAppointment.save((err, doc) => {
              if (err) {
                res.json({ status: "failed", message: err });
              } else {
               
                  res.json({ status: "success", message: "Appointment successfully created" });
              }
            }); 
          }
      })}
    }
  })
      
  };


exports.deleteAppointment = async (req, res) => {

  const appointmentId = req.body.appointmentId;
  console.log(appointmentId, "appointment id in delete")

  await Appointment.findByIdAndDelete({_id:appointmentId}, async(err, result) => {
    
    if(result)
    {
      console.log("result ", result);
      result = result.toObject() ;
      result.cancelledByUser=true;
      result.cancelledByStore=false;
      let swap = new CancelledAppointment(result)
      await swap.save((err, doc => {
      if (err) res.json({ status: "failed", message: "Unable to process your request please try again." })
        else res.json({status:"success", message:"You have successfully deleted your appointment"})
      }))
    }
    else {
      console.log(err)
      res.json({
      status: "failed",
      message:
        "Sorry, we are unable to process your request please try again",
    });}

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

exports.updateAppointment = async (req, res) => {
  const { _id, appointmentDate, appoointmentSlot,slotName } = req.body
  Appointment.findByIdAndUpdate(_id, { appointmentDate, appoointmentSlot,slotName }, (err, doc) => {
    if (err) {
      res.json({
        status: "failed",
        message:"Your request for updation failed, please try again."
      })
    }
    else {
      res.json({
        status: "success",
        message:"You have successfuly updated the Appointment"
      })
    }
  })
  
}
