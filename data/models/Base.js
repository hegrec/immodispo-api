var squel = require('squel');
var Hoek = require('hoek');
var _ = require('lodash');
function Base(pool) {
    var tableName = 'base';
    var baseSchema = {
        id: Number,
        createdAt: Date,
        updatedAt: Date
    };

    /**
     * Custom query parameter find for domain models
     * queryParams = {
     *     sort: 'fieldName' OR '-fieldName' for DESC
     *     limit: 100
     * }
     * @param params
     * @param cb
     */
    function find(params, cb) {
        var select = squel.select().from(tableName),
            sortDirection = true; //ASC;

        if (_.isUndefined(cb)) {
            cb = params;
            params = {};
        }

        select = this.buildFilterParams(params, select);

        var query = select.toString();
        console.log(query);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, rows, fields) {
                connection.release();
                if (err) {
                    return cb(err);
                }

                cb(null, rows);
            });
        });

    }

    function get(id, cb) {
        pool.getConnection(function(err, connection) {
            connection.query('SELECT * FROM ' + tableName + ' WHERE id=' + Number(id), function (err, result, fields) {
                connection.release();
                if (err) {
                    return cb(err);
                }

                cb(null, result[0]);
            });
        });
    }

    /**
     * Pass a datamap to each required column to create and persist a new domain model
     * @param data
     * @param cb
     */
    function create(data, cb) {

        var insert = squel.insert()
            .into(tableName);

        var nowMysqlTIME = new Date().toISOString().slice(0, 19).replace('T', ' ');
        data.createdAt = nowMysqlTIME;
        data.updatedAt = nowMysqlTIME;

        _.forOwn(data, function(val, key) {
           if (!_.isUndefined(val)) {
               insert = insert.set(key, val);
           }
        });
        var query = insert.toString();
        console.log(query);
        pool.getConnection(function(err, connection) {
            connection.query(query, function (err, result) {
                connection.release();
                if (err) {
                    return cb(err);
                }

                if (_.isNumber(result.insertId)) {
                    get(result.insertId, function (err, result) {

                        if (err) {
                            return cb(err);
                        }

                        cb(null, result);
                    });
                } else {
                    cb("Failed to insert data " + data.toString(), null);
                }


            });
        });
    }

    function setTableName(newTableName) {
        tableName = newTableName;
    }

    function setSchema(modelSchema) {
        baseSchema = Hoek.applyToDefaults(baseSchema, modelSchema);
    }

    function buildFilterParams(params, select) {

        if (_.isString(params.sort)) {
            if (params.sort.charAt(0) == '-') {
                params.sort = params.sort.substr(1);
                sortDirection = false;
            }

            select.order(params.sort, sortDirection);
        } else {
            select.order(tableName+".id");
        }

        if (_.isNumber(params.limit)) {
            select.limit(params.limit);
        } else {
            select.limit(50);
        }

        if (_.isNumber(params.start)) {
            //subtract 1 because if they enter start 1, we don't want to offset 1
            select.offset(params.start-1);
        }

        if (_.isObject(params.where)) {
            _.forOwn(params.where, function(filter, columnName) {
                if (_.isObject(filter)) {
                    _.forOwn(filter, function (value, operation) {
                        switch(operation) {
                            case 'equals':
                                if (_.isString(value)) {
                                    value = "\'" + pool.escape(value) + "\'";
                                }
                                select.where(columnName + '=' + value);
                                break;
                            case 'between':
                                select.where(columnName + 'BETWEEN ' + value[0] + ' and ' + value[1]);
                                break;

                            case 'gt':
                                select.where(columnName + '>' + value);
                                break;

                            case 'lt':
                                select.where(columnName + '<' + value);
                                break;


                        }

                    });
                }
            });
        }

        return select;
    }


    return {
        find: find,
        create: create,
        setTableName: setTableName,
        setSchema: setSchema,
        buildFilterParams: buildFilterParams
    };
}

module.exports = Base;