function search() {
  $.ajax({
    type: 'GET',
    url: '/torrent/search',
    processData: false,
    contentType: false
  }).done(function(data) { render(data) })
    .fail(function(data) { render(data) });
}


function render(data) {
  var list = $('#torrent_list')[0];
  var needRefresh = false;

  if (data.error || data.message) {
    while (list.rows.length > 1) {
      list.deleteRow(1);
    }
    var tr = list.insertRow(1);
    tr.className = 'warning';
    var td = tr.insertCell(0);
    td.colSpan=5
    td.innerText = data.error ? data.error : data.message;
  } else {
    $('tr.warning').remove();

    data.data.forEach((row) => {
      var rowid = 'row' + row.rowid;
      var tr = $('#' + rowid)[0];
      if (!tr) {
        tr = list.insertRow(1);
        tr.id = rowid;
        tr.insertCell(0).innerText = row.rowid;
        tr.insertCell(1).innerText = row.name;
        tr.insertCell(2).innerText = formatLength(row.length);
        var cell3 = tr.insertCell(3);
        formatProgress(cell3, row.rowid, row.progress);
        var cell4 = tr.insertCell(4);
        cell4.innerText = row.status;
        cell4.id = 'status' + row.rowid;
      } else {
        $('#progress' + row.rowid).css('width', row.progress + '%');
        $('#status' + row.rowid).text(row.status);
      }

      if (row.status == 'DOWNLOAD') {
        tr.className = 'info';
      } else if (row.status == 'DONE') {
        tr.className = 'success';
      }

      if (row.status == 'DOWNLOAD' || row.status == 'READY') {
        needRefresh = true;
      }
    });
  }

  if (needRefresh) {
    setTimeout(search, 5000);
  }
}


function formatLength(length) {
  if (length < 1024) return length + ' Bytes';
  length /= 1024;
  if (length < 1024) return length.toFixed(2) + ' KB';
  length /= 1024;
  if (length < 1024) return length.toFixed(2) + ' MB';
  length /= 1024;
  return length.toFixed(2) + ' GB';
}


function formatProgress(td, rowid, progress) {
  var div1 = document.createElement('div');
  td.appendChild(div1);
  div1.className = 'progress';
  var div2 = document.createElement('div'); 
  div1.appendChild(div2);
  div2.className = 'progress-bar progress-bar-success progress-bar-striped';
  div2.style = 'width: ' + progress + '%';
  div2.id = 'progress' + rowid;
}

search();

