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
    slotsArray: {
        type: Array,
        required:[true, "Slots are must"]
    },
    confirmed: {
        type: Boolean,
        required:[true,"confirm required"]
    }
})

module.exports = mongoose.model("stores", StoreSchema)