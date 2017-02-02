
  var socket = io();

  $(function() {
    $('#send-btn').on('click', function(e) {
      e.preventDefault();

      var msg = $('#input-msg').val();
      socket.emit('chat message', msg);
      $('#input-msg').val('');
      return false;

    });

    socket.on('chat message', function(msg) {
    $('#msg-list').append('<li>' + msg + '</li>');
    });
  });
