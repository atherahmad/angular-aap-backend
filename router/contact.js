const router = require("express").Router()
const contact   = require("../controller/contact")

router.post("/querry", contact.querry)

module.exports=router
//localhost:3000/api/contact/querry 
