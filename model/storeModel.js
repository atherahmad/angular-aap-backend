const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
    storeName: {
        type: String,
        required: [true, 'Store Name is a must!']
    },
    storeAddress:{
        type:String,
        required: [true, 'Store Address is a must!']
    },
    email: {
        type: String,
        required: [true, 'Store Email  is a must!'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is a must!']
    },
    closingHours:{
        type: String,
        required:[true, "Closing Timing is must"]
    },
    openingHours:{
        type:String,
        required:[true, "Opening timimg is must"]
    },
    personsPerSlot:{
        type:Number,
        required:[true, "Capacity is must"]
    },
    slotDuration:{
        type: Number,
        required:[true, "Slot Druation is must"]
    },
    confirmed:{
        type:Boolean,
        required:[true, "Confirmation is must"]
    
    },
    slotsArray: {
        type: Array,
        required:[true, "Slots are must"]
    }
})

module.exports = mongoose.model("stores", StoreSchema)