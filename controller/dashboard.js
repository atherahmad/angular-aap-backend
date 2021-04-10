const Appointment= require("../model/appointmentModel")


exports.myAppointments = async (req, res) => {
    const creator = req.userId;

    await Appointment.find({creatorId:creator}, (err, doc)=>{
        if(err) return res.json({status:"failed", message:"Unable to retrieve your data please try again"})
        res.json({status:"success", message:doc})

    })
    
}