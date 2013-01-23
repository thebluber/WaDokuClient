var WaDokuAPI = {
  api_host: 'http://localhost:10010',
  getResults: function(query, callback) {
    query = query.replace("/", "");
    query = query + "&format=html";
    url = this.api_host + "/api/v1/search" + query;
    console.log(url);
    $.ajax({
      url: url,
      dataType: "jsonp",
      success: callback
    });
  }
};

var add_new_entries = function (results) {
  var i;
  var entry;
  var header, definition;
  entries = results.entries;
  for(i = 0; i < entries.length; i++) {
    // This should probably be done with some kind of templates.
    console.log(entries[i].writing);
    entry = document.createElement('div');
    entry.className = 'entry';
    header = document.createElement('h3');
    header.innerHTML = entries[i].writing;
    definition = document.createElement('p');
    definition.innerHTML = entries[i].definition;
    entry.appendChild(header);
    entry.appendChild(definition);
    $("#entries").append(entry);
  }
};

var register_infinite_scroll = function () {
  var next_page_link = $('a.next_page');
  next_page_link.hide();
};

var load_next_page = function () {
  var next_page_link = $('a.next_page');
  var url = next_page_link.attr("href");
  next_page_link.remove();
  WaDokuAPI.getResults(url, add_new_entries);
};

var balance_columns = function () {
  var entries = $(".entry");
  var entries_left = document.createElement('div');
  var entries_right = document.createElement('div');
  entries_left.className = 'span6';
  entries_right.className = 'span6';
  $("#entries").prepend(entries_right);
  $("#entries").prepend(entries_left);
  $("#entries").removeClass("span12");

  var height = function(collection) {
    return _.reduce(collection, function(res, el) {return res + $(el).height();}, 0);
  };

  console.log("Entries right:");

  entries.remove();
  $(entries_left).append(entries);
  while(height($(entries_left).children()) > height($(entries_right).children()) + 100) {
    var children = $(entries_left).children();
    var switcher = children[children.length - 1];
    switcher.remove();
    $(entries_right).prepend(switcher);
    console.log(height($(entries_left).children()));
    console.log(height($(entries_right).children()));
  }

};

var init = function() {
  balance_columns();
  register_infinite_scroll();
};

$(init);
