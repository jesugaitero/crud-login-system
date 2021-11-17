const express = require('express')
const morgan = require('morgan');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const expressValidator = require('express-validator')
const multer = require('multer');
const path = require('path');
const fs = require('fs')

//import routes
const authRoutes = require('./routes/auth.routes')

const app = express()
require('dotenv').config()

//settings
app.set('port', process.env.PORT);

app.set('view engine', 'pug');

app.set('views', path.join(__dirname, 'views'));

const connectDB = require('./config/database');

connectDB();
//middlewares
app.use(cors());
app.use(morgan('dev'))
app.use(cookieParser())
app.use(expressValidator())
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use("/api", cors(), authRoutes);

module.exports = app;