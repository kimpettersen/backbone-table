'use strict';

define(['backbone'], function(Backbone) {

    var Row = Backbone.Model.extend({
        defaults: {
            a: '',
            b: '',
            c: '',
            d: '',
            e: '',
            f: ''
        }
    },{
    // Class properties
        getAllAttrs: function() {
            return ['a', 'b', 'c', 'd', 'e', 'f'];
        },
        getInitialData: function(cb) {
            var loadedData;
            $.ajax({
                url: '/data/data.json',
                async: false
            }).done(function(response) {
                loadedData = response;
            });
            cb(loadedData);
        }
    });
    return Row;
});