const mongoose = require('mongoose')
const User = require('../models/User')
const { errorHandler } = require('../helpers/help')
const { MONGODB_HOST, MONGODB_DATABASE } = process.env;
const MONGODB_URI = process.env.DATABASE_LOCAL

const connectDB = async () => {
    try {

        await mongoose.connect(MONGODB_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            /* useCreateIndex: true,
             useFindAndModify: false*/
        })
        console.log(`DB CONNECTION SUCCESS`)
        var admin = {
            username: 'AWSH SUPPORT',
            email: 'support@awsh.net',
            password: 'maricoelqueloleaynomeparebolasporguevon',
            role:'admin'
        } 
        const user = new User(admin);
        user.save((err, user) => {
            if (err) {
            } else {
            }
        });
    } catch (error) {
        console.log(error);
        //process.exit(1);
    }
}


module.exports = connectDB