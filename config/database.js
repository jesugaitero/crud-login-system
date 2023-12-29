const mongoose = require('mongoose')
const User = require('../models/User')
const { errorHandler } = require('../helpers/help')
const { MONGODB_HOST, MONGODB_DATABASE } = process.env;
const MONGODB_URI = `${MONGODB_HOST}${MONGODB_DATABASE}`
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', true)
        await mongoose.connect(MONGODB_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            /* useCreateIndex: true,
             useFindAndModify: false*/
        })
        console.log(`DB CONNECTION SUCCESS`)
        var admin = {
            username: 'COMPANY_SUPPORT',
            email: 'support@domain.com',
            password: 'maricoelqueloleaynomeparebolasporguevon',
            role: 'admin'
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