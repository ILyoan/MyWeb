function add_torrent(e) {
  var torrent = $('#torrent_file');
  var magnet = $('#torrent_magnet').val();
   
  if (magnet) {
    $.post('/torrent/add/magnet', { magnet: magnet })
      .done(function(data) { alert_message(data) })
      .fail(function(data) { alert_message(data) });
  } else if (torrent.val()) {
    var formData = new FormData();
    formData.append('torrent', torrent[0].files[0]);
    $.ajax({
      type: 'POST',
      url: '/torrent/add/torrent',
      data: formData,
      processData: false,
      contentType: false
    }).done(function(data) { alert_message(data) })
      .fail(function(data) { alert_message(data) });
  } else {
    alert_message({success: false, message: 'No torrent provided'});
  }
}


function alert_message(data) {
  var msg = $('#message');
  if (data.success) {
    msg.addClass('alert-success');
    msg.removeClass('alert-warning');
  } else {
    msg.addClass('alert-warning');
    msg.removeClass('alert-success');
  }
  msg.text(data.message);
}


$('#btn_register').on('click', add_torrent);

