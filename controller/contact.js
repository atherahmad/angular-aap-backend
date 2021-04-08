const Querry = require("../model/querriesModel")
const emailCheck = require("../middleware/nodemailer")

exports.querry = async (req, res) => {
    console.log(req.body.data)
        const newQuerry = new Querry({
            name:req.body.data.name,
            email:req.body.data.email,
            subject:req.body.data.subject,
            message:req.body.data.message,
            completed:false})
            
        await newQuerry.save(async(err,doc)=>{
            if(err) {
                res.json({status:"failed", message:"Currently unable to send your meesage please try again", data:err})
                throw err
            }
            else {
                                
    let querry = await emailCheck.confirmation({
        email:req.body.data.email,
        subject:req.body.data.subject,
        text:"",
        html:`
            <h2>Thanks for Contacting us!</h2>
            <h4>Our team will contact you in next 48 hours regarding your querry.</h4>
            <br/>
            ==========================================================================
            <br/>
            Your querry
            <h4>Subject: ${req.body.subject}</h4>
            <h4>Message:</h4>
            <p>${req.body.messageText}</p>`
    })
                if (querry) res.json({ status:"success", message: "We have recieved your querry"})
        else res.json({status:"failed", message:"Sorry we are unable to proccess your request please try again later"})
    }

})
}
