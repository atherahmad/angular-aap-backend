const mongoose = require('mongoose');

const CancelledAppointmentSchema = new mongoose.Schema({
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
    },
    storeName: {
        type: String,
        required: [true, 'Store name is must']
    },
    slotName: {
        type: String,
        require:[true,"Slot name required"]
    },
    cancelledByUser: {
        type: Boolean,
        require:[true, "Who cancelled is required"]
    },
    cancelledByStore: {
        type: Boolean,
        require:[true,"Who Cancelled is mandatory"]
    },
    comments: {
        type: String
    }
})

module.exports = mongoose.model("cancelledAppointments", CancelledAppointmentSchema)