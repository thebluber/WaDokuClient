'use strict';
/*global $, jQuery, alert*/
/*
 * API server interactions
 */
var api_host1, api_host2, api_version;
//api_host1: stroke number and order free
//api_host2: stroke number and order dependent
var api = {
  api_version: api_version || '/api/v1',

  api_host(ignoreOrder) {
    return ignoreOrder ? api_host2 : api_host1;
  },
  //strokes in the nested array form
  getScores(strokes, n_best, success, error, ignoreOrder) {
    var url = this.api_host(ignoreOrder) + this.api_version + '/scores';
    $.ajax({
      url: url,
      type: 'POST',
      dataType: 'json',
      data: {
        strokes: JSON.stringify(strokes),
        n_best: n_best
      },
      done: function(response) {
        console.log(response);
      },
      fail: function(response) {
        console.log(response);
      },
      success: success,
      error: error
    })
  }

}


