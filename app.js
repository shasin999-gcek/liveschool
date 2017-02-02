/* Live School Inc.
*  author : muhammed shasin p
*  copyright : 2017
*/
var express = require('express');
var morgan = require('morgan');
var path = require('path');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');
var exphbs = require('express-handlebars');

// init app
var app = express();
var http = require('http').Server(app);
var io = module.exports = require('socket.io')(http);

// routes
var routes = require('./routes/index');
var users = require('./routes/users');
var mainapp = require('./routes/mainapp');

// view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// serve static files
app.use(express.static(__dirname+'/public'));

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extented: false}));
app.use(cookieParser());
app.use(session({
    secret: "SomeRandomSecretValue",
    saveUninitialized:true,
    resave:true,
    session: {maxage: 1000 * 60 * 60 * 24 * 30}
}));

// Express validator
app.use(expressValidator({
  errorFormator: function(param, msg, value) {
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg  : msg,
      value: value
    }
  }
}));

// connect flash
app.use(flash());

// Global vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// setup the logger
app.use(morgan('combined'));

// passport init
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/users', users);
app.use('/app', mainapp);


http.listen(8080, function(){
  console.log('liveschool webapp listening on http://127.0.0.1:8080');
});
