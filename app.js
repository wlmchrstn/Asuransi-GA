// /* istanbul ignore file */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var http = require('http');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/v1/user');
var insuranceRouter = require('./routes/v1/insurance');
var promoRouter = require('./routes/v1/promo');
var commentRouter = require('./routes/v1/comment');
var formRouter = require('./routes/v1/form');
var saldoRouter = require('./routes/v1/saldo');

var app = express();

var mongoose = require('mongoose');
/* istanbul ignore next */
var env = process.env.NODE_ENV || "development";
/* istanbul ignore else */
if (env == "development" || env == 'test') {
  require('dotenv').config()
}
/* istanbul ignore next */
const configDB = {
  development: process.env.DB_DEV,
  test: process.env.DB_TEST || $DB_TEST,
  production: process.env.DB_PROD
}

const dbConnection = configDB[env];

mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)

mongoose.connect(dbConnection)
  .then(() => {
    console.log('Database successfully connect!')
  })
mongoose.Promise = Promise;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);
app.use('/api/user', userRouter)
app.use('/api/insurance', insuranceRouter);
app.use('/api/promo', promoRouter);
app.use('/api/comment', commentRouter);
app.use('/api/form', formRouter);
app.use('/api/saldo', saldoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  /* istanbul ignore next */
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  /* istanbul ignore next */
  res.locals.message = err.message;
  /* istanbul ignore next */
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  /* istanbul ignore next */
  res.status(err.status || 500);
  /* istanbul ignore next */
  res.render('error');
});
let port = process.env.PORT
app.listen(port, () => {
  console.log(`Server Started at ${Date()}!`)
  console.log(`Listening on port ${port} in database ${env}!`)
})

/* istanbul ignore next */
setInterval(function() {
  http.get(process.env.BE_HOME_URL)
}, 300000)

module.exports = app;
