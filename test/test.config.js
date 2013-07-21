'use strict';

// Considering that the data only contains Integers, I assumed that the sorting should be done as numbers
// However, you can add any value you wont, they just wont be sorted properly


require.config({
    paths: {
        jquery: '../js/lib/jquery',
        underscore: '../js/lib/underscore',
        backbone: '../js/lib/backbone',
        chai: 'lib/chai',
        mocha: 'lib/mocha',
    },
    urlArgs: "t="+(new Date()).getTime(),
    shim: {
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        underscore: {
            exports: '_'
        },
        mocha: {
            exports: 'mocha'
        }
    }
});

require(['jquery',
          'underscore',
          'backbone',
          'chai',
          'mocha'
          ],
  function($, _, Backbone, chai, mocha) {

    mocha.setup('tdd');
    require(['tableTest'],
        function(tableTest) {
            mocha.run();
        });
});