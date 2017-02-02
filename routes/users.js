var express = require('express');
var crypto = require('crypto');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var pool = require('../db');

var router = express.Router(); // init router

// hashing password
function hash (password, salt) {
	var hashed = crypto.pbkdf2Sync(password, salt, 10000, 512, 'SHA512');
	return ['pbkdf2', 10000, salt, hashed.toString('hex')].join('$');
}

// Create User API
router.post('/register', function (req, res) {
  var firstname = req.body.firstname;
  var lastname  = req.body.lastname;
  var dob       = req.body.dob;
	var email     = req.body.email;
	var password1 = req.body.password1;
  var password2 = req.body.password2;

  // Validation
	req.checkBody('firstname', 'First name is required').notEmpty();
  req.checkBody('lastname', 'Second name is required').notEmpty();
  req.checkBody('dob', 'Date of birth is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('password1', 'Password required').notEmpty();
  req.checkBody('password2', 'Confirm Password required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password1', 'Password doest not match').equals(req.body.password2);

  var errors = req.validationErrors();

  if(errors) {
    res.render('home', { errors : errors});
  } else {
    var salt = crypto.randomBytes(128).toString('hex');
    var hashedPassword = hash(password1, salt);
    // saving to db
	  var query_string = 'INSERT INTO "user" (email, password, first_name, last_name, dob) VALUES ($1, $2, $3, $4, $5);';
    pool.query(query_string, [email, hashedPassword, firstname, lastname, dob], function (err, result) {
       if (err) {
         res.status(500).send(err.toString());
       } else {
         req.flash('success_msg', 'Your Account is Verified Now U can Log In');
				 res.sendStatus(200);
       }
    });
  }
});

passport.use( new LocalStrategy(
	function (email, password, done) {
		pool.query('SELECT * FROM "user" WHERE email= $1;', [email], function (err,result) {
			if (err) {
				return done(err);
			} else {
				if (result.rows.length === 0) {
					return done(null, false, {message: 'Email is not Registered'});
				} else {
	          var dbPassword = result.rows[0].password;
	  				var salt = dbPassword.split('$')[2];
	  				var hashedPassword = hash(password, salt);

	  				if (hashedPassword === dbPassword) {
							return done(null, result.rows[0]);
	  					//req.session.auth = {userId: result.rows[0].id}; // { auth: {userId }}
	            //res.status(200).send(JSON.stringify({userId: result.rows[0].id }));
					} else {
						  return done(null, false, {message: 'incorrect password'});
					}
				}
			}
		});
	}));

passport.serializeUser(function (user, done) {
	return done(null, user.id)
});

passport.deserializeUser(function (id, done) {
	pool.query('SELECT * FROM "user" WHERE id=$1;', [id], function (err, result) {
		return done(null, result.rows[0]);
	});
});

// login API
router.post('/login',
  passport.authenticate('local', {failureRedirect: '/', failureFlash: true}),
  function (req, res) {
		res.redirect('/app/home');
  });


// logout
router.get('/logout', function (req,res) {
  req.logout();
	req.flash('error_msg', 'You logged Out');
  res.redirect('/');
});



module.exports = router
