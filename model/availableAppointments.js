const mongoose = require('mongoose');

const AvailableAppointmentSchema = new mongoose.Schema({
    storeId: {
        type: String,
        required: [true, 'Store Id is a must!']
    },
    appointmentDate: {
        type: String,
        required: [true, 'Date is a must!']
    },
    availableAppointments: {
        type: Array
    }
    
})

module.exports = mongoose.model("available", AvailableAppointmentSchema)