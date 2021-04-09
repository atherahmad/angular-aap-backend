const mongoose = require('mongoose');
//const Conversations = require("./conversationModel")

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Name is a must!']
    },
    lastName:{
        type:String
    },
    email: {
        type: String,
        required: [true, 'email is a must!'],
        unique: true
    },
    pass: {
        type: String,
        required: [true, 'Password is a must!']
    },

    unsuccessfullAttempts:{
        type:Number,
    },
    status:{
        type:Boolean
    },
    storeOwner:{
        type:Boolean
    },
    confirmed:{
        type:Boolean,
        required:[true, "Please confirm your email first."]
    
    }
})

module.exports = mongoose.model("c2cusers", UserSchema)