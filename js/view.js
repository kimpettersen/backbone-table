'use strict';

define(['underscore','jquery','backbone', 'collection', 'model'], function(_, $, Backbone, RowCollection, Row) {
    // var loadedData;
    // $.ajax({
    //     url: '/data/data.json',
    //     async: false
    // }).done(function(response) {
    //         loadedData = response;
    //         console.log(loadedData);
    //     });

    // Just did this so I don't need to start the server to use it
    var loadedData = [{'a': 7, 'c': 16, 'b': 17, 'e': 12, 'd': 16, 'f': 10}, {'a': 1, 'c': 17, 'b': 7, 'e': 19, 'd': 13, 'f': 8}, {'a': 0, 'c': 0, 'b': 4, 'e': 4, 'd': 20, 'f': 0}, {'a': 3, 'c': 11, 'b': 17, 'e': 20, 'd': 1, 'f': 6}, {'a': 10, 'c': 17, 'b': 19, 'e': 14, 'd': 16, 'f': 13}, {'a': 16, 'c': 10, 'b': 12, 'e': 14, 'd': 11, 'f': 6}, {'a': 14, 'c': 15, 'b': 0, 'e': 12, 'd': 20, 'f': 17}, {'a': 12, 'c': 16, 'b': 1, 'e': 8, 'd': 16, 'f': 11}, {'a': 20, 'c': 2, 'b': 9, 'e': 14, 'd': 17, 'f': 8}, {'a': 5, 'c': 13, 'b': 20, 'e': 11, 'd': 18, 'f': 10}, {'a': 16, 'c': 19, 'b': 4, 'e': 15, 'd': 3, 'f': 14}, {'a': 7, 'c': 15, 'b': 19, 'e': 13, 'd': 2, 'f': 1}, {'a': 0, 'c': 5, 'b': 15, 'e': 12, 'd': 2, 'f': 5}, {'a': 3, 'c': 15, 'b': 0, 'e': 18, 'd': 20, 'f': 10}, {'a': 3, 'c': 16, 'b': 12, 'e': 2, 'd': 11, 'f': 8}, {'a': 11, 'c': 14, 'b': 3, 'e': 19, 'd': 0, 'f': 7}, {'a': 5, 'c': 16, 'b': 7, 'e': 10, 'd': 14, 'f': 15}, {'a': 13, 'c': 0, 'b': 12, 'e': 11, 'd': 1, 'f': 10}, {'a': 2, 'c': 14, 'b': 12, 'e': 20, 'd': 6, 'f': 8}, {'a': 2, 'c': 16, 'b': 12, 'e': 8, 'd': 10, 'f': 9}, {'a': 1, 'c': 9, 'b': 19, 'e': 14, 'd': 14, 'f': 2}, {'a': 11, 'c': 3, 'b': 13, 'e': 17, 'd': 11, 'f': 3}, {'a': 12, 'c': 10, 'b': 10, 'e': 7, 'd': 19, 'f': 3}, {'a': 8, 'c': 5, 'b': 0, 'e': 20, 'd': 19, 'f': 13}, {'a': 2, 'c': 13, 'b': 0, 'e': 6, 'd': 18, 'f': 5}];

    // Stolen from stackoverflow
    // http://stackoverflow.com/questions/1184624/convert-form-data-to-js-object-with-jquery
    $.fn.serializeObject = function()
    {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    var View = Backbone.View.extend({
        el: $('.tableContainer'),

        // added a few methods that makes it easier to test.
        events: {
            'click .sort': 'sortColumn',
            'click .rangeFilter': 'rangeFilter',
            'click #removeAll': 'emptyRows',
            'click .tableCell': 'enableEdit',
            'click .saveButton': 'saveEdit',
            'click .delete': 'deleteRow',
            'click #addRandomRow': 'addRandomRow',
            'click #reInit': 'initialize',
            'submit #addRow': 'addRow',
        },

        initialize: function() {
            this.rows = new RowCollection(loadedData);
            this.allAttrs = ['a', 'b', 'c', 'd', 'e', 'f'];

            this.on('table:render', this.render);
            this.render();
        },

        render: function() {
            var rows = this.rows.models;

            this.$el.empty();
            var template = _.template($('#table-template').html(),
            {
                rows: rows,
                attrs: this.allAttrs
            });

            this.$el.html(template);
        },

        emptyRows: function() {
            this.rows.reset();
            this.trigger('table:render');
        },

        deleteRow: function(e) {
            var cid = e.currentTarget.id,
            model = this.rows.get(cid);

            this.rows.remove(model);

            this.trigger('table:render');
        },

        addRow: function(e) {
            var obj,
            row;
            obj = $(e.currentTarget).serializeObject(),
            row = new Row(obj);

            this.rows.add(row);
            this.trigger('table:render');
            return false;
        },

        addRandomRow: function() {
            this.rows.addRandomRow();
            this.trigger('table:render');
        },

        enableEdit: function(e) {
            var el = $(e.currentTarget);
            var editEl = el.find('.editValue');
            var cellEl = el.find('.cellValue');

            if (editEl.hasClass('hidden')) {
                $('.editValue:not(.hidden)')
                .addClass('hidden')
                .parent()
                .find('.cellValue')
                .removeClass('hidden');

                cellEl.addClass('hidden');
                editEl.removeClass('hidden');
            }
        },
        saveEdit: function(e) {
            var el = $(e.currentTarget),
            cell = el.closest('.tableCell').find('input'),
            val = cell.val(),
            cid = cell.data('cid'),
            key = cell.data('key'),
            model = this.rows.get(cid);

            // model.set doesn't work?
            // model.set({key: val});
            model.attributes[key] = val;
            this.trigger('table:render');
        },

        sortColumn: function(e) {
            var type = $(e.currentTarget).data('key');

            this.rows.performSortBy(type);
            this.trigger('table:render');
        },

        rangeFilter: function(e) {
            var el = $(e.currentTarget),
            th = el.parent(),
            from = th.find('.rangeFrom').val(),
            to = th.find('.rangeTo').val(),
            key = el.data('key'),
            numRegex = /^[+-]?\d+(\.[\d]+)?$/,
            filteredRows;

            if (numRegex.test(from) !== true || numRegex.test(to) !== true) {
                alert('Must be integers');
                return;
            }

            if (Number(from) > Number(to)) {
                alert('Invalid range');
                return;
            }

            this.rows = this.allRows ? this.allRows : this.rows;

            filteredRows = this.rows.filterRange({
                from: from,
                to: to,
                key: key
            });

            this.allRows = this.rows;
            this.rows = filteredRows;
            this.trigger('table:render');
        },
    });

    return View;
});