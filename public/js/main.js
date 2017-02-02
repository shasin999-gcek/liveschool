
// main javascript file
$(document).ready( function () {

  // create-user form

  $('#create-btn').click( function (e) {
    e.preventDefault();

    var firstname = $('input[name=firstname]').val();
    var lastname  = $('input[name=lastname]').val();
    var dob       = $('input[name=dob]').val();
    var email     = $('input[name=email]').val();
    var password1  = $('input[name=password1]').val();
    var password2 = $('input[name=password2]').val();

    // Validation
    if (firstname == "")     { $('#input-first-name').addClass('has-error'); }
    else if(lastname == "")  { $('#input-last-name').addClass('has-error'); }
    else if(dob == "")       { $('#input-dob').addClass('has-error'); }
    else if(email == "")     { $('#input-email').addClass('has-error'); }
    else if(password1 == "") { $('#input-password1').addClass('has-error'); }
    else if(password2 == "") { $('#input-password2').addClass('has-error'); }
  //  if (password.length <= 8) { alert("password must contain atleast 8 characters"); }
  //  if (password != password2) { alert("password didint match");  }
    else {
      $.ajax({
        url        : '/users/register',
        type       : 'POST',
        contentType: 'application/json',
        data       : JSON.stringify({
                          firstname: firstname,
                          lastname: lastname,
                          dob: dob,
                          email: email,
                          password1: password1,
                          password2: password2,
                      }),
        error      : function (res) {
                        console.log(res.status);
                        console.log(res.responseText);
                      },
        success    : function (res) {
                        window.location.href = 'http://127.0.0.1:8080/';
                    }
      });
    }
  });


  // login
  /*
  $('#login-btn').click( function (e) {
    e.preventDefault();
    var email    = $('#input-email').val();
    var password = $('#input-password').val();

    $.ajax({
      url        : '/users/login',
      type       : 'POST',
      contentType: 'application/json',
      data       : JSON.stringify({username: email, password:password}),
      error      : function (res) {
                      console.log(res.status);
                      console.log(res.responseText);
                    },
      success    : function (res) {
                     window.location.href = 'http://127.0.0.1:8080/app/home';
                  }
    });
 });

*/
}); // end Jquery

$(document).ajaxStart(function() {
  $('#login-btn').html("Loading....");
}).ajaxStop(function() {
  $('#login-btn').html("Login");
});
