const Appointment = require("../model/appointmentModel");
const CancelledAppointment = require("../model/cancelledAppointmentModel");



exports.myAppointments = async (req, res) => {
    const creator = req.userId;

     Appointment.find({creatorId:creator}, (err, doc)=>{
        if(err) return res.json({status:"failed", message:"Unable to retrieve your data please try again"})
        res.json({status:"success", message:doc})

    })
    
}

exports.getDeletedAppointments = async (req, res) => {
    const creator = req.userId;
     CancelledAppointment.find({ creatorId: creator }, (err, doc) => {
        if (err) return res.json({ status: "failed", message: "Unable to proccess your request please try again" })
        res.json({ status: "success", message: doc })
    })
}