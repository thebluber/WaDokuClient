var WaDokuAPI = {
  api_host: api_host || 'http://localhost:10010',
  getResults: function(query, callback) {
    query = query.replace("/", "");
    query = query + "&format=html";
    url = this.api_host + "/api/v1/search" + query;
    $.ajax({
      url: url,
      dataType: "jsonp",
      success: callback
    });
  },
  getEntry: function(daaid, callback) {
    url = this.api_host + "/api/v1/entry/" + daaid;
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
  var content, header;
  var new_entries_container;
  var new_entries_div;
  var page_number_title;
  var page_number_title_span;

  var pageNr = $('.entries-container').last().data('pageNr') + 1;
  var total = Math.ceil(results.total / 30);

  // Sanity check
  if(pageNr > total || total === 0) {
    $(".loader").hide();
    $('.next-page-div').hide();
    return;
  }

  entries = results.entries;
  new_entries_container = document.createElement('div');
  new_entries_container.className = 'row entries-container';
  new_entries_div = document.createElement('div');
  new_entries_div.className = 'span12 entries';
  page_number_title = document.createElement('h3');
  page_number_title_span = document.createElement('span');
  page_number_title_span.className = 'span12';
  page_number_title_span.appendChild(page_number_title);
  new_entries_container.appendChild(page_number_title_span);
  new_entries_container.appendChild(new_entries_div);

  var template = $("#entry-template").html();

  for(i = 0; i < entries.length; i++) {
    entries[i].api_host = WaDokuAPI.api_host;
    // This should probably be done with some kind of templates.
    entry = $(Mustache.render(template, entries[i]));
    entry.appendTo(new_entries_div);
  }
  page_number_title.innerHTML = "Seite " + pageNr + " von " + total;
  $(new_entries_container).data('pageNr', pageNr);
  $(new_entries_container).data('query', results.query);
  $(new_entries_container).data('offset', results.offset);
  $('.entries-container').last().after(new_entries_container);
  balance_columns($(new_entries_container));
  if(total !== pageNr) {
    $('.loader').remove();
  }  else {
    $('.loader').hide(); // Effectively stops loading. Somewhat hacky.
    $('.next-page-div').hide();
  }
  $(window).scroll();
};

var register_infinite_scroll = function () {
  var next_page_link = $('a.next_page');
  $(window).scroll(function() {
    if (($(window).scrollTop() > ($(document).height() - $(window).height()) - 100) || $(window).height() === $(document).height() ) {
      load_next_page();
    }
  });
  $('.next_page').on('click', function(el){el.preventDefault(); load_next_page();});
  $(window).scroll();
};

var load_next_page = function () {
  if($(".loader").size() === 0) {
    image = $("<img class='loader' src='/ajax-loader.gif' />");
    last_container = $('.entries-container').last();
    last_container.after(image);
    //var next_page_link = $('a.next_page');
    //var url = next_page_link.attr("href");
    url = "/?query=" + last_container.data('query') + "&offset=" + (last_container.data('offset') + 30);
    WaDokuAPI.getResults(url, add_new_entries);
  }
};

var balance_columns = function (entries_container) {
  var entries = entries_container.find(".entry");
  var entries_left = document.createElement('div');
  var entries_right = document.createElement('div');
  var entries_div = entries_container.find(".entries");
  entries_left.className = 'span6';
  entries_right.className = 'span6';

  entries_div.prepend(entries_right);
  entries_div.prepend(entries_left);
  entries_div.removeClass("span12");

  var height = function(collection) {
    return _.reduce(collection, function(res, el) {return res + $(el).height();}, 0);
  };

  entries.remove();
  $(entries_left).append(entries);

  // Put everything in the right column until it is somewhat even.
  while(height($(entries_left).children()) > height($(entries_right).children()) + 100) {
    var switcher = $(entries_left).children().last();
    switcher.remove();
    $(entries_right).prepend(switcher);
  }

  // Pad the height of the smaller column
  var hlc = $(entries_left).children();
  var hrc = $(entries_right).children();
  var hl = height(hlc);
  var hr = height(hrc);

  var paddee;
  var padding;
  var unpadded;

  if(hl > hr) {
    paddee = hrc;
    unpadded = hlc;
    padding = (hl - hr) / (hrc.length - 1);
  } else {
    paddee = hlc;
    unpadded = hrc;
    padding = (hr - hl) / (hlc.length - 1);
  }
  var i;

  // Pad them all.
  for(i = 0; i < paddee.length - 1; i++) {
    var padding_bottom = parseInt($(paddee[i]).css('padding-bottom'), 10);
    padding_bottom += padding;
    $(paddee[i]).css('padding-bottom', padding_bottom);
  }
};

var register_popups = function() {
  $(".content").on('mouseenter',"a[href^='/entries/by-daid/']", function(ev) {
    //ev.preventDefault();
    el = $(this);
    // Load only once.
    if(el.data('popup-initialized')) {
      return;
    }
    el.data('popup-initialized', true);
    var template = $("#entry-template").html();
    var one_entry = function(content) {
      el.popover({
        title: "Eintrag",
        placement: "bottom",
        trigger: "hover",
        html: true,
        content: Mustache.render(template,content)});
      el.popover("show");
    };
    var daaid = this.href.match(/\d+$/)[0];
    WaDokuAPI.getEntry(daaid, one_entry);
  }
  );
};

var register_audio = function() {

  soundManager.setup({
    url: '/swf/' // TODO make this dynamic.
  });

  $('.content').on('click', 'a.pronunciation_audio', function(ev) {
    ev.preventDefault();
    el = $(this);
    audio = soundManager.createSound({
      id: "pronunciation",
      url: el.attr('href')
    });
    audio.play();
  });


};

var init = function() {
  register_infinite_scroll();
  register_popups();
  register_audio();
  balance_columns($('.entries-container').last());
};

$(init);
