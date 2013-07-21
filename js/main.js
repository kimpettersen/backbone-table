'use strict';

// Considering that the data only contains Integers, I assumed that the sorting should be done as numbers
// However, you can add any value you wont, they just wont be sorted properly


require.config({
    paths: {
        jquery: 'lib/jquery',
        underscore: 'lib/underscore',
        backbone: 'lib/backbone'
    },
    shim: {
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        underscore: {
            exports: '_'
        },
    },
    urlArgs: 't=' + (new Date()).getTime()

});

require(['view'], function(Table) {
    new Table();
});