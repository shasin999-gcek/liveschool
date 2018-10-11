var express = require('express');
var router = express.Router();

var User = require('../db');
var io = require('../app');

router.get('/home', ensureAuthenticated, function (req, res) {
  res.render('app', {'user': req.user});
});

router.get('/people', ensureAuthenticated, function(req, res) {
    var userId = req.query.userid;
    pool.query('SELECT * FROM "user" LIMIT 50;', function(err, result) {
      if (err) {
        res.send(err.toString());
      } else {
        if (result.rows.length === 0) {
          res.send('NO Users Exist');
        } else {
          res.render('view_people', {'people': result.rows});
        }
      }
    });
});

router.get('/profile/view', ensureAuthenticated, function(req, res) {
    var userId = req.query.userid;
    User.getUserById(userId, function(err_code, user) {
      if (err_code === 404) {
        res.status(404).send('User does not exist');
      } else {
        res.render('profile', {'user': user});
      }
    });
});

router.get('/edit-profile', ensureAuthenticated, function (req, res) {
  res.render('edit_profile', {'user': req.user});
});

router.get('/profile', ensureAuthenticated, function (req, res) {
  res.render('profile', {'user': req.user, 'editAccess': true});
});

router.get('/chat', ensureAuthenticated, function (req, res) {
  console.log(req.user);
  res.render('chat', {layout: 'chatlayout'});
});


io.on('connection', function(socket){
  socket.on('chat message', function (msg) {
     socket.broadcast.emit('chat message', msg);
  });

  socket.on('Add user online', function (userData) {
    console.log("adding new user online");
  });
});


// ensuring whether user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/')
  }
}

module.exports = router
