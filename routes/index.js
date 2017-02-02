var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/app/home');
  } else {
    res.render('home');
  }
});


module.exports = router
