const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
    storeName: {
        type: String,
        required: [true, 'email is a must!']
    },
    storeAddress:{
        type:String,
        required: [true, 'email is a must!']
    },
    email: {
        type: String,
        required: [true, 'email is a must!'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is a must!']
    },
    closingHours:{
        type: Number
    },
    openingHours:{
        type:Number
    },
    personsPerSlot:{
        type:Number
    },
    slotDuration:{
        type:Number
    },
    confirmed:{
        type:Boolean,
        required:[true, "Confirmation is must"]
    
    }
})

module.exports = mongoose.model("stores", StoreSchema)