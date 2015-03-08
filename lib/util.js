var _ = require('lodash');

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

module.exports = {
    generateFileName: function() {
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
    },
    isDefined: function(value) {
        return !(_.isNull(value) || _.isUndefined(value));
    },
    queryToFilter: function(query) {
        var filter = {},
            filters = {},
            unparsedFilter;

        if (query.sort) {
            filter.sort = query.sort;
        }

        if (query.limit) {
            filter.limit = Number(query.limit);
        }

        if (query.start) {
            filter.start = Number(query.start);
        }

        if (query.include) {
            filter.include = query.include.split(',');
        }

        if (query.filter) {
            unparsedFilter = query.filter;

            if (_.isString(unparsedFilter)) {
                unparsedFilter = [unparsedFilter];
            }

            _.each(unparsedFilter, function(filter) {
                var split = filter.split("="),
                    operator = "eq",
                    field,
                    value;


                if (filter.indexOf("~>") !== -1) {
                    split = filter.split("~>");
                    operator = "startswith";
                } else if (filter.indexOf(">") !== -1) {
                    split = filter.split(">");
                    operator = "gt";
                } else if (filter.indexOf("<") !== -1) {
                    split = filter.split("<");
                    operator = "lt";
                }
                field = split[0];
                value = split[1];

                filters[field] = filters[field] || {};
                filters[field][operator] = value;

            });

            filter.where = filters;
        } else {
            filter.where = {};
        }

        return filter;
    },

    mysql_real_escape_string: function mysql_real_escape_string (str) {
        if (str === null) return null;
        if (str === undefined) return null;

    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
            // and double/single quotes
        }
    });
}
};