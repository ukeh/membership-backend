var createError = require('http-errors');
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var cors = require('cors');
var bodyParser = require('body-parser');
var useragent = require('express-useragent');
var cron = require('node-cron');
require('dotenv').config();



var mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}


//Require Routers

const testRouter = require('./routes/testRouter');
const authenticationRouter = require('./routes/authenticationRouter');
const adminRouter = require('./routes/adminRouter');

var app = express();

mongoose.connect(process.env.DB_CONNECTION, mongooseOptions)
  .then(() => {
    console.log("Connected Successfully to mongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use(useragent.express());

app.use(express.static(path.join(__dirname, 'public')));


//Routing happens here

app.use('/test', testRouter);
app.use('/authenticate', authenticationRouter);
app.use('/admin', adminRouter);




// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {

  console.log("ERROR========================>", err.message);
  console.log(err);

  res.status(err.status || 500);
  res.setHeader('Content-Type', 'application/json');
  res.json({ message: err.message || "Internal Server Error.", error: true, errors: err.errors || [] });
});

module.exports = app;
