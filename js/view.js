'use strict';

define(['collection', 'model'], function(RowCollection, Row) {
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
            var that = this;
            Row.getInitialData(function(data) {
                that.rows = new RowCollection(data);
                that.render();
            });
            this.listenTo(this.rows, 'add remove reset sort change', this.render);
            this.listenTo(this, 'table:filter', this.render);
        },

        render: function() {
            var rows = this.rows.models;

            this.$el.empty();
            var template = _.template($('#table-template').html(),
            {
                rows: rows,
                attrs: this.rows.model.getAllAttrs('allAttrs')
            });

            this.$el.html(template);
        },

        emptyRows: function() {
            this.rows.reset();
        },

        deleteRow: function(e) {
            var cid = e.currentTarget.id,
            model = this.rows.get(cid);
            model.destroy();
        },

        addRow: function(e) {
            var obj = {},
                form,
                row;

            form = $(e.currentTarget).serializeArray();
            _.each(form, function(item) {
                obj[item.name] = item.value;
            });

            row = new Row(obj);

            this.rows.add(row);
            return false;
        },

        addRandomRow: function() {
            this.rows.addRandomRow();
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
            key = cell.data('key'),
            cid = cell.data('cid'),
            model = this.rows.get(cid),
            res = {};

            res[key] = val;
            model.set(res);
        },

        sortColumn: function(e) {
            var type = $(e.currentTarget).data('key');
            this.rows.performSortBy(type);
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

            this.rows = this.rows.allRows ? this.rows.allRows : this.rows;

            filteredRows = this.rows.filterRange({
                from: from,
                to: to,
                key: key
            });

            this.rows.allRows = this.rows;
            this.rows = filteredRows;
            this.trigger('table:filter');
        },
    });

    return View;
});