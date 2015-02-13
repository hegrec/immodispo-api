var Hoek = require('hoek');
var util = require('./../../lib/util');
var _ = require('lodash');
function Base(sequelize) {
    var self = this;
    var dataMapper = null;
    var daoObject;
    var findIncludes = [];



    function mapDataToModel(dataModel) {
        if (_.isUndefined(dataMapper)) {
            throw new Error('Data model not mapped to domain');
        }

        return dataMapper(dataModel);
    }

    function setDataMapper(mappingFunction) {
        dataMapper = mappingFunction;
    }

    function setDAO(daoObj, includes) {
        daoObject = daoObj;
        findIncludes = includes;
    }

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

        if (_.isUndefined(cb)) {
            cb = params;
            params = {};
        }

        var filters = this.buildFilterParams(params);
        filters.include = findIncludes;


        try {
            daoObject.findAndCountAll(filters).then(function (result) {
                var rows = result.rows,
                    count = result.count,
                    domainModels = [];

                _.each(rows, function (dataRow) {
                    domainModels.push(mapDataToModel(dataRow.dataValues));
                });

                var response = new require("./../../lib/api_response");
                response.body = domainModels;


                response.meta.total = count;
                cb(null, response);

            });
        } catch (e) {
            throw new Error(e);
        }
    }

    function setTableName(newTableName) {
        tableName = newTableName;
    }

    function setSchema(modelSchema) {
        baseSchema = Hoek.applyToDefaults(baseSchema, modelSchema);
    }

    function buildFilterParams(params) {
        var sequelizeWhereFilters = {};

        if (_.isString(params.sort)) {
            if (params.sort.charAt(0) == '-') {
                params.sort = params.sort.substr(1);
                sequelizeWhereFilters.order = [[params.sort,'DESC']];
            } else {
                sequelizeWhereFilters.order = [[params.sort,'ASC']];
            }
        }

        if (_.isNumber(params.limit)) {
            sequelizeWhereFilters.limit = Math.min(500,params.limit);
        } else {
            sequelizeWhereFilters.limit = 20;
        }

        if (_.isNumber(params.start)) {
            //subtract 1 because if they enter start 1, we don't want to offset 1
            sequelizeWhereFilters.offset = params.start - 1;
        }

        if (_.isObject(params.where)) {
            sequelizeWhereFilters.where = {};
            _.forOwn(params.where, function(filter, columnName) {
                if (_.isObject(filter)) {
                    sequelizeWhereFilters.where[columnName] = {};
                        _.forOwn(filter, function (value, operation) {
                        switch(operation) {
                            case 'eq':
                                sequelizeWhereFilters.where[columnName] = value;
                                break;
                            case 'gt':
                                sequelizeWhereFilters.where[columnName].gt = value;
                                break;
                            case 'lt':
                                sequelizeWhereFilters.where[columnName].lt = value;
                                break;
                        }
                    });
                }
            });
        }
        return sequelizeWhereFilters;
    }

    return {
        find: find,
        setTableName: setTableName,
        setSchema: setSchema,
        setDataMapper: setDataMapper,
        setDAO: setDAO,
        buildFilterParams: buildFilterParams
    };
}

module.exports = Base;