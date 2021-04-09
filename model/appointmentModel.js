const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    storeId: {
        type: String,
        required: [true, 'Store Id is a must!']
    },
    appointmentDate:{
        type:String,
        required: [true, 'Date is a must!']
    },
    appoointmentSlot: {
        type: Number,
        required: [true, 'Appointment slot is a must!'],
    },
    creatorId:{
        type: String,
        required:[true, "Creator Id is must"]
    }
})

module.exports = mongoose.model("appointments", AppointmentSchema)