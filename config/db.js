const connectDB = async () => {

    const mongoose = require("mongoose");
    require('dotenv').config();
    const db = process.env.DB_URI


// Ather  const db = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-er0mu.gcp.mongodb.net/${process.env.DB_HOST}?retryWrites=true&w=majority`;
// Milad    const db = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@my-projects-phh6v.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,

        });
        console.log('Mongo Atlas server is ready');
    } catch (error) {

        console.log(error.message);
    }

}
module.exports = connectDB;