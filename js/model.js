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
    });

    return Row;
});