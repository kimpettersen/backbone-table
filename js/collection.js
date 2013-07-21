'use strict';

define(['model'], function(Row) {

    var Table = Backbone.Collection.extend({
        model: Row,

        initialize: function() {
            this.reverseSortOrder = true;
        },

        comparator: function(data) {
            var val = data.get(this.currentSort);

            if (val === undefined) {
                // Leave collection order as it is.
                return 0;
            }
            // Sort as Number. Ascending or descending
            return this.reverseSortOrder === true ? -Number(val) : Number(val);
        },

        performSortBy: function(sortType) {
            // Takes a String representation of the attribute that you want to sort.
            if (sortType === this.currentSort) {
                this.reverseSortOrder = !this.reverseSortOrder;
            } else {
                this.reverseSortOrder = false;
            }
            this.currentSort = sortType;
            this.sort();
        },

        filterRange: function(options) {
            var attr,
                filtered = this.filter(function(row) {
                    attr = row.get(options.key);
                    return Number(attr) >= Number(options.from) && Number(attr) <= Number(options.to);
                });
            return new Table(filtered);
        },

        addRandomRow: function() {
            var obj = {},
                row;

            obj ={
                a: this.generateRandomVal(),
                b: this.generateRandomVal(),
                c: this.generateRandomVal(),
                d: this.generateRandomVal(),
                e: this.generateRandomVal(),
                f: this.generateRandomVal()
            },

            row = new Row(obj);
            this.add(row);
        },

        generateRandomVal: function() {
            // The random num can be of length between [1, 5]
            var res = '',
                max = Math.floor(Math.random() * 5) + 1,
                opts = '0123456789';

            for (var i = 0; i < max; i++) {
                res += opts.charAt(Math.floor(Math.random() * opts.length));
            }
            // remove leading zero for sorting, blank is also a value
            res = res.replace(/^[0]+/g,'');
            //Randomize positive and negative values
            res *= Math.floor(Math.random()*2) === 1 ? 1 : -1;

            return res;
        }
    });

    return Table;
});